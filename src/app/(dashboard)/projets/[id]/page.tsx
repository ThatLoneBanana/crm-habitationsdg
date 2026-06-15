'use client';

import { useState, useEffect, use } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { CeduleTab } from '@/components/cedule/cedule-tab';
import CedulaEditor from '@/components/cedule/CedulaEditor';
import { ExtrasTab } from '@/components/projets/extras-tab';
import { PaiementsTab } from '@/components/projets/paiements-tab';
import { DocumentsTab } from '@/components/projets/documents-tab';
import { CedulePDFDialog } from '@/components/projets/cedule-pdf-dialog';
import { GCRTab } from '@/components/projets/gcr-tab';
import { formatDate, formatMontant } from '@/lib/utils';
import { Printer, Send, Eye, MapPin, FileText, Calendar, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProjetPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjetDetailPage({ params: paramPromise }: ProjetPageProps) {
  const params = use(paramPromise);
  const router = useRouter();
  const [projet, setProjet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [modifierOpen, setModifierOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [utilisateurs, setUtilisateurs] = useState<any[]>([]);
  const [cedulaModalOpen, setCedulaModalOpen] = useState(false);
  const [nouvellesEtapes, setNouvellesEtapes] = useState<any[]>([]);
  const [costing, setCosting] = useState<any>(null);
  const [costingLoading, setCostingLoading] = useState(false);
  const [modifierCedulaOpen, setModifierCedulaOpen] = useState(false);
  const [etapesModifiees, setEtapesModifiees] = useState<any[]>([]);
  const [savingCedule, setSavingCedule] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [margeCeduleJours, setMargeCeduleJours] = useState(5);
  const [parametresEntreprise, setParametresEntreprise] = useState<any>(null);

  useEffect(() => {
    const fetchProjet = async () => {
      try {
        // Page interne authentifiée → données COMPLÈTES (id, slug, vendeur,
        // finances, étapes internes...). Le paramètre peut être un slug ou un
        // UUID, l'API /api/projets/[id] résout les deux.
        // NE PAS utiliser /api/projets-by-slug ici : c'est la route PUBLIQUE
        // filtrée pour la vue client, qui ne renvoie ni l'id ni le slug ni les
        // champs internes (sinon id/slug seraient undefined ⇒ /p/undefined,
        // extras sans projetId, modification sur /api/projets/undefined).
        const res = await fetch(`/api/projets/${params.id}`);

        if (!res.ok) throw new Error('Projet non trouvé');
        const data = await res.json();
        setProjet(data.projet);

        // Charger les utilisateurs
        const usersRes = await fetch('/api/users');
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUtilisateurs(usersData.users || []);
        }

        // Charger la marge de cédule (paramètre d'entreprise)
        const paramRes = await fetch('/api/parametres');
        if (paramRes.ok) {
          const paramData = await paramRes.json();
          setParametresEntreprise(paramData.parametres || null);
          const marge = paramData.parametres?.margeCeduleJours;
          if (typeof marge === 'number') setMargeCeduleJours(marge);
        }

        // Charger le costing
        setCostingLoading(true);
        const costingRes = await fetch(`/api/projets/costing?projetId=${data.projet.id}`);
        if (costingRes.ok) {
          const costingData = await costingRes.json();
          setCosting(costingData.calculs);
        }
        setCostingLoading(false);
      } catch (err) {
        console.error('Erreur:', err);
        setProjet(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProjet();
  }, [params.id]);

  // Initialiser les étapes quand le dialog s'ouvre
  useEffect(() => {
    if (modifierCedulaOpen && projet?.taches) {
      const etapesProjet = projet.taches
        .sort((a: any, b: any) => a.ordre - b.ordre)
        .map((t: any) => ({
          id: t.id,
          nom: t.nom,
          ordre: t.ordre,
          jours: t.dureeJours,
          dateDebut: new Date(t.dateDebut),
          dateFin: new Date(t.dateFin),
          buffer: t.buffer || 0,
          assigneA: t.assigneA || 'Interne',
          visibleClient: t.visibleClient,
          interne: t.interne,
        }));
      setEtapesModifiees(etapesProjet);
    }
  }, [modifierCedulaOpen]);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Chargement...
      </div>
    );
  }

  if (!projet) {
    return (
      <div className="p-8 text-center text-gray-500">
        Projet non trouvé
      </div>
    );
  }

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet? Cela supprimera aussi toutes les étapes, paiements et extras.')) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/projets/${projet.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Erreur suppression');
      router.push('/projets');
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleModifierProjet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const vendeurIdValue = formData.get('vendeurId');
    const chargeProjetIdValue = formData.get('chargeProjetId');

    try {
      const res = await fetch(`/api/projets/${projet.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adresse: formData.get('adresse'),
          ville: formData.get('ville'),
          typeProjet: formData.get('typeProjet'),
          typeContrat: formData.get('typeContrat'),
          montantTotal: parseFloat(formData.get('montantTotal') as string),
          dateContrat: formData.get('dateContrat'),
          dateLivraison: formData.get('dateLivraison'),
          phase: formData.get('phase'),
          vendeurId: vendeurIdValue === 'none' ? null : vendeurIdValue,
          chargeProjetId: chargeProjetIdValue === 'none' ? null : chargeProjetIdValue,
        })
      });

      if (res.ok) {
        setModifierOpen(false);
        router.refresh();
      } else {
        // Remonter l'erreur RÉELLE de l'API plutôt qu'un message vague.
        const d = await res.json().catch(() => ({}));
        alert('Erreur lors de la modification : ' + (d.error || res.statusText || `HTTP ${res.status}`));
      }
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleSauvegarderCedule = async () => {
    setSavingCedule('loading');
    try {
      const res = await fetch(`/api/projets/${projet.id}/cedule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          etapes: etapesModifiees.map((e: any) => ({
            id: e.id || null,
            nom: e.nom,
            ordre: e.ordre,
            dureeJours: e.jours,
            dateDebut: e.dateDebut instanceof Date ? e.dateDebut.toISOString() : e.dateDebut,
            dateFin: e.dateFin instanceof Date ? e.dateFin.toISOString() : e.dateFin,
            assigneA: e.assigneA,
            visibleClient: e.visibleClient,
            interne: e.interne,
            buffer: e.buffer || 0,
          }))
        })
      });

      if (res.ok) {
        setSavingCedule('success');
        setModifierCedulaOpen(false);
        router.refresh();
      } else {
        setSavingCedule('error');
      }
    } catch (err) {
      setSavingCedule('error');
    }
  };

  // Calculs
  const avancement = projet.taches.length > 0
    ? Math.round(
        (projet.taches.filter((t: any) => t.statut === 'COMPLETE').length /
          projet.taches.length) *
          100
      )
    : 0;

  const joursRestants = projet.dateLivraison
    ? Math.ceil(
        (new Date(projet.dateLivraison).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const totalExtrasSignes = projet.extras
    .filter((e: any) => e.statut === 'SIGNE')
    .reduce((sum: number, e: any) => sum + e.montant, 0);

  const phaseColors: Record<string, string> = {
    SIGNE: 'bg-blue-100 text-blue-800',
    VENTE: 'bg-blue-100 text-blue-800',
    ADMIN: 'bg-purple-100 text-purple-800',
    PREPARATION: 'bg-yellow-100 text-yellow-800',
    CHANTIER: 'bg-orange-100 text-orange-800',
    LIVRAISON: 'bg-green-100 text-green-800',
    CLOTURE: 'bg-gray-100 text-gray-800',
  };

  const phaseLabels: Record<string, string> = {
    SIGNE: 'Signé',
    VENTE: 'Vente',
    ADMIN: 'Admin',
    PREPARATION: 'Préparation',
    CHANTIER: 'Chantier',
    LIVRAISON: 'Livraison',
    CLOTURE: 'Clôturé',
  };

  const getPhaseColor = (phase: string | null | undefined) => phaseColors[phase || 'SIGNE'] || phaseColors['SIGNE'];
  const getPhaseLabel = (phase: string | null | undefined) => phaseLabels[phase || 'SIGNE'] || phaseLabels['SIGNE'];

  const isUrgent = joursRestants !== null && joursRestants < 30;
  const isOverdue = joursRestants !== null && joursRestants < 0;

  return (
    <div className="p-8 space-y-8">
      {/* Boutons d'action */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" className="gap-2" onClick={() => setModifierOpen(true)}>
          <i className='ti ti-edit' aria-hidden='true'></i>
          Modifier
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => window.open(`/p/${projet.slug}`, '_blank')}>
          <Eye className="w-4 h-4" />
          Vue client
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => setPrintDialogOpen(true)}>
          <Printer className="w-4 h-4" />
          Imprimer
        </Button>
        <Button variant="outline" className="gap-2" disabled title="Bientôt disponible">
          <Send className="w-4 h-4" />
          Envoyer au client
        </Button>
        <Button
          variant="outline"
          className="gap-2 text-red-600 hover:bg-red-50"
          onClick={handleDelete}
          disabled={deleting}
        >
          <Trash2 className="w-4 h-4" />
          {deleting ? 'Suppression...' : 'Supprimer'}
        </Button>
      </div>

      {/* Entête */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">{projet.adresse}, {projet.ville}</h1>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <MapPin className="w-4 h-4" />
              <span>Client: {projet.client.prenom} {projet.client.nom}</span>
            </div>
          </div>
          <div className="text-right space-y-2">
            <Badge className={getPhaseColor(projet.phase)}>
              {getPhaseLabel(projet.phase)}
            </Badge>
            {isOverdue && <Badge className="bg-red-100 text-red-800">EN RETARD</Badge>}
            {isUrgent && !isOverdue && <Badge className="bg-orange-100 text-orange-800">URGENT</Badge>}
          </div>
        </div>

        {/* Vue d'ensemble — 4 stats (style REF : hairlines, eyebrow + valeur) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <div style={{ background: 'var(--surface)', padding: '14px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)' }}>Client</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 3, color: 'var(--text-primary)' }}>{projet.client.prenom} {projet.client.nom}</div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>{projet.client.email}</div>
          </div>
          <div style={{ background: 'var(--surface)', padding: '14px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)' }}>Vendeur</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 3, color: 'var(--text-primary)' }}>{projet.vendeur ? `${projet.vendeur.prenom} ${projet.vendeur.nom}` : 'Non assigné'}</div>
          </div>
          <div style={{ background: 'var(--surface)', padding: '14px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)' }}>Chargé de projet</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 3, color: 'var(--text-primary)' }}>{projet.chargeProjet ? `${projet.chargeProjet.prenom} ${projet.chargeProjet.nom}` : 'Non assigné'}</div>
          </div>
          <div style={{ background: 'var(--surface)', padding: '14px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)' }}>Livraison</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 3, color: joursRestants !== null && joursRestants < 14 ? 'var(--danger)' : 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{formatDate(projet.dateLivraison)}</div>
            {joursRestants !== null && (
              <div style={{ fontSize: 11, marginTop: 1, color: joursRestants < 0 ? 'var(--danger)' : 'var(--text-tertiary)' }}>
                {joursRestants < 0 ? `${Math.abs(joursRestants)} j. en retard` : `${joursRestants} j. restants`}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Métriques — cards sobres (tokens DG, plus de bleu plein) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        {[
          { label: 'Avancement', value: `${avancement}%` },
          { label: 'Étapes', value: projet.taches.length },
          { label: 'Extras', value: projet.extras.length },
          { label: 'Extras signés', value: formatMontant(totalExtrasSignes) },
          { label: 'Paiements', value: projet.paiements.length },
        ].map((m, i) => (
          <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '13px 15px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 7 }}>{m.label}</div>
            <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.15, letterSpacing: '-0.018em', color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Onglets */}
      <Tabs defaultValue="cedule" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="cedule">
            Cédule ({projet.taches.length})
          </TabsTrigger>
          <TabsTrigger value="extras">
            Extras ({projet.extras.length})
          </TabsTrigger>
          <TabsTrigger value="paiements">
            Paiements ({projet.paiements.length})
          </TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="costing">Costing</TabsTrigger>
          <TabsTrigger value="gcr">GCR</TabsTrigger>
        </TabsList>

        <div className="p-6">
          <TabsContent value="cedule" className="m-0">
            {projet.taches.length === 0 ? (
              <div style={{
                margin: '24px',
                padding: '24px',
                border: '2px dashed #E5E7EB',
                borderRadius: '12px',
                textAlign: 'center',
                background: '#F9FAFB',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>📋</div>
                <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '6px' }}>Aucune cédule créée</div>
                <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>
                  Créez la cédule de ce projet pour planifier les étapes de construction
                </div>
                <button
                  onClick={() => setCedulaModalOpen(true)}
                  style={{
                    padding: '10px 24px',
                    background: '#1D9E75',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 500,
                  }}
                >
                  + Créer la cédule
                </button>
              </div>
            ) : (
              <CeduleTab
                taches={projet.taches}
                projectId={projet.id}
                toleranceJours={projet.toleranceJours}
                onModifierClick={() => setModifierCedulaOpen(true)}
              />
            )}
          </TabsContent>

          <TabsContent value="extras" className="m-0">
            <ExtrasTab extras={projet.extras} projectId={projet.id} />
          </TabsContent>

          <TabsContent value="paiements" className="m-0">
            <PaiementsTab
              paiements={projet.paiements}
              typeContrat={projet.typeContrat}
              projectId={projet.id}
            />
          </TabsContent>

          <TabsContent value="documents" className="m-0">
            <DocumentsTab projectId={projet.id} />
          </TabsContent>

          <TabsContent value="costing" className="m-0">
            {costingLoading ? (
              <div className="p-8 text-center text-gray-500">Chargement du costing...</div>
            ) : costing ? (
              <div className="space-y-6 p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <p className="text-xs text-gray-500">Revenus</p>
                    <p className="text-2xl font-bold text-green-600">${costing.revenues.toLocaleString('fr-CA', { maximumFractionDigits: 0 })}</p>
                    <p className="text-xs text-gray-500 mt-2">Contrat: ${costing.montantContrat.toLocaleString('fr-CA', { maximumFractionDigits: 0 })}</p>
                    <p className="text-xs text-gray-500">+ Extras: ${costing.extrasSignes.toLocaleString('fr-CA', { maximumFractionDigits: 0 })}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <p className="text-xs text-gray-500">Dépenses</p>
                    <p className="text-2xl font-bold text-red-600">-${costing.totalDepenses.toLocaleString('fr-CA', { maximumFractionDigits: 0 })}</p>
                  </div>
                  <div className={`p-4 rounded-lg border ${costing.marge >= 20 ? 'bg-green-50' : costing.marge >= 10 ? 'bg-orange-50' : 'bg-red-50'}`}>
                    <p className="text-xs text-gray-500">Profit Net</p>
                    <p className={`text-2xl font-bold ${costing.profitNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>${costing.profitNet.toLocaleString('fr-CA', { maximumFractionDigits: 0 })}</p>
                    <p className={`text-sm font-bold mt-2 ${costing.marge >= 20 ? 'text-green-700' : costing.marge >= 10 ? 'text-orange-700' : 'text-red-700'}`}>Marge: {costing.marge.toFixed(1)}%</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-semibold mb-4">Détails des dépenses</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Matériaux</span><span>-${costing.depensesMateriaux.toLocaleString('fr-CA', { maximumFractionDigits: 0 })}</span></div>
                    <div className="flex justify-between"><span>Sous-traitants</span><span>-${costing.depensesSousTraitants.toLocaleString('fr-CA', { maximumFractionDigits: 0 })}</span></div>
                    <div className="flex justify-between"><span>Équipement</span><span>-${costing.depensesEquipement.toLocaleString('fr-CA', { maximumFractionDigits: 0 })}</span></div>
                    <div className="flex justify-between"><span>Autres</span><span>-${costing.depensesAutre.toLocaleString('fr-CA', { maximumFractionDigits: 0 })}</span></div>
                    <div className="border-t pt-2 mt-2 font-semibold flex justify-between"><span>Main d'œuvre</span><span>-${costing.depensesMainOeuvre.toLocaleString('fr-CA', { maximumFractionDigits: 0 })}</span></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">Données costing non disponibles</div>
            )}
          </TabsContent>

          <TabsContent value="gcr" className="m-0">
            <GCRTab projectId={projet.id} />
          </TabsContent>
        </div>
      </Tabs>

      {/* Dialog Modifier le projet */}
      <Dialog open={modifierOpen} onOpenChange={setModifierOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Modifier le projet</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleModifierProjet} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium'>Adresse</label>
                <Input defaultValue={projet.adresse} name='adresse' />
              </div>
              <div>
                <label className='text-sm font-medium'>Ville</label>
                <Input defaultValue={projet.ville} name='ville' />
              </div>
              <div>
                <label className='text-sm font-medium'>Type de projet</label>
                <Select name='typeProjet' defaultValue={projet.typeProjet}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value='JUMELE'>Jumelé</SelectItem>
                    <SelectItem value='MAISON'>Maison</SelectItem>
                    <SelectItem value='MULTILOGEMENT'>Multilogement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className='text-sm font-medium'>Type de contrat</label>
                <Select name='typeContrat' defaultValue={projet.typeContrat}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value='PRELIMINAIRE'>Préliminaire</SelectItem>
                    <SelectItem value='ENTREPRISE'>Entreprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className='text-sm font-medium'>Montant du contrat ($)</label>
                <Input type='number' defaultValue={projet.montantTotal} name='montantTotal' step='0.01' />
              </div>
              <div>
                <label className='text-sm font-medium'>Date du contrat</label>
                <Input type='date' defaultValue={projet.dateContrat?.split('T')[0] || ''} name='dateContrat' />
              </div>
              <div>
                <label className='text-sm font-medium'>Date de livraison</label>
                <Input type='date' defaultValue={projet.dateLivraison?.split('T')[0] || ''} name='dateLivraison' />
              </div>
              <div>
                <label className='text-sm font-medium'>Phase</label>
                <Select name='phase' defaultValue={projet.phase || 'SIGNE'}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value='SIGNE'>Signé</SelectItem>
                    <SelectItem value='PREPARATION'>Préparation</SelectItem>
                    <SelectItem value='CHANTIER'>Chantier</SelectItem>
                    <SelectItem value='LIVRAISON'>Livraison</SelectItem>
                    <SelectItem value='TERMINE'>Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className='text-sm font-medium'>Vendeur</label>
                <Select name='vendeurId' defaultValue={projet.vendeurId || 'none'}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value='none'>Aucun</SelectItem>
                    {utilisateurs.filter((u: any) => u.role === 'VENDEUR').map((v: any) => (
                      <SelectItem key={v.id} value={v.id}>{v.prenom} {v.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className='text-sm font-medium'>Chargé de projet</label>
                <Select name='chargeProjetId' defaultValue={projet.chargeProjetId || 'none'}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value='none'>Aucun</SelectItem>
                    {utilisateurs.filter((u: any) => u.role === 'CHARGE_PROJET').map((u: any) => (
                      <SelectItem key={u.id} value={u.id}>{u.prenom} {u.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='flex justify-end gap-3 pt-4'>
              <Button type='button' variant='outline' onClick={() => setModifierOpen(false)}>Annuler</Button>
              <Button type='submit'>Sauvegarder</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog créer la cédule */}
      <Dialog open={cedulaModalOpen} onOpenChange={setCedulaModalOpen}>
        <DialogContent className='!max-w-[95vw] !w-[95vw] !h-[95vh] flex flex-col p-0'>
          <DialogHeader className='px-6 py-4 border-b flex-shrink-0'>
            <DialogTitle>Créer la cédule — {projet?.adresse}, {projet?.ville}</DialogTitle>
          </DialogHeader>

          <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
            <CedulaEditor
              mode='creation'
              etapesInitiales={[]}
              typeProjet={projet?.typeProjet}
              dateLivraison={new Date(projet?.dateLivraison)}
              fournisseurs={utilisateurs}
              margeCeduleJours={margeCeduleJours}
              onChange={setNouvellesEtapes}
            />
          </div>

          <div style={{ padding: '16px 24px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'flex-end', gap: '10px', flexShrink: 0 }}>
            <button
              onClick={() => setCedulaModalOpen(false)}
              style={{ padding: '10px 20px', border: '1px solid #E5E7EB', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '13px' }}
            >
              Annuler
            </button>
            <button
              onClick={async () => {
                try {
                  const res = await fetch(`/api/projets/${projet.id}/cedule`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      etapes: nouvellesEtapes.map((e: any) => ({
                        nom: e.nom,
                        ordre: e.ordre,
                        dureeJours: e.jours,
                        dateDebut: e.dateDebut instanceof Date ? e.dateDebut.toISOString() : e.dateDebut,
                        dateFin: e.dateFin instanceof Date ? e.dateFin.toISOString() : e.dateFin,
                        assigneA: e.assigneA,
                        visibleClient: e.visibleClient,
                        interne: e.interne,
                        buffer: e.buffer || 0,
                      }))
                    })
                  });
                  if (res.ok) {
                    setCedulaModalOpen(false);
                    router.refresh();
                  }
                } catch (err) {
                  console.error('Erreur:', err);
                }
              }}
              style={{ padding: '10px 24px', background: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
            >
              ✓ Valider et créer la cédule
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Modifier Cédule */}
      <Dialog open={modifierCedulaOpen} onOpenChange={setModifierCedulaOpen}>
        <DialogContent className='!max-w-[98vw] !w-[98vw] !h-[96vh] !p-0 flex flex-col'>
          <DialogTitle className='sr-only'>Modifier la cédule du projet</DialogTitle>
          {/* Entête du dialog */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 600 }}>Modifier la cédule</h2>
              {projet && (
                <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                  {projet.adresse}, {projet.ville} — Livraison le {formatDate(projet.dateLivraison)}
                </p>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setModifierCedulaOpen(false)}
                style={{ padding: '8px 16px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', background: 'white' }}
              >
                Annuler
              </button>
              <button
                onClick={handleSauvegarderCedule}
                disabled={savingCedule === 'loading'}
                style={{ padding: '8px 16px', background: savingCedule === 'loading' ? '#999' : '#DC2626', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: savingCedule === 'loading' ? 'not-allowed' : 'pointer', fontWeight: 500 }}
              >
                {savingCedule === 'loading' ? '⏳ Sauvegarde...' : '✓ Sauvegarder les modifications'}
              </button>
            </div>
          </div>

          {/* CedulaEditor en mode projet */}
          <div style={{ flex: 1, overflow: 'auto', padding: '0' }}>
            {etapesModifiees.length > 0 && (
              <CedulaEditor
                mode='projet'
                etapesInitiales={etapesModifiees}
                typeProjet={projet?.typeProjet}
                dateLivraison={projet ? new Date(projet.dateLivraison) : new Date()}
                fournisseurs={[]}
                margeCeduleJours={margeCeduleJours}
                toleranceJours={projet?.toleranceJours || 3}
                onChange={setEtapesModifiees}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog impression PDF */}
      <CedulePDFDialog
        open={printDialogOpen}
        onOpenChange={setPrintDialogOpen}
        projet={projet}
        parametres={parametresEntreprise}
      />
    </div>
  );
}
