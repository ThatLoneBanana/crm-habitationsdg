// Utilitaires partagés pour l'éditeur de cédule

export interface EtapeEditable {
  id?: string;
  nom: string;
  ordre: number;
  jours: number;
  dateDebut: Date;
  dateFin: Date;
  buffer: number;
  assigneA: string;
  visibleClient: boolean;
  interne: boolean;
  statut?: 'termine' | 'encours' | 'avenir';
  verrouille?: boolean;
}

export function addJoursOuvrables(date: Date, n: number): Date {
  let d = new Date(date);
  let count = 0;
  while (count < n) {
    d = new Date(d.getTime() + 86400000);
    const dayOfWeek = d.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
  }
  return d;
}

export function subJoursOuvrables(date: Date, n: number): Date {
  let d = new Date(date);
  let count = 0;
  while (count < n) {
    d = new Date(d.getTime() - 86400000);
    const dayOfWeek = d.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
  }
  return d;
}

export function joursOuvrableEntre(debut: Date, fin: Date): number {
  let count = 0;
  let current = new Date(debut);
  current.setHours(0, 0, 0, 0);
  const finDate = new Date(fin);
  finDate.setHours(0, 0, 0, 0);

  while (current <= finDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}

export function cascadeVersBas(etapes: EtapeEditable[], fromIndex: number): EtapeEditable[] {
  const newEtapes = JSON.parse(JSON.stringify(etapes));
  for (let i = fromIndex + 1; i < newEtapes.length; i++) {
    const prev = newEtapes[i - 1];
    const bufferPrev = prev.buffer || 0;
    newEtapes[i].dateDebut = addJoursOuvrables(prev.dateFin, 1 + bufferPrev);
    newEtapes[i].dateFin = newEtapes[i].jours <= 1
      ? new Date(newEtapes[i].dateDebut)
      : addJoursOuvrables(newEtapes[i].dateDebut, newEtapes[i].jours - 1);
  }
  return newEtapes;
}

export function cascadeVersHaut(etapes: EtapeEditable[], fromIndex: number): EtapeEditable[] {
  const newEtapes = JSON.parse(JSON.stringify(etapes));
  for (let i = fromIndex - 1; i >= 0; i--) {
    const next = newEtapes[i + 1];
    const bufferCurrent = newEtapes[i].buffer || 0;
    newEtapes[i].dateFin = subJoursOuvrables(next.dateDebut, 1 + bufferCurrent);
    newEtapes[i].dateDebut = newEtapes[i].jours <= 1
      ? new Date(newEtapes[i].dateFin)
      : subJoursOuvrables(newEtapes[i].dateFin, newEtapes[i].jours - 1);
  }
  return newEtapes;
}

export function detecterConflits(etapes: EtapeEditable[]): number[] {
  const conflits: number[] = [];
  for (let i = 0; i < etapes.length - 1; i++) {
    const d1 = new Date(etapes[i].dateFin);
    const d2 = new Date(etapes[i + 1].dateDebut);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    if (d1 >= d2) {
      conflits.push(i);
      conflits.push(i + 1);
    }
  }
  return [...new Set(conflits)];
}

export function calculerDepuisLivraison(
  etapes: EtapeEditable[],
  dateLivraison: Date,
  margeJours: number = 5
): EtapeEditable[] {
  const newEtapes = JSON.parse(JSON.stringify(etapes));
  const livraison = new Date(dateLivraison);
  let cursor = subJoursOuvrables(livraison, margeJours);

  for (let i = newEtapes.length - 1; i >= 0; i--) {
    const e = newEtapes[i];
    const dateFin = new Date(cursor);
    const dateDebut = e.jours <= 1
      ? new Date(cursor)
      : subJoursOuvrables(cursor, e.jours - 1);
    const bufferActuel = e.buffer || 0;
    cursor = subJoursOuvrables(dateDebut, 1 + bufferActuel);

    newEtapes[i] = { ...e, dateDebut, dateFin };
  }

  return newEtapes;
}
