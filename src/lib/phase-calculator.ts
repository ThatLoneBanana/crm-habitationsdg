interface Tache {
  nom: string
  dateDebut: Date | string
  dateFin: Date | string
}

interface Projet {
  phase?: string
  taches: Tache[]
}

function toLocalDate(d: Date | string): Date {
  const date = new Date(d)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function calculerPhaseAutomatique(projet: Projet): string {
  if (!projet.taches || projet.taches.length === 0) return 'SIGNE'

  const now = toLocalDate(new Date())

  // Date de début de la première tâche (début du chantier)
  const premiereTache = projet.taches[0]
  const dateDebutChantier = toLocalDate(premiereTache.dateDebut)

  // 2 semaines avant le début du chantier
  const datePreparation = new Date(dateDebutChantier)
  datePreparation.setDate(datePreparation.getDate() - 14)
  datePreparation.setHours(0, 0, 0, 0)

  // Si on est >= 2 semaines avant et < date de début
  if (now >= datePreparation && now < dateDebutChantier) {
    return 'PREPARATION'
  }

  // Si la première tâche a commencé ou est en cours
  if (now >= dateDebutChantier) {
    // Chercher la tâche "Ménage" (dernière étape)
    const tacheMenuge = projet.taches.find(t =>
      t.nom.toLowerCase().includes('ménage')
    )

    if (tacheMenuge) {
      const dateDebutMenuge = toLocalDate(tacheMenuge.dateDebut)
      const dateFinMenuge = toLocalDate(tacheMenuge.dateFin)

      // Si on est arrivé au ménage
      if (now >= dateDebutMenuge) {
        // Vérifier si le ménage et toutes les tâches sont terminées
        const menugeTermine = dateFinMenuge < now
        if (menugeTermine) {
          // Vérifier si TOUTES les tâches sont terminées
          const allTermine = projet.taches.every(t => {
            const fin = toLocalDate(t.dateFin)
            fin.setHours(23, 59, 59, 999)
            return fin < now
          })

          if (allTermine) return 'TERMINE'
        }
        return 'LIVRAISON'
      }
    }

    return 'CHANTIER'
  }

  return 'SIGNE'
}
