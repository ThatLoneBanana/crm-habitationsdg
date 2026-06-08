'use client';

import { useEffect, useState } from 'react';
import { ProjetsTable } from '@/components/projets/projets-table';
import { ProjetsFilters } from '@/components/projets/projets-filters';
import { ProjetWithRelations } from '@/types';

export default function ProjetListPage() {
  const [projets, setProjets] = useState<ProjetWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState('TOUS');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch projets from API
        const queryParams = new URLSearchParams();
        if (phase !== 'TOUS') queryParams.append('phase', phase);
        if (search) queryParams.append('search', search);

        const res = await fetch(`/api/projets?${queryParams.toString()}`);
        if (!res.ok) throw new Error('Erreur lors du chargement');

        const data = await res.json();
        setProjets(data.projets || []);
      } catch (err: any) {
        console.error('Erreur:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [phase, search]);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Projets</h1>
        <p className="text-gray-600 mt-2">Gestion de tous les projets</p>
      </div>

      {/* Filtres */}
      <ProjetsFilters
        onSearch={setSearch}
        onPhaseChange={setPhase}
        defaultPhase={phase}
        defaultSearch={search}
      />

      {/* Tableau ou message */}
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center text-red-700">
          <p>❌ {error}</p>
        </div>
      ) : loading ? (
        <div className="bg-white rounded-lg p-8 text-center text-gray-500">
          Chargement...
        </div>
      ) : projets.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center text-gray-500">
          <p className="mb-4">Aucun projet trouvé</p>
          <a href="/projets/nouveau" className="text-blue-600 hover:underline">
            Créer le premier projet
          </a>
        </div>
      ) : (
        <ProjetsTable projets={projets} />
      )}
    </div>
  );
}
