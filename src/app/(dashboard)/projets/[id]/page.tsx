'use client';

import { useState, useEffect, use } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MetricCard } from '@/components/shared/metric-card';
import { CeduleTab } from '@/components/cedule/cedule-tab';
import { ExtrasTab } from '@/components/projets/extras-tab';
import { PaiementsTab } from '@/components/projets/paiements-tab';
import { DocumentsTab } from '@/components/projets/documents-tab';
import { CedulePDFDialog } from '@/components/projets/cedule-pdf-dialog';
import { formatDate, formatCurrency } from '@/lib/utils';
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
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProjet = async () => {
      try {
        // Le paramètre 'id' peut être un slug OU un UUID (ancien)
        // D'abord essayer par slug
        let res = await fetch(`/api/projets-by-slug?slug=${params.id}`);

        // Si pas trouvé, essayer par ID (fallback pour anciennes URLs)
        if (!res.ok) {
          res = await fetch(`/api/projets/${params.id}`);
        }

        if (!res.ok) throw new Error('Projet non trouvé');
        const data = await res.json();
        setProjet(data.projet);
      } catch (err) {
        console.error('Erreur:', err);
        setProjet(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProjet();
  }, [params.id]);

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
    VENTE: 'bg-blue-100 text-blue-800',
    ADMIN: 'bg-purple-100 text-purple-800',
    PREPARATION: 'bg-yellow-100 text-yellow-800',
    CHANTIER: 'bg-orange-100 text-orange-800',
    LIVRAISON: 'bg-green-100 text-green-800',
    CLOTURE: 'bg-gray-100 text-gray-800',
  };

  const phaseLabels: Record<string, string> = {
    VENTE: 'Vente',
    ADMIN: 'Admin',
    PREPARATION: 'Préparation',
    CHANTIER: 'Chantier',
    LIVRAISON: 'Livraison',
    CLOTURE: 'Clôturé',
  };

  const isUrgent = joursRestants !== null && joursRestants < 30;
  const isOverdue = joursRestants !== null && joursRestants < 0;

  return (
    <div className="p-8 space-y-8">
      {/* Boutons d'action */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" className="gap-2" onClick={() => window.open(`/vueclient/${projet.slug}`, '_blank')}>
          <Eye className="w-4 h-4" />
          Vue client
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => setPrintDialogOpen(true)}>
          <Printer className="w-4 h-4" />
          Imprimer
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => alert('Envoi au client en implémentation')}>
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
            <Badge className={phaseColors[projet.phase]}>
              {phaseLabels[projet.phase]}
            </Badge>
            {isOverdue && <Badge className="bg-red-100 text-red-800">EN RETARD</Badge>}
            {isUrgent && !isOverdue && <Badge className="bg-orange-100 text-orange-800">URGENT</Badge>}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <p className="text-xs text-gray-500">Client</p>
            <p className="font-semibold text-gray-900">
              {projet.client.prenom} {projet.client.nom}
            </p>
            <p className="text-xs text-gray-500">{projet.client.email}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <p className="text-xs text-gray-500">Vendeur</p>
            <p className="font-semibold text-gray-900">
              {projet.vendeur ? `${projet.vendeur.prenom} ${projet.vendeur.nom}` : 'Non assigné'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <p className="text-xs text-gray-500">Chargé de projet</p>
            <p className="font-semibold text-gray-900">
              {projet.chargeProjet ? `${projet.chargeProjet.prenom} ${projet.chargeProjet.nom}` : 'Non assigné'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <p className="text-xs text-gray-500">Livraison</p>
            <p className="font-semibold text-gray-900">
              {formatDate(projet.dateLivraison)}
            </p>
            {joursRestants !== null && (
              <p className={`text-xs font-semibold ${joursRestants < 0 ? 'text-red-600' : joursRestants < 14 ? 'text-orange-600' : 'text-green-600'}`}>
                {joursRestants < 0 ? `${Math.abs(joursRestants)} j. en retard` : `${joursRestants} j. restants`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Métriques */}
      <div className="grid grid-cols-5 gap-4">
        <MetricCard title="Avancement" value={`${avancement}%`} />
        <MetricCard title="Étapes" value={projet.taches.length} />
        <MetricCard title="Extras" value={projet.extras.length} />
        <MetricCard title="Extras signés" value={`$${formatCurrency(totalExtrasSignes)}`} />
        <MetricCard title="Paiements" value={projet.paiements.length} />
      </div>

      {/* Onglets */}
      <Tabs defaultValue="cedule" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
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
        </TabsList>

        <div className="p-6">
          <TabsContent value="cedule" className="m-0">
            <CeduleTab
              taches={projet.taches}
              projectId={projet.id}
              toleranceJours={projet.toleranceJours}
            />
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
        </div>
      </Tabs>

      {/* Dialog impression PDF */}
      <CedulePDFDialog
        open={printDialogOpen}
        onOpenChange={setPrintDialogOpen}
        projet={projet}
      />
    </div>
  );
}
