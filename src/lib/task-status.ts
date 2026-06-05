// Calcul automatique du statut d'une tâche basé sur les dates
export function calculateTaskStatus(dateDebut: Date | string | null, dateFin: Date | string | null) {
  if (!dateDebut || !dateFin) {
    return { status: 'noneStarted', label: '', color: '', badge: false };
  }

  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Date début demain
  const demain = new Date(today);
  demain.setDate(demain.getDate() + 1);
  if (debut.toDateString() === demain.toDateString()) {
    return { status: 'preparation', label: 'En préparation', color: 'bg-blue-100 text-blue-800', badge: true };
  }

  // En cours: aujourd'hui ou début passée ET fin future
  if (debut <= today && fin >= today) {
    return { status: 'inProgress', label: 'En cours', color: 'bg-teal-100 text-teal-800', badge: true };
  }

  // Terminé: fin passée
  if (fin < today) {
    return { status: 'completed', label: 'Terminé', color: 'bg-green-100 text-green-800', badge: true };
  }

  // Aucun badge: aucune autre condition
  return { status: 'noneStarted', label: '', color: '', badge: false };
}

export type TaskStatus = ReturnType<typeof calculateTaskStatus>;
