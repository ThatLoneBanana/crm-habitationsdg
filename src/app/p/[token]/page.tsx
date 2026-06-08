'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatCurrency } from '@/lib/utils';
import { GanttChart } from '@/components/cedule/gantt-chart';

export default function VueClientPage({ params: paramPromise }: { params: Promise<{ token: string }> }) {
  const params = use(paramPromise);
  const [projet, setProjet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjet = async () => {
      try {
        // Chercher d'abord par slug (urlClient)
        const res = await fetch(`/api/projets?urlClient=${params.token}`);
        if (!res.ok || res.status === 404) throw new Error('Projet non trouvé');
        const data = await res.json();
        const foundProjet = Array.isArray(data.projets) ? data.projets[0] : data.projet;
        if (!foundProjet) throw new Error('Projet non trouvé');
        setProjet(foundProjet);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjet();
  }, [params.token]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  if (error || !projet) return <div className="flex items-center justify-center min-h-screen text-red-600">Erreur: {error}</div>;

  const tachesClient = projet.taches.filter((t: any) => t.visibleClient);
  const extrasSignes = projet.extras.filter((e: any) => e.statut === 'SIGNE');
  const totalExtrasSignes = extrasSignes.reduce((sum: number, e: any) => sum + e.montant, 0);
  const totalPlanifie = projet.paiements.reduce((sum: number, p: any) => sum + p.montant, 0);
  const totalRecu = projet.paiements.filter((p: any) => p.recu).reduce((sum: number, p: any) => sum + p.montant, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
          <Link href="/"><Image src="/habitationsdg.svg" alt="Habitations DG" width={120} height={60} className="object-contain" /></Link>
          <div className="text-right"><p className="text-xs text-gray-500">RBQ: 5856-1036-01</p></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <div className="space-y-6">
          <div><h1 className="text-4xl font-bold text-gray-900">{projet.adresse}</h1><p className="text-gray-600 mt-2">{projet.ville}</p></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border"><p className="text-xs text-gray-500">Client</p><p className="font-semibold mt-1">{projet.client.prenom} {projet.client.nom}</p></div>
            <div className="bg-white p-4 rounded-lg border"><p className="text-xs text-gray-500">Livraison</p><p className="font-semibold mt-1">{formatDate(projet.dateLivraison)}</p></div>
            <div className="bg-white p-4 rounded-lg border"><p className="text-xs text-gray-500">Contrat</p><p className="font-semibold mt-1">{projet.typeContrat === 'PRELIMINAIRE' ? 'Préliminaire' : 'Entreprise'}</p></div>
            <div className="bg-white p-4 rounded-lg border"><p className="text-xs text-gray-500">Progression</p><p className="font-semibold mt-1">{Math.round((tachesClient.filter((t: any) => t.statut === 'COMPLETE').length / tachesClient.length) * 100)}%</p></div>
          </div>
        </div>

        {tachesClient.length > 0 && (
          <div className="space-y-4"><h2 className="text-2xl font-bold">Cédule des travaux</h2>
            <GanttChart taches={tachesClient.map((t: any) => ({id: t.id, nom: t.nom, start: t.dateDebut, end: t.dateFin, statut: t.statut, progress: t.statut === 'COMPLETE' ? 100 : 0, assigné: t.assigneA}))} projectId={projet.id} toleranceJours={projet.toleranceJours} />
          </div>
        )}

        {extrasSignes.length > 0 && (
          <div className="space-y-4"><h2 className="text-2xl font-bold">Travaux additionnels</h2>
            {extrasSignes.map((e: any) => <div key={e.id} className="bg-white p-4 rounded-lg border border-green-200"><div className="flex justify-between"><div><p className="font-medium">{e.description}</p></div><p className="font-bold">{formatCurrency(e.montant)}</p></div></div>)}
          </div>
        )}

        <div className="space-y-4"><h2 className="text-2xl font-bold">Paiements</h2>
          {projet.paiements.map((p: any) => <div key={p.id} className={`p-4 rounded-lg border ${p.recu ? 'bg-green-50' : 'bg-white'}`}><div className="flex justify-between"><div><p className="font-medium">{p.description}</p><p className="text-sm text-gray-600 mt-1">{p.pourcentage}%</p></div><div className="text-right"><p className="font-bold">{formatCurrency(p.montant)}</p><Badge className={p.recu ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>{p.recu ? 'Reçu' : 'Attente'}</Badge></div></div></div>)}
        </div>

        <footer className="border-t pt-8 text-center text-sm text-gray-500"><p>Habitations DG — RBQ: 5856-1036-01</p></footer>
      </main>
    </div>
  );
}
