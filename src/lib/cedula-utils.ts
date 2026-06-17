// Utilitaires partagés pour l'éditeur de cédule — SOURCE UNIQUE.
// (Les anciennes copies de template-utils.ts ré-exportent désormais d'ici.)
//
// Jours ouvrables « conscients des vacances » : chaque helper prend un prédicat
// EstOuvrable en dernier paramètre, par DÉFAUT = ni samedi ni dimanche. Donc
// SANS prédicat (ou sans période), le comportement est IDENTIQUE à avant.
// Pour tenir compte des périodes non ouvrables, construire le prédicat une fois
// via construireEstOuvrable(periodes) et le threader dans la cascade.

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

export interface Periode {
  dateDebut: Date | string;
  dateFin: Date | string;
}

export type EstOuvrable = (date: Date) => boolean;

// Prédicat par défaut : jour ouvrable = ni samedi (6) ni dimanche (0).
export const estOuvrableWeekend: EstOuvrable = (d) => {
  const w = d.getDay();
  return w !== 0 && w !== 6;
};

function cleJour(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

// Construit un prédicat « jour ouvrable » qui exclut samedi/dimanche ET toute
// date couverte par une période non ouvrable. Le lookup (Set de clés de jour)
// est construit UNE fois ici, puis réutilisé à chaque appel du prédicat.
export function construireEstOuvrable(periodes: Periode[] | null | undefined): EstOuvrable {
  if (!periodes || periodes.length === 0) return estOuvrableWeekend;
  const bloques = new Set<string>();
  for (const p of periodes) {
    const d = new Date(p.dateDebut); d.setHours(0, 0, 0, 0);
    const fin = new Date(p.dateFin); fin.setHours(0, 0, 0, 0);
    let cur = new Date(d);
    while (cur <= fin) {
      bloques.add(cleJour(cur));
      cur = new Date(cur.getTime() + 86400000);
    }
  }
  return (date) => {
    const w = date.getDay();
    if (w === 0 || w === 6) return false;
    return !bloques.has(cleJour(date));
  };
}

export function addJoursOuvrables(date: Date, n: number, estOuvrable: EstOuvrable = estOuvrableWeekend): Date {
  let d = new Date(date);
  let count = 0;
  while (count < n) {
    d = new Date(d.getTime() + 86400000);
    if (estOuvrable(d)) count++;
  }
  return d;
}

export function subJoursOuvrables(date: Date, n: number, estOuvrable: EstOuvrable = estOuvrableWeekend): Date {
  let d = new Date(date);
  let count = 0;
  while (count < n) {
    d = new Date(d.getTime() - 86400000);
    if (estOuvrable(d)) count++;
  }
  return d;
}

export function joursOuvrableEntre(debut: Date, fin: Date, estOuvrable: EstOuvrable = estOuvrableWeekend): number {
  let count = 0;
  let current = new Date(debut);
  current.setHours(0, 0, 0, 0);
  const finDate = new Date(fin);
  finDate.setHours(0, 0, 0, 0);

  while (current <= finDate) {
    if (estOuvrable(current)) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}

// Alias historique (template-utils l'exposait sous ce nom).
export const countJoursOuvrables = joursOuvrableEntre;

export function cascadeVersBas(etapes: EtapeEditable[], fromIndex: number, estOuvrable: EstOuvrable = estOuvrableWeekend): EtapeEditable[] {
  const newEtapes = JSON.parse(JSON.stringify(etapes));
  for (let i = fromIndex + 1; i < newEtapes.length; i++) {
    const prev = newEtapes[i - 1];
    const bufferPrev = prev.buffer || 0;
    newEtapes[i].dateDebut = addJoursOuvrables(new Date(prev.dateFin), 1 + bufferPrev, estOuvrable);
    newEtapes[i].dateFin = newEtapes[i].jours <= 1
      ? new Date(newEtapes[i].dateDebut)
      : addJoursOuvrables(new Date(newEtapes[i].dateDebut), newEtapes[i].jours - 1, estOuvrable);
  }
  return newEtapes;
}

export function cascadeVersHaut(etapes: EtapeEditable[], fromIndex: number, estOuvrable: EstOuvrable = estOuvrableWeekend): EtapeEditable[] {
  const newEtapes = JSON.parse(JSON.stringify(etapes));
  for (let i = fromIndex - 1; i >= 0; i--) {
    const next = newEtapes[i + 1];
    const bufferCurrent = newEtapes[i].buffer || 0;
    newEtapes[i].dateFin = subJoursOuvrables(new Date(next.dateDebut), 1 + bufferCurrent, estOuvrable);
    newEtapes[i].dateDebut = newEtapes[i].jours <= 1
      ? new Date(newEtapes[i].dateFin)
      : subJoursOuvrables(new Date(newEtapes[i].dateFin), newEtapes[i].jours - 1, estOuvrable);
  }
  return newEtapes;
}

export function detecterConflits(etapes: { dateFin: Date | string; dateDebut: Date | string }[]): number[] {
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
  margeJours: number = 5,
  estOuvrable: EstOuvrable = estOuvrableWeekend
): EtapeEditable[] {
  const newEtapes = JSON.parse(JSON.stringify(etapes));
  const livraison = new Date(dateLivraison);
  let cursor = subJoursOuvrables(livraison, margeJours, estOuvrable);

  for (let i = newEtapes.length - 1; i >= 0; i--) {
    const e = newEtapes[i];
    const dateFin = new Date(cursor);
    const dateDebut = e.jours <= 1
      ? new Date(cursor)
      : subJoursOuvrables(cursor, e.jours - 1, estOuvrable);
    const bufferActuel = e.buffer || 0;
    cursor = subJoursOuvrables(dateDebut, 1 + bufferActuel, estOuvrable);

    newEtapes[i] = { ...e, dateDebut, dateFin };
  }

  return newEtapes;
}

// Fabrique un « moteur » de cédule où tous les helpers/cascade sont déjà LIÉS au
// prédicat construit depuis les périodes. Permet à chaque surface (création,
// CedulaEditor, cedule-tab) de déstructurer ces versions liées — qui masquent
// les imports — pour rendre tous les appels existants conscients des vacances
// sans réécrire chaque site. SANS périodes → prédicat weekend → comportement
// identique.
export function creerMoteurCedule(periodes?: Periode[] | null) {
  const estOuvrable = construireEstOuvrable(periodes);
  return {
    estOuvrable,
    addJoursOuvrables: (date: Date, n: number) => addJoursOuvrables(date, n, estOuvrable),
    subJoursOuvrables: (date: Date, n: number) => subJoursOuvrables(date, n, estOuvrable),
    joursOuvrableEntre: (debut: Date, fin: Date) => joursOuvrableEntre(debut, fin, estOuvrable),
    countJoursOuvrables: (debut: Date, fin: Date) => joursOuvrableEntre(debut, fin, estOuvrable),
    cascadeVersBas: (etapes: EtapeEditable[], fromIndex: number) => cascadeVersBas(etapes, fromIndex, estOuvrable),
    cascadeVersHaut: (etapes: EtapeEditable[], fromIndex: number) => cascadeVersHaut(etapes, fromIndex, estOuvrable),
    calculerDepuisLivraison: (etapes: EtapeEditable[], dateLivraison: Date, margeJours?: number) =>
      calculerDepuisLivraison(etapes, dateLivraison, margeJours ?? 5, estOuvrable),
  };
}
