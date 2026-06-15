'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatMontant } from '@/lib/utils';
import { calculateTaskStatus } from '@/lib/task-status';
import { Phone, Mail } from 'lucide-react';

export default function VueClientPage({ params: paramPromise }: { params: Promise<{ token: string }> }) {
  const params = use(paramPromise);
  const [projet, setProjet] = useState<any>(null);
  const [parametres, setParametres] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjet = async () => {
      try {
        const res = await fetch(`/api/projets-by-slug?slug=${params.token}`);
        if (!res.ok) throw new Error('Projet non trouvé');
        const data = await res.json();
        if (!data.projet) throw new Error('Projet non trouvé');
        setProjet(data.projet);
        setParametres(data.parametres || null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjet();
  }, [params.token]);

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-600">Chargement...</div>;
  if (error || !projet) return <div className="flex items-center justify-center min-h-screen text-red-600">Erreur: {error}</div>;

  const tachesClient = projet.taches.filter((t: any) => t.visibleClient);
  const extrasSignes = projet.extras.filter((e: any) => e.statut === 'SIGNE');
  const totalExtrasSignes = extrasSignes.reduce((sum: number, e: any) => sum + e.montant, 0);
  const totalRecu = projet.paiements.filter((p: any) => p.recu).reduce((sum: number, p: any) => sum + p.montant, 0);
  const totalPlanifie = projet.paiements.reduce((sum: number, p: any) => sum + p.montant, 0);
  const progressionPercent = tachesClient.length > 0
    ? Math.round((tachesClient.filter((t: any) => {
        const status = calculateTaskStatus(t.dateDebut, t.dateFin);
        return status.status === 'completed';
      }).length / tachesClient.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Entête mobile-first */}
      <header className="border-b border-gray-200 py-4 px-4 sm:py-6 sm:px-6">
        <div className="max-w-md mx-auto space-y-4">
          <Link href="/">
            <Image src="/habitationsdg.svg" alt="Habitations DG" width={80} height={40} className="object-contain" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{projet.adresse}</h1>
            <p className="text-sm text-gray-600">{projet.ville}</p>
          </div>
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Client:</strong> {projet.client.prenom} {projet.client.nom}</p>
            <p><strong>Livraison prévue:</strong> {formatDate(projet.dateLivraison)}</p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 sm:px-6 space-y-6">
        {/* Barre de progression */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Avancement global</h2>
            <span className="text-lg font-bold text-blue-600">{progressionPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${progressionPercent}%` }}
            />
          </div>
        </div>

        {/* Note explicative */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-xs italic text-gray-600">
            Les dates indiquées sont prévisionnelles et peuvent être ajustées selon l'avancement du chantier. Elles vous sont communiquées à titre indicatif pour vous permettre de suivre l'évolution de votre projet.
          </p>
        </div>

        {/* Tableau des étapes */}
        {tachesClient.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-gray-900">Cédule des travaux</h2>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Étape</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Début</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Fin</th>
                  </tr>
                </thead>
                <tbody>
                  {tachesClient.map((t: any, idx: number) => (
                    <tr key={t.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-gray-900">{t.nom}</td>
                      <td className="px-3 py-2 text-gray-600 text-xs">{formatDate(t.dateDebut)}</td>
                      <td className="px-3 py-2 text-gray-600 text-xs">{formatDate(t.dateFin)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Extras signés */}
        {extrasSignes.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-gray-900">Travaux additionnels signés</h2>
            <div className="space-y-2">
              {extrasSignes.map((e: any) => (
                <div key={e.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-gray-900 text-sm">{e.description}</p>
                    <p className="font-semibold text-green-700">{formatMontant(e.montant)}</p>
                  </div>
                </div>
              ))}
              <div className="bg-green-100 border border-green-300 rounded-lg p-3 flex justify-between items-center">
                <p className="font-semibold text-green-900">Total extras</p>
                <p className="font-bold text-green-900">{formatMontant(totalExtrasSignes)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Paiements */}
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-900">Statut des paiements</h2>
          <div className="space-y-2">
            {projet.paiements.map((p: any) => (
              <div key={p.id} className={`border rounded-lg p-3 ${p.recu ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                <div className="flex justify-between items-start mb-1">
                  <p className="font-medium text-gray-900 text-sm">{p.description}</p>
                  <Badge className={p.recu ? 'bg-green-100 text-green-800 text-xs' : 'bg-yellow-100 text-yellow-800 text-xs'}>
                    {p.recu ? 'Reçu' : 'Attente'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-600">{p.pourcentage}%</p>
                  <p className="font-semibold text-gray-900">{formatMontant(p.montant)}</p>
                </div>
              </div>
            ))}
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-blue-900">Total reçu</p>
                <p className="font-bold text-blue-900">{formatMontant(totalRecu)} / {formatMontant(totalPlanifie)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          <h2 className="font-semibold text-gray-900">Nous contacter</h2>
          <div className="space-y-2 text-sm">
            {projet.client.telephone && (
              <a href={`tel:${projet.client.telephone}`} className="flex items-center gap-2 text-blue-600 hover:underline">
                <Phone className="w-4 h-4" />
                {projet.client.telephone}
              </a>
            )}
            {projet.client.email && (
              <a href={`mailto:${projet.client.email}`} className="flex items-center gap-2 text-blue-600 hover:underline">
                <Mail className="w-4 h-4" />
                {projet.client.email}
              </a>
            )}
          </div>
        </div>
      </main>

      {/* Pied de page */}
      <footer className="border-t border-gray-200 mt-8 py-6 text-center text-xs text-gray-500">
        <div className="max-w-md mx-auto px-4 space-y-2">
          <p className="font-semibold">{parametres?.nomCompagnie ?? 'Habitations DG'}</p>
          <p>RBQ: {parametres?.rbq ?? '5856-1036-01'}</p>
          <a href={`https://${parametres?.siteWeb ?? 'habitations-dg.com'}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {parametres?.siteWeb ?? 'habitations-dg.com'}
          </a>
        </div>
      </footer>
    </div>
  );
}
