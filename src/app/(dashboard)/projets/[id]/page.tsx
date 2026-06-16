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
import { EcheancierTableauDialog } from '@/components/projets/echeancier-tableau-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { GCRTab } from '@/components/projets/gcr-tab';
import { CostingTab } from '@/components/projets/costing-tab';
import { formatDate, formatMontant } from '@/lib/utils';
import { calculateTaskStatus } from '@/lib/task-status';
import { useRouter } from 'next/navigation';

const PHASES: Record<string, { label: string; tint: string; ink: string; bar: string }> = {
  SIGNE:       { label: 'Signé',       tint: 'var(--phase-signe-tint)',       ink: 'var(--phase-signe-ink)',       bar: 'var(--phase-signe-bar)' },
  PREPARATION: { label: 'Préparation', tint: 'var(--phase-preparation-tint)', ink: 'var(--phase-preparation-ink)', bar: 'var(--phase-preparation-bar)' },
  CHANTIER:    { label: 'Chantier',    tint: 'var(--phase-chantier-tint)',    ink: 'var(--phase-chantier-ink)',    bar: 'var(--phase-chantier-bar)' },
  LIVRAISON:   { label: 'Livraison',   tint: 'var(--phase-livraison-tint)',   ink: 'var(--phase-livraison-ink)',   bar: 'var(--phase-livraison-bar)' },
  TERMINE:     { label: 'Terminé',     tint: 'var(--phase-termine-tint)',     ink: 'var(--phase-termine-ink)',     bar: 'var(--phase-termine-bar)' },
};
const phaseBar = (phase: string | null | undefined) => (PHASES[phase ?? 'SIGNE'] ?? PHASES.SIGNE).bar;
const dateCourt = (d: Date | string) => new Date(d).toLocaleDateString('fr-CA', { day: 'numeric', month: 'short' });
const eyebrow: React.CSSProperties = { fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)' };
const statVal: React.CSSProperties = { fontSize: 14, fontWeight: 600, marginTop: 3, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' };

function PhaseBadge({ phase }: { phase: string | null | undefined }) {
  const p = PHASES[phase ?? 'SIGNE'] ?? PHASES.SIGNE;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 'var(--text-2xs)', fontWeight: 600, lineHeight: 1, whiteSpace: 'nowrap', padding: '3px 8px', borderRadius: 'var(--radius-full)', background: p.tint, color: p.ink }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: p.bar, flex: '0 0 auto' }} />
      {p.label}
    </span>
  );
}

interface ProjetPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjetDetailPage({ params: paramPromise }: ProjetPageProps) {
  const params = use(paramPromise);
  const router = useRouter();
  const [projet, setProjet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [tableauVariant, setTableauVariant] = useState<'client' | 'soustraitant' | null>(null);
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

  // Calculs — avancement par DATES (étape terminée ⇔ dateFin passée), cohérent
  // avec la liste, la carte et la vue client. On réutilise calculateTaskStatus
  // (task-status.ts) : statut 'completed' = dateFin passée. Pas de 2e calcul.
  const statutTache = (t: any) => calculateTaskStatus(t.dateDebut, t.dateFin).status;
  const etapesCompletes = projet.taches.filter((t: any) => statutTache(t) === 'completed').length;
  const avancement = projet.taches.length > 0
    ? Math.round((etapesCompletes / projet.taches.length) * 100)
    : 0;

  const joursRestants = projet.dateLivraison
    ? Math.ceil(
        (new Date(projet.dateLivraison).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  // Prochaine étape (présentation) — par dates depuis la cédule (comme la vue client).
  const sortedTaches = [...projet.taches].sort((a: any, b: any) => (a.ordre ?? 0) - (b.ordre ?? 0));
  const prochaineEtape =
    sortedTaches.find((t: any) => statutTache(t) === 'inProgress') ||
    sortedTaches.find((t: any) => statutTache(t) === 'preparation') ||
    sortedTaches.find((t: any) => statutTache(t) === 'noneStarted');

  // Solde restant à percevoir (paiements non reçus) — pour l'alerte livraison imminente.
  const soldeRestant = projet.paiements
    .filter((p: any) => !p.recu)
    .reduce((sum: number, p: any) => sum + Number(p.montant), 0);

  return (
    <div className="p-8 space-y-8">
      {/* En-tête fiche projet (REF ProjectPage) — présentation uniquement */}
      <div>
        {/* Breadcrumb */}
        <button onClick={() => router.push('/projets')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: 12, padding: 0, marginBottom: 12, fontFamily: 'var(--font-sans)' }}>
          <i className="ti ti-chevron-left" aria-hidden="true" style={{ fontSize: 14 }} />Tous les projets
        </button>

        {/* Titre + actions */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>{projet.adresse}</h1>
              <PhaseBadge phase={projet.phase} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, fontSize: 13, color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
              <span>{projet.ville}</span>
              <span style={{ color: 'var(--text-disabled)' }}>·</span>
              <i className="ti ti-user" aria-hidden="true" style={{ fontSize: 14 }} />
              <span>{projet.client.prenom} {projet.client.nom}</span>
              <span style={{ color: 'var(--text-disabled)' }}>·</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 'var(--text-2xs)', fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>{projet.typeContrat === 'PRELIMINAIRE' ? 'Préliminaire' : 'Entreprise'}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button variant="outline" className="gap-2" onClick={() => setModifierOpen(true)}>
              <i className="ti ti-pencil" aria-hidden="true" />Modifier
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => window.open(`/p/${projet.slug}`, '_blank')}>
              <i className="ti ti-eye" aria-hidden="true" />Vue client
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => setPrintDialogOpen(true)}>
              <i className="ti ti-printer" aria-hidden="true" />Imprimer
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <i className="ti ti-table" aria-hidden="true" />Échéancier PDF
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTableauVariant('client')}>
                  <i className="ti ti-user" aria-hidden="true" style={{ marginRight: 6 }} />Client (sans fournisseur)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTableauVariant('soustraitant')}>
                  <i className="ti ti-tools" aria-hidden="true" style={{ marginRight: 6 }} />Sous-traitant (avec fournisseur)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Action principale (rouge) — désactivée tant que la fonctionnalité n'est pas livrée */}
            <Button className="gap-2" disabled title="Bientôt disponible">
              <i className="ti ti-send" aria-hidden="true" />Envoyer au client
            </Button>
            <Button variant="outline" className="gap-2 text-red-600 hover:bg-red-50" onClick={handleDelete} disabled={deleting}>
              <i className="ti ti-trash" aria-hidden="true" />{deleting ? 'Suppression...' : 'Supprimer'}
            </Button>
          </div>
        </div>

        {/* Vue d'ensemble — bande compacte 4 cellules (hairlines) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', margin: '18px 0 4px' }}>
          {/* Avancement global */}
          <div style={{ background: 'var(--surface)', padding: '14px 16px' }}>
            <div style={eyebrow}>Avancement global</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 5 }}>
              <span style={{ fontSize: 22, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--text-primary)' }}>{avancement}%</span>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{etapesCompletes}/{projet.taches.length} étapes</span>
            </div>
            <div style={{ marginTop: 8, height: 5, background: 'var(--n-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${avancement}%`, background: phaseBar(projet.phase), borderRadius: 'var(--radius-full)' }} />
            </div>
          </div>
          {/* Montant du contrat */}
          <div style={{ background: 'var(--surface)', padding: '14px 16px' }}>
            <div style={eyebrow}>Montant du contrat</div>
            <div style={statVal}>{formatMontant(Number(projet.montantTotal), 0)}</div>
          </div>
          {/* Livraison */}
          <div style={{ background: 'var(--surface)', padding: '14px 16px' }}>
            <div style={eyebrow}>Livraison</div>
            <div style={{ ...statVal, color: joursRestants !== null && joursRestants <= 14 ? 'var(--danger)' : 'var(--text-primary)' }}>{formatDate(projet.dateLivraison)}</div>
            {joursRestants !== null && (
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>{joursRestants < 0 ? `${Math.abs(joursRestants)} jours de retard` : `${joursRestants} jours restants`}</div>
            )}
          </div>
          {/* Prochaine étape */}
          <div style={{ background: 'var(--surface)', padding: '14px 16px' }}>
            <div style={eyebrow}>Prochaine étape</div>
            <div style={{ ...statVal, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prochaineEtape ? prochaineEtape.nom : '—'}</div>
            {prochaineEtape && (
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>{prochaineEtape.assigneA || 'Interne'} · {dateCourt(prochaineEtape.dateDebut)}</div>
            )}
          </div>
        </div>

        {/* Alerte projet contextuelle */}
        {joursRestants !== null && joursRestants <= 14 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--danger-tint)', border: '1px solid var(--accent-border)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginTop: 12, fontSize: 12.5, color: 'var(--danger-text)' }}>
            <i className="ti ti-alert-triangle" aria-hidden="true" style={{ fontSize: 16, flexShrink: 0 }} />
            <span><span style={{ fontWeight: 600 }}>Livraison imminente</span> — {joursRestants < 0 ? `livraison dépassée de ${Math.abs(joursRestants)} jours` : `remise des clés dans ${joursRestants} jours`}.{soldeRestant > 0 ? ` Solde de ${formatMontant(soldeRestant, 0)} à percevoir.` : ''}</span>
          </div>
        ) : prochaineEtape ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--info-tint)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginTop: 12, fontSize: 12.5, color: 'var(--info-text)' }}>
            <i className="ti ti-info-circle" aria-hidden="true" style={{ fontSize: 16, flexShrink: 0 }} />
            <span><span style={{ fontWeight: 600 }}>{prochaineEtape.nom}</span> en cours — {prochaineEtape.assigneA || 'Interne'} · à coordonner d'ici le {dateCourt(prochaineEtape.dateDebut)}.</span>
          </div>
        ) : null}
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
                dateLivraison={projet.dateLivraison}
                margeCeduleJours={margeCeduleJours}
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
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-tertiary)' }}>Chargement du costing…</div>
            ) : costing ? (
              <CostingTab calculs={costing} />
            ) : (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-tertiary)' }}>Données costing non disponibles</div>
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

      {/* #10 — Nouvel échéancier en tableau (Client / Sous-traitant), moteur séparé du Gantt */}
      <EcheancierTableauDialog
        open={tableauVariant !== null}
        onOpenChange={(o) => { if (!o) setTableauVariant(null); }}
        projet={projet}
        parametres={parametresEntreprise}
        variant={tableauVariant ?? 'client'}
      />
    </div>
  );
}
