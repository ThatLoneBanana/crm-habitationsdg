'use client';

import dynamic from 'next/dynamic';
import { Tache } from '@prisma/client';

const GanttComponent = dynamic(() => import('./gantt-component'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg text-gray-500">
      Chargement du diagramme...
    </div>
  ),
});

interface GanttChartProps {
  taches: Tache[];
  projectId: string;
  toleranceJours: number;
}

export function GanttChart({ taches, projectId, toleranceJours }: GanttChartProps) {
  // Formater les tâches pour le GanttComponent (colonne de labels + barres REF)
  const tasksData = taches
    .filter(t => t.dateDebut && t.dateFin)
    .map((tache) => ({
      id: tache.id,
      ordre: tache.ordre,
      nom: tache.nom,
      assigneA: tache.assigneA || 'Interne',
      jours: tache.dureeJours,
      start: new Date(tache.dateDebut!).toISOString().split('T')[0],
      end: new Date(tache.dateFin!).toISOString().split('T')[0],
    }));

  return <GanttComponent tasks={tasksData} />;
}
