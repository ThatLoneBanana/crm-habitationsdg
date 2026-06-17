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
  // Lien « même jour » : les étapes partageant le même groupeId forment un BLOC
  // qui débute le même jour (cf. construireBlocs / cascade par blocs ci-dessous).
  groupeId?: string | null;
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

// ─── Blocs « même jour » (lien parent/enfant) ──────────────────────────────
// Un BLOC = suite CONTIGUË (par ordre du tableau) de tâches partageant le même
// groupeId. Une tâche sans groupeId = un bloc de 1. Toute la cascade et le
// back-calc itèrent sur les BLOCS : l'espacement +1 jour ouvrable (+ buffer,
// conscient des vacances) s'applique ENTRE blocs, JAMAIS entre frères d'un même
// bloc. SANS aucun groupe, chaque bloc est de taille 1 → comportement IDENTIQUE
// à avant (régression préservée).

// Découpe les étapes en blocs contigus. Robuste : un groupeId dont la
// contiguïté est rompue (réordonnancement) retombe naturellement en blocs
// séparés (validerGroupes nettoiera les fragments orphelins).
export function construireBlocs(etapes: { groupeId?: string | null }[]): number[][] {
  const blocs: number[][] = [];
  let i = 0;
  while (i < etapes.length) {
    const g = etapes[i].groupeId;
    if (!g) { blocs.push([i]); i++; continue; }
    const indices = [i];
    let j = i + 1;
    while (j < etapes.length && etapes[j].groupeId === g) { indices.push(j); j++; }
    blocs.push(indices);
    i = j;
  }
  return blocs;
}

// Nettoie/scinde : tout fragment contigu de taille 1 portant encore un groupeId
// est libéré (un groupe doit avoir >= 2 membres). À appeler après tout
// réordonnancement (insertion/suppression/délien) dans l'éditeur.
export function validerGroupes<T extends { groupeId?: string | null }>(etapes: T[]): T[] {
  const blocs = construireBlocs(etapes);
  const result = etapes.map((e) => ({ ...e }));
  for (const bloc of blocs) {
    if (bloc.length < 2 && result[bloc[0]].groupeId) {
      result[bloc[0]] = { ...result[bloc[0]], groupeId: null };
    }
  }
  return result;
}

// Jeton de groupe opaque (per-projet). UUID via crypto si disponible.
export function genererGroupeId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return 'grp-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

function blocDeIndex(blocs: number[][], idx: number): number {
  for (let b = 0; b < blocs.length; b++) if (blocs[b].includes(idx)) return b;
  return 0;
}

// Span du bloc = max(dateFin) de ses membres.
function finBloc(etapes: EtapeEditable[], indices: number[]): Date {
  let max = new Date(etapes[indices[0]].dateFin).getTime();
  for (const k of indices) { const t = new Date(etapes[k].dateFin).getTime(); if (t > max) max = t; }
  return new Date(max);
}
// Buffer du bloc = max(buffer) de ses membres.
function bufferBloc(etapes: EtapeEditable[], indices: number[]): number {
  let max = 0;
  for (const k of indices) { const b = etapes[k].buffer || 0; if (b > max) max = b; }
  return max;
}
function joursMaxBloc(etapes: EtapeEditable[], indices: number[]): number {
  let max = 1;
  for (const k of indices) { const j = etapes[k].jours || 1; if (j > max) max = j; }
  return max;
}

// Aligne tous les membres d'un bloc sur la date de début de l'ANCRE (1er membre) ;
// chaque membre conserve son propre dureeJours (sa dateFin peut différer).
function alignerBloc(etapes: EtapeEditable[], indices: number[], estOuvrable: EstOuvrable): void {
  const debut = new Date(etapes[indices[0]].dateDebut);
  for (const k of indices) {
    const jours = etapes[k].jours;
    etapes[k].dateDebut = new Date(debut);
    etapes[k].dateFin = jours <= 1 ? new Date(debut) : addJoursOuvrables(debut, jours - 1, estOuvrable);
  }
}

export function cascadeVersBas(etapes: EtapeEditable[], fromIndex: number, estOuvrable: EstOuvrable = estOuvrableWeekend): EtapeEditable[] {
  const newEtapes = JSON.parse(JSON.stringify(etapes));
  const blocs = construireBlocs(newEtapes);
  const bFrom = blocDeIndex(blocs, fromIndex);
  // Le bloc de départ garde la date de son ancre ; ses membres s'y alignent.
  alignerBloc(newEtapes, blocs[bFrom], estOuvrable);
  for (let bi = bFrom + 1; bi < blocs.length; bi++) {
    const prev = blocs[bi - 1];
    const debut = addJoursOuvrables(finBloc(newEtapes, prev), 1 + bufferBloc(newEtapes, prev), estOuvrable);
    newEtapes[blocs[bi][0]].dateDebut = debut;
    alignerBloc(newEtapes, blocs[bi], estOuvrable);
  }
  return newEtapes;
}

export function cascadeVersHaut(etapes: EtapeEditable[], fromIndex: number, estOuvrable: EstOuvrable = estOuvrableWeekend): EtapeEditable[] {
  const newEtapes = JSON.parse(JSON.stringify(etapes));
  const blocs = construireBlocs(newEtapes);
  const bFrom = blocDeIndex(blocs, fromIndex);
  for (let bi = bFrom - 1; bi >= 0; bi--) {
    const next = blocs[bi + 1];
    const nextDebut = new Date(newEtapes[next[0]].dateDebut);
    const fin = subJoursOuvrables(nextDebut, 1 + bufferBloc(newEtapes, blocs[bi]), estOuvrable);
    const maxJours = joursMaxBloc(newEtapes, blocs[bi]);
    const debut = maxJours <= 1 ? new Date(fin) : subJoursOuvrables(fin, maxJours - 1, estOuvrable);
    newEtapes[blocs[bi][0]].dateDebut = debut;
    alignerBloc(newEtapes, blocs[bi], estOuvrable);
  }
  return newEtapes;
}

export function detecterConflits(etapes: { dateFin: Date | string; dateDebut: Date | string; groupeId?: string | null }[]): number[] {
  const conflits: number[] = [];
  for (let i = 0; i < etapes.length - 1; i++) {
    // Exemption : i et i+1 dans le même bloc (même groupeId) → chevauchement
    // intentionnel (« même jour »), ce n'est PAS un conflit.
    const g = etapes[i].groupeId;
    if (g && g === etapes[i + 1].groupeId) continue;
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

  // Back-calc PAR BLOCS : le span du bloc (max dureeJours) finit au curseur ;
  // l'espacement (+1 jour + buffer max) ne s'applique qu'ENTRE blocs.
  const blocs = construireBlocs(newEtapes);
  for (let bi = blocs.length - 1; bi >= 0; bi--) {
    const indices = blocs[bi];
    const maxJours = joursMaxBloc(newEtapes, indices);
    const debut = maxJours <= 1 ? new Date(cursor) : subJoursOuvrables(cursor, maxJours - 1, estOuvrable);
    newEtapes[indices[0]].dateDebut = debut;
    alignerBloc(newEtapes, indices, estOuvrable);
    cursor = subJoursOuvrables(debut, 1 + bufferBloc(newEtapes, indices), estOuvrable);
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
    // Helpers de blocs « même jour » — indépendants du prédicat ouvrable, exposés
    // ici pour que les surfaces destructurent tout depuis le moteur.
    construireBlocs,
    validerGroupes,
    genererGroupeId,
  };
}
