'use client';

import { useEffect, useState } from 'react';
import { getProjetsData, getMetrics } from './actions';
import { MetricCard } from '@/components/shared/metric-card';
import { ProjetsTable } from '@/components/projets/projets-table';
import { ProjetsFilters } from '@/components/projets/projets-filters';
import { ProjetWithRelations } from '@/types';
import {
  FolderOpen,
  TrendingUp,
  AlertCircle,
  FileText,
  Calendar,
} from 'lucide-react';

interface Metrics {
  projetActifs: number;
  livraisonsMonth: number;
  alertes: number;
  extrasNonSignes: number;
  gcrAPlanifier: number;
}

export default function DashboardPage() {
  const [projets, setProjets] = useState<ProjetWithRelations[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    projetActifs: 0,
    livraisonsMonth: 0,
    alertes: 0,
    extrasNonSignes: 0,
    gcrAPlanifier: 0,
  });
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState('TOUS');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [projetData, metricsData] = await Promise.all([
          getProjetsData(phase !== 'TOUS' ? phase : undefined, search || undefined),
          getMetrics(),
        ]);
        setProjets(projetData);
        setMetrics(metricsData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
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
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-2">Gestion des projets et des alertes</p>
      </div>

      {/* Métriques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Projets actifs"
          value={metrics.projetActifs}
          icon={FolderOpen}
        />
        <MetricCard
          title="Livraisons ce mois"
          value={metrics.livraisonsMonth}
          icon={Calendar}
        />
        <MetricCard
          title="Alertes actives"
          value={metrics.alertes}
          icon={AlertCircle}
          variant="danger"
        />
        <MetricCard
          title="Extras non signés"
          value={metrics.extrasNonSignes}
          icon={FileText}
          variant="warning"
        />
        <MetricCard
          title="GCR à planifier"
          value={metrics.gcrAPlanifier}
          icon={TrendingUp}
          variant="warning"
        />
      </div>

      {/* Recherche et filtres */}
      <ProjetsFilters
        onSearch={setSearch}
        onPhaseChange={setPhase}
        defaultPhase={phase}
        defaultSearch={search}
      />

      {/* Tableau */}
      {loading ? (
        <div className="bg-white rounded-lg p-8 text-center text-gray-500">
          Chargement des données...
        </div>
      ) : (
        <ProjetsTable projets={projets} />
      )}
    </div>
  );
}
