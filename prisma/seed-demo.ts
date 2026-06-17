/**
 * Seed DÉMO idempotent et re-runnable — LE seed démo canonique du projet.
 * Lancer : npx tsx prisma/seed-demo.ts   (ou : npm run seed:demo)
 *
 * CHAÎNE DE SEED (pour repartir de zéro, dans l'ordre) :
 *   1. npm run seed:jumele   → template JUMELE (38 étapes officielles)
 *   2. npm run seed:maison   → template MAISON (copie de JUMELE)
 *   3. npm run seed:users    → 3 utilisateurs d'authentification (table User)
 *   4. npm run seed:demo     → CE fichier : 20 projets + données complètes
 *
 * Remplace les données de test (projets + clients + leurs dépendances) par
 * 20 projets jumelés/maison réalistes, géocodés en Chaudière-Appalaches, avec
 * une cédule générée à partir du template de leur TYPE (JUMELE → template
 * JUMELE, MAISON → template MAISON) — jamais hardcodée. Chaque étape est
 * assignée à un fournisseur réel selon son corps de métier (cf. METIERS) ;
 * les étapes faites par DG restent internes (assigneA = null).
 *
 * Autosuffisant : crée les EMPLOYÉS (à neuf, sans doublon) et garantit la ligne
 * Parametres. Ne dépend donc plus d'un état préexistant pour ceux-ci.
 * Idempotent : à chaque exécution, on WIPE puis on recrée proprement.
 * Ne touche PAS : User (→ seed:users), Fournisseur, Template/TemplateEtape,
 * RolePermission. Parametres : créée avec défauts si absente, sinon laissée.
 *
 * Garde-fou : si un template (JUMELE ou MAISON) est absent/vide, on s'arrête
 * AVANT tout wipe (npm run seed:jumele / npm run seed:maison d'abord).
 */
import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { calculerDepuisLivraison, type EtapeEditable } from '../src/lib/cedula-utils';

dotenv.config();

const prisma = new PrismaClient();

// ── Clients (20, réalistes québécois — Cédrick Pelchat conservé) ─────────────
const CLIENTS = [
  { prenom: 'Cédrick', nom: 'Pelchat', email: 'ced.pelchat@outlook.com', telephone: '418-883-6642' },
  { prenom: 'Marie-Pier', nom: 'Lessard', email: 'mp.lessard@videotron.ca', telephone: '418-387-5521' },
  { prenom: 'Jonathan', nom: 'Bilodeau', email: 'jbilodeau.qc@gmail.com', telephone: '418-225-9034' },
  { prenom: 'Karine', nom: 'Veilleux', email: 'karine.veilleux@hotmail.com', telephone: '581-447-1188' },
  { prenom: 'Simon', nom: 'Gagnon', email: 'simon.gagnon@gmail.com', telephone: '418-774-2210' },
  { prenom: 'Audrey', nom: 'Roy', email: 'audrey.roy@outlook.com', telephone: '418-228-7745' },
  { prenom: 'Mathieu', nom: 'Cloutier', email: 'm.cloutier@videotron.ca', telephone: '581-300-6612' },
  { prenom: 'Stéphanie', nom: 'Fortin', email: 'steph.fortin@gmail.com', telephone: '418-397-4458' },
  { prenom: 'Guillaume', nom: 'Doyon', email: 'g.doyon@hotmail.com', telephone: '418-642-9931' },
  { prenom: 'Catherine', nom: 'Nadeau', email: 'cath.nadeau@gmail.com', telephone: '418-386-2204' },
  { prenom: 'Vincent', nom: 'Lehoux', email: 'v.lehoux@outlook.com', telephone: '581-225-8890' },
  { prenom: 'Josée', nom: 'Boutin', email: 'josee.boutin@videotron.ca', telephone: '418-774-5567' },
  { prenom: 'Patrick', nom: 'Giguère', email: 'p.giguere@gmail.com', telephone: '418-228-3312' },
  { prenom: 'Mélanie', nom: 'Vachon', email: 'melanie.vachon@hotmail.com', telephone: '418-387-9920' },
  { prenom: 'Francis', nom: 'Poulin', email: 'francis.poulin@gmail.com', telephone: '581-447-2236' },
  { prenom: 'Geneviève', nom: 'Morin', email: 'g.morin@outlook.com', telephone: '418-642-1175' },
  { prenom: 'Alexandre', nom: 'Turcotte', email: 'alex.turcotte@gmail.com', telephone: '418-397-6648' },
  { prenom: 'Nathalie', nom: 'Bélanger', email: 'n.belanger@videotron.ca', telephone: '418-225-4471' },
  { prenom: 'Maxime', nom: 'Drouin', email: 'max.drouin@gmail.com', telephone: '581-300-9982' },
  { prenom: 'Isabelle', nom: 'Couture', email: 'isabelle.couture@hotmail.com', telephone: '418-386-7713' },
];

// Coordonnées de base par ville (Chaudière-Appalaches). Un jitter déterministe
// par projet écarte les marqueurs d'une même ville.
const CITIES: Record<string, [number, number]> = {
  'Sainte-Claire': [46.6042, -70.8612],
  'Sainte-Marie': [46.4419, -71.0203],
  'Beauceville': [46.2108, -70.7791],
  'Saint-Henri': [46.6891, -71.0704],
  'Lévis': [46.7766, -71.1781],
  'Saint-Joseph-de-Beauce': [46.3047, -70.8772],
  'Sainte-Marguerite': [46.5547, -70.9678],
  'Saint-Georges': [46.1167, -70.6667],
  'Scott': [46.5006, -71.0689],
  'Saint-Anselme': [46.6219, -70.9750],
};

type TypeP = 'JUMELE' | 'MAISON';
type Phase = 'SIGNE' | 'PREPARATION' | 'CHANTIER' | 'LIVRAISON' | 'TERMINE';
interface ProjetDemo {
  type: TypeP;
  ville: string;
  adresse: string;
  phase: Phase;
  frac: number; // avancement cible (date-based)
  montant: number;
  typeContrat: 'PRELIMINAIRE' | 'ENTREPRISE';
}

// 20 projets : ~moitié-moitié JUMELE/MAISON, phases/avancements variés pour un
// Gantt riche (2 SIGNE, 2 PREPARATION, 11 CHANTIER 20-70 %, 3 LIVRAISON, 2 TERMINE).
const PROJETS: ProjetDemo[] = [
  { type: 'JUMELE', ville: 'Sainte-Claire', adresse: '31 Anna-Dussault', phase: 'CHANTIER', frac: 0.45, montant: 432000, typeContrat: 'PRELIMINAIRE' },
  { type: 'MAISON', ville: 'Sainte-Marie', adresse: '118 Cardinal-Bégin', phase: 'CHANTIER', frac: 0.30, montant: 565000, typeContrat: 'ENTREPRISE' },
  { type: 'JUMELE', ville: 'Beauceville', adresse: '55 Rosaire-Cliche', phase: 'LIVRAISON', frac: 0.86, montant: 458000, typeContrat: 'PRELIMINAIRE' },
  { type: 'MAISON', ville: 'Saint-Henri', adresse: '24 Honoré-Mercier', phase: 'CHANTIER', frac: 0.60, montant: 612000, typeContrat: 'ENTREPRISE' },
  { type: 'JUMELE', ville: 'Lévis', adresse: '412 des Rivières', phase: 'SIGNE', frac: 0, montant: 445000, typeContrat: 'PRELIMINAIRE' },
  { type: 'MAISON', ville: 'Saint-Joseph-de-Beauce', adresse: '9 du Verger', phase: 'CHANTIER', frac: 0.25, montant: 588000, typeContrat: 'ENTREPRISE' },
  { type: 'JUMELE', ville: 'Sainte-Marguerite', adresse: "76 de l'Église", phase: 'TERMINE', frac: 1, montant: 421000, typeContrat: 'ENTREPRISE' },
  { type: 'MAISON', ville: 'Saint-Georges', adresse: '188 130e Rue', phase: 'CHANTIER', frac: 0.50, montant: 634000, typeContrat: 'PRELIMINAIRE' },
  { type: 'JUMELE', ville: 'Scott', adresse: '14 des Pionniers', phase: 'PREPARATION', frac: 0.05, montant: 408000, typeContrat: 'PRELIMINAIRE' },
  { type: 'MAISON', ville: 'Saint-Anselme', adresse: '47 Sainte-Anne', phase: 'CHANTIER', frac: 0.70, montant: 599000, typeContrat: 'ENTREPRISE' },
  { type: 'JUMELE', ville: 'Sainte-Marie', adresse: '233 Notre-Dame Nord', phase: 'CHANTIER', frac: 0.35, montant: 467000, typeContrat: 'ENTREPRISE' },
  { type: 'MAISON', ville: 'Beauceville', adresse: '102 Saint-Joseph', phase: 'LIVRAISON', frac: 0.92, montant: 521000, typeContrat: 'PRELIMINAIRE' },
  { type: 'JUMELE', ville: 'Saint-Henri', adresse: '61 Commerciale', phase: 'CHANTIER', frac: 0.20, montant: 415000, typeContrat: 'PRELIMINAIRE' },
  { type: 'MAISON', ville: 'Sainte-Claire', adresse: '88 Principale', phase: 'CHANTIER', frac: 0.55, montant: 577000, typeContrat: 'ENTREPRISE' },
  { type: 'JUMELE', ville: 'Lévis', adresse: '305 Saint-Laurent', phase: 'CHANTIER', frac: 0.65, montant: 489000, typeContrat: 'ENTREPRISE' },
  { type: 'MAISON', ville: 'Saint-Joseph-de-Beauce', adresse: '22 des Érables', phase: 'SIGNE', frac: 0, montant: 605000, typeContrat: 'PRELIMINAIRE' },
  { type: 'JUMELE', ville: 'Saint-Georges', adresse: '410 1re Avenue', phase: 'CHANTIER', frac: 0.40, montant: 452000, typeContrat: 'PRELIMINAIRE' },
  { type: 'MAISON', ville: 'Scott', adresse: '33 du Moulin', phase: 'PREPARATION', frac: 0.05, montant: 558000, typeContrat: 'ENTREPRISE' },
  { type: 'JUMELE', ville: 'Sainte-Marguerite', adresse: '19 du Coteau', phase: 'TERMINE', frac: 1, montant: 437000, typeContrat: 'ENTREPRISE' },
  { type: 'MAISON', ville: 'Saint-Anselme', adresse: '70 de la Fabrique', phase: 'LIVRAISON', frac: 0.78, montant: 643000, typeContrat: 'PRELIMINAIRE' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function slugAccents(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
// Slug au format {nomclient}-{numero}-{nomrue} :
//  nomclient = prénom+nom collés (accents retirés, alphanumérique uniquement)
//  numero    = numéro civique tel quel
//  nomrue    = TOUS les mots de la rue (« rue », « chemin »… inclus), accents
//              retirés, espaces→tirets, tirets existants conservés, collapse.
//  Ex. Catherine Nadeau, 47 Sainte-Anne     → catherinenadeau-47-sainte-anne
//      Jason Gagné, 5 rue Amanda-Gustave     → jasongagne-5-rue-amanda-gustave
function genererSlug(prenom: string, nom: string, adresse: string): string {
  const nomclient = slugAccents(`${prenom}${nom}`).replace(/[^a-z0-9]/g, '');
  const numero = adresse.match(/^\d+/)?.[0] ?? '';
  const reste = adresse.replace(/^\d+\s*/, '');
  const nomrue = slugAccents(reste)
    .replace(/\s+/g, '-')        // espaces → tirets
    .replace(/[^a-z0-9-]/g, '')  // retire non-alphanum sauf tirets
    .replace(/-+/g, '-')         // collapse tirets multiples
    .replace(/^-|-$/g, '');      // trim tirets aux bords
  return [nomclient, numero, nomrue].filter(Boolean).join('-');
}
function coordsPour(ville: string, idx: number): [number, number] {
  const base = CITIES[ville] ?? [46.6, -70.95];
  const latOff = (((idx * 7) % 9) - 4) * 0.0022;
  const lngOff = (((idx * 11) % 11) - 5) * 0.0022;
  return [Number((base[0] + latOff).toFixed(5)), Number((base[1] + lngOff).toFixed(5))];
}
function dayPlus(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  d.setHours(12, 0, 0, 0);
  return d;
}
function estPassee(dateFin: Date, now: Date): boolean {
  const f = new Date(dateFin);
  f.setHours(23, 59, 59, 999);
  return f.getTime() < now.getTime();
}
function nbPassees(base: EtapeEditable[], livraison: Date, marge: number, now: Date): number {
  const ced = calculerDepuisLivraison(base, livraison, marge);
  return ced.filter((e) => estPassee(e.dateFin, now)).length;
}
// Date de livraison telle qu'EXACTEMENT cibleN étapes soient terminées
// aujourd'hui (nbPassees monotone non-croissant en livraison → médiane des
// candidats = boundary stable).
function trouverLivraison(base: EtapeEditable[], marge: number, cibleN: number, now: Date): Date {
  const candidats: Date[] = [];
  for (let off = -260; off <= 260; off++) {
    const liv = dayPlus(now, off);
    if (nbPassees(base, liv, marge, now) === cibleN) candidats.push(liv);
  }
  if (candidats.length > 0) return candidats[Math.floor(candidats.length / 2)];
  let best = dayPlus(now, 0);
  let bestDiff = Infinity;
  for (let off = -260; off <= 260; off++) {
    const liv = dayPlus(now, off);
    const diff = Math.abs(nbPassees(base, liv, marge, now) - cibleN);
    if (diff < bestDiff) { bestDiff = diff; best = liv; }
  }
  return best;
}
type PaiementRow = { description: string; montant: number; pourcentage: number | null; recu: boolean; dateRecu: Date | null; datePrevu: Date | null };
// Paiements selon le type de contrat ET l'avancement (A = fraction 0..1).
//  Préliminaire : acompte 15 000 $ (reçu si chantier commencé) + solde via
//    notaire (reçu seulement si livré ~100 %).
//  Entreprise : 3 jalons reçus selon des seuils d'avancement — toiture ~38 %,
//    gypse ~62 %, remise des clés ~98 %.
function paiementsPour(typeContrat: string, total: number, A: number, now: Date): PaiementRow[] {
  const passe = (jours: number) => dayPlus(now, -jours); // dateRecu dans le passé
  if (typeContrat === 'PRELIMINAIRE') {
    const acompteRecu = A > 0;
    const soldeRecu = A >= 0.98;
    return [
      { description: 'Acompte', montant: 15000, pourcentage: null, recu: acompteRecu, dateRecu: acompteRecu ? passe(110) : null, datePrevu: null },
      { description: 'Solde — notaire', montant: total - 15000, pourcentage: null, recu: soldeRecu, dateRecu: soldeRecu ? passe(7) : null, datePrevu: null },
    ];
  }
  const toitureRecu = A >= 0.38;
  const gypseRecu = A >= 0.62;
  const remiseRecu = A >= 0.98;
  return [
    { description: 'Toiture (50 %)', montant: total * 0.5, pourcentage: 50, recu: toitureRecu, dateRecu: toitureRecu ? passe(90) : null, datePrevu: null },
    { description: 'Gypse (35 %)', montant: total * 0.35, pourcentage: 35, recu: gypseRecu, dateRecu: gypseRecu ? passe(45) : null, datePrevu: null },
    { description: 'Remise des clés (15 %)', montant: total * 0.15, pourcentage: 15, recu: remiseRecu, dateRecu: remiseRecu ? passe(7) : null, datePrevu: null },
  ];
}
// ── Couches financières (feuilles de temps + dépenses) — proportionnelles à
//    l'avancement, calibrées sur une marge FINALE réaliste par projet. ─────────

// Marge finale cible (à 100 %) par projet, alignée sur l'ordre de PROJETS.
// Variété : la plupart 15-22 % « sain » ; quelques projets quasi terminés à
// 7-9 % « à surveiller » ; 1 « sous pression » à 5 %.
const MARGES_FINALES = [20, 18, 7, 19, 20, 16, 22, 15, 18, 17, 21, 9, 19, 16, 20, 18, 22, 17, 5, 21];

interface Item { description: string; fournisseur: string }
const FOURN_MAT = ['Bomat', 'Canac', 'Rona', 'BMR'];
const ITEMS_MAT: Item[] = [
  'Bois de charpente 2x6', 'Bois de charpente 2x4', 'Gypse 4x8 — 120 feuilles', 'Béton fondation — 14 m³',
  'Bardeaux de toiture', 'Fenêtres PVC — lot', 'Portes intérieures', 'Isolant R-24', 'Revêtement extérieur (canexel)',
  'Plancher ingénierie', 'Comptoir quartz', 'Céramique salle de bain', 'Quincaillerie et attaches', 'Membrane de toiture',
].map((d, k) => ({ description: d, fournisseur: FOURN_MAT[k % FOURN_MAT.length] }));
const ITEMS_SOUS: Item[] = ([
  ['Sous-traitance plomberie — rough', 'Plomberie Côté'], ['Plomberie — finition', 'Plomberie Côté'],
  ['Électricité — filage', 'Élec. Vachon'], ['Électricité — finition', 'Élec. Vachon'],
  ['Pose et tirage de gypse', 'Gypse Beauce'], ['Peinture intérieure', 'Peinture Martin'],
  ['Céramique — pose', 'Céramique Plus'], ['Armoires — installation', 'Cuisines Beauce'],
  ["Ventilation / échangeur d'air", 'Ventil. Express'],
] as [string, string][]).map(([description, fournisseur]) => ({ description, fournisseur }));
const ITEMS_EQUIP: Item[] = ([
  ['Location nacelle', 'Location Beauce'], ['Location pompe à béton', 'Location Beauce'],
  ['Location échafaudage', 'Loca-Outils'], ['Chauffage temporaire de chantier', 'Loca-Outils'],
] as [string, string][]).map(([description, fournisseur]) => ({ description, fournisseur }));
const ITEMS_AUTRE: Item[] = ([
  ['Permis municipal', 'Municipalité'], ['Conteneur à déchets', 'Services Sanitaires'],
  ['Branchement Hydro temporaire', 'Hydro-Québec'], ["Frais d'arpentage", 'Arpentage Bernard'],
] as [string, string][]).map(([description, fournisseur]) => ({ description, fournisseur }));

// PRNG déterministe (mulberry32) → données stables d'une exécution à l'autre.
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function startOfDay(d: Date): Date { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
function mondayOnOrBefore(d: Date): Date { const x = startOfDay(d); const day = x.getDay(); x.setDate(x.getDate() + (day === 0 ? -6 : 1 - day)); return x; }
function lundisEcoules(debut: Date, now: Date): Date[] {
  const out: Date[] = [];
  let m = mondayOnOrBefore(debut);
  while (m.getTime() <= now.getTime()) { out.push(new Date(m)); m = new Date(m.getTime() + 7 * 86400000); }
  return out;
}

interface Emp { id: string; tauxHoraire: number }
type FeuilleRow = { projetId: string; employeId: string; date: Date; heures: number; tauxHoraire: number; notes: string | null; approuve: boolean };
type DepRow = { projetId: string; categorie: 'MATERIAUX' | 'SOUS_TRAITANT' | 'EQUIPEMENT' | 'AUTRE'; description: string; fournisseur: string; montant: number; dateDepense: Date; facture: string | null; notes: string | null };

// Feuilles de temps réalistes (7 h/jour ouvrable ≤ max), réparties sur les
// semaines écoulées. 1-3 employés selon avancement/taille. Retourne aussi le
// coût main-d'œuvre réel (Σ heures × taux figé).
function genFeuilles(projetId: string, offset: number, A: number, montant: number, debut: Date, now: Date, employes: Emp[], maxHeures: number): { rows: FeuilleRow[]; coutMO: number } {
  const rows: FeuilleRow[] = [];
  let coutMO = 0;
  if (employes.length === 0 || A <= 0) return { rows, coutMO };
  const nbEmp = Math.max(1, Math.min(3, 1 + (A > 0.5 ? 1 : 0) + (montant > 580000 ? 1 : 0)));
  const heuresJour = Math.min(7, maxHeures / 5); // ≤ max/semaine
  const debut0 = startOfDay(debut).getTime();
  for (let k = 0; k < nbEmp; k++) {
    const emp = employes[(offset + k) % employes.length];
    for (const lundi of lundisEcoules(debut, now)) {
      for (let dj = 0; dj < 5; dj++) {
        const jour = new Date(lundi.getTime() + dj * 86400000);
        if (jour.getTime() < debut0 || jour.getTime() > now.getTime()) continue;
        rows.push({ projetId, employeId: emp.id, date: jour, heures: heuresJour, tauxHoraire: emp.tauxHoraire, notes: null, approuve: true });
        coutMO += heuresJour * emp.tauxHoraire;
      }
    }
  }
  return { rows, coutMO };
}

// Lignes de dépenses (hors main-d'œuvre) totalisant `budget`, réparties par
// catégorie et dans le passé.
function genDepenses(projetId: string, A: number, budget: number, debut: Date, now: Date, rng: () => number): DepRow[] {
  const rows: DepRow[] = [];
  if (budget <= 0) return rows;
  const span = Math.max(1, now.getTime() - startOfDay(debut).getTime());
  const cats: { categorie: DepRow['categorie']; part: number; items: Item[]; count: number }[] = [
    { categorie: 'MATERIAUX', part: 0.62, items: ITEMS_MAT, count: Math.max(4, Math.min(16, Math.round(8 + A * 8))) },
    { categorie: 'SOUS_TRAITANT', part: 0.28, items: ITEMS_SOUS, count: Math.max(2, Math.min(8, Math.round(3 + A * 5))) },
    { categorie: 'EQUIPEMENT', part: 0.07, items: ITEMS_EQUIP, count: Math.max(1, Math.min(3, Math.round(1 + A * 2))) },
    { categorie: 'AUTRE', part: 0.03, items: ITEMS_AUTRE, count: Math.max(1, Math.min(2, Math.round(1 + A))) },
  ];
  for (const c of cats) {
    const catBudget = budget * c.part;
    const poids: number[] = [];
    let somme = 0;
    for (let n = 0; n < c.count; n++) { const w = 0.6 + rng(); poids.push(w); somme += w; }
    for (let n = 0; n < c.count; n++) {
      const montant = Math.round((catBudget * poids[n] / somme) / 5) * 5;
      if (montant <= 0) continue;
      const it = c.items[n % c.items.length];
      const dateDepense = new Date(startOfDay(debut).getTime() + Math.floor(rng() * span));
      rows.push({ projetId, categorie: c.categorie, description: it.description, fournisseur: it.fournisseur, montant, dateDepense, facture: null, notes: null });
    }
  }
  return rows;
}

// ── Extras (travaux additionnels demandés par le client) ─────────────────────
const EXTRAS_POOL: { description: string; montant: number; fournisseur: string | null }[] = [
  { description: 'Céramique format 24x24 (mise à niveau)', montant: 1200, fournisseur: 'Céramique Plus' },
  { description: 'Escalier en bois franc', montant: 2400, fournisseur: null },
  { description: 'Comptoir de quartz (mise à niveau)', montant: 3200, fournisseur: 'Cuisines Beauce' },
  { description: 'Plancher chauffant — salle de bain', montant: 1800, fournisseur: 'Plomberie Côté' },
  { description: 'Douche en céramique pleine hauteur', montant: 1500, fournisseur: 'Céramique Plus' },
  { description: 'Îlot de cuisine agrandi', montant: 2100, fournisseur: 'Cuisines Beauce' },
  { description: 'Foyer au gaz', montant: 4500, fournisseur: 'Ventil. Express' },
  { description: 'Aspirateur central', montant: 1300, fournisseur: null },
  { description: 'Thermopompe murale supplémentaire', montant: 2800, fournisseur: 'Ventil. Express' },
  { description: 'Luminaires DEL — cuisine et salon', montant: 680, fournisseur: 'Élec. Vachon' },
  { description: 'Garde-corps en verre', montant: 2600, fournisseur: null },
  { description: "Armoires jusqu'au plafond", montant: 1900, fournisseur: 'Cuisines Beauce' },
  { description: 'Robinetterie haut de gamme', montant: 900, fournisseur: 'Plomberie Côté' },
  { description: 'Stores motorisés', montant: 2200, fournisseur: null },
  { description: 'Terrasse arrière agrandie', montant: 3500, fournisseur: null },
];
type ExtraRow = { projetId: string; description: string; montant: number; fournisseur: string | null; statut: 'EN_ATTENTE' | 'SIGNE' | 'REFUSE'; signeLe: Date | null };
// Extras réalistes : 1-4 par projet commencé (majorité SIGNÉ, quelques en
// attente, un occasionnel refusé), 0-1 EN_ATTENTE pour un projet non commencé.
// Les SIGNÉ portent une date de signature passée ; alimentent le revenu costing
// (revenus = contrat + extras signés) et la métrique « Extras non signés ».
function genExtras(projetId: string, A: number, premierDebut: Date, now: Date, rng: () => number): ExtraRow[] {
  const rows: ExtraRow[] = [];
  const count = A > 0 ? 1 + Math.floor(rng() * 4) : (rng() < 0.5 ? 1 : 0);
  const start = startOfDay(premierDebut).getTime();
  const span = Math.max(1, now.getTime() - start);
  const offset = Math.floor(rng() * EXTRAS_POOL.length);
  for (let k = 0; k < count; k++) {
    const it = EXTRAS_POOL[(offset + k) % EXTRAS_POOL.length];
    let statut: ExtraRow['statut'];
    if (A <= 0) statut = 'EN_ATTENTE';
    else { const r = rng(); statut = r < 0.6 ? 'SIGNE' : r < 0.85 ? 'EN_ATTENTE' : 'REFUSE'; }
    const signeLe = statut === 'SIGNE' ? new Date(start + Math.floor(rng() * span)) : null;
    const montant = Math.round((it.montant * (0.9 + rng() * 0.25)) / 5) * 5;
    rows.push({ projetId, description: it.description, montant, fournisseur: it.fournisseur, statut, signeLe });
  }
  return rows;
}

// Étapes de base (depuis un template, jamais hardcodées).
function baseDepuisTemplate(etapes: { nom: string; ordre: number; joursDefaut: number; assigneA: string | null; visibleClient: boolean; interne: boolean }[]): EtapeEditable[] {
  return etapes.map((te) => ({
    nom: te.nom,
    ordre: te.ordre,
    jours: te.joursDefaut,
    dateDebut: new Date(),
    dateFin: new Date(),
    buffer: 0,
    assigneA: te.assigneA ?? '',
    visibleClient: te.visibleClient,
    interne: te.interne,
  }));
}

// ── Employés (recréés à neuf à chaque seed → jamais de doublon) ──────────────
// Mêmes taux que l'historique (la calibration financière en dépend).
const EMPLOYES = [
  { prenom: 'Jason', nom: 'Turmel', email: 'jason@sideways.media', telephone: '418-555-0001', tauxHoraire: 42, actif: true },
  { prenom: 'Nicolas', nom: 'Savard', email: 'nicolas.savard@habitationsdg.com', telephone: '418-555-0002', tauxHoraire: 45, actif: true },
  { prenom: 'Louis', nom: 'Bellavance', email: 'louis.bellavance@habitationsdg.com', telephone: '418-555-0003', tauxHoraire: 32, actif: true },
  { prenom: 'Sophie-Rose', nom: 'Dion', email: 'sophie-rose.dion@habitationsdg.com', telephone: '418-555-0004', tauxHoraire: 38, actif: true },
];

// ── Attribution des étapes à un fournisseur (corps de métier) ────────────────
// Mappe le NOM d'une étape (template) vers l'un des 7 fournisseurs réels. Les
// étapes faites par DG (mesures, livraisons, entrées, finitions internes,
// ménage…) → null : le tableau de bord affichera « Habitations DG ». On
// n'invente JAMAIS de fournisseur : si le métier n'a pas de fournisseur dans la
// base, l'étape reste interne (null).
const ETAPES_INTERNES = [
  'mesure', 'livraison', 'entrée', 'entree', 'ménage', 'menage', 'inspection',
  'service', 'isolation', 'couler plancher', 'intérieur division', 'interieur division',
  'final menuiserie', 'pose finition', 'pose plancher', 'pose escalier', 'pose tapis',
  'pose miroir', 'petite finition', 'porte de douche',
];
const METIERS: { motsCles: string[]; fournisseur: string }[] = [
  { motsCles: ['plomb'], fournisseur: 'Plomberie Côté' },
  { motsCles: ['électr', 'electr', 't.v.'], fournisseur: 'Élec. Vachon' },
  { motsCles: ['gypse', 'tireur de joints'], fournisseur: 'Gypse Beauce' },
  { motsCles: ['peinture'], fournisseur: 'Peinture Martin' },
  { motsCles: ['céramique', 'ceramique', 'coulis'], fournisseur: 'Céramique Plus' },
  { motsCles: ['armoire', 'dosseret'], fournisseur: 'Cuisines Beauce' },
  { motsCles: ['climatisé', 'climatise', 'échangeur', 'echangeur', 'ventil', 'foyer'], fournisseur: 'Ventil. Express' },
];
function fournisseurPourEtape(nom: string, dispo: Set<string>): string | null {
  const n = nom.toLowerCase();
  if (ETAPES_INTERNES.some((k) => n.includes(k))) return null; // étape interne (DG)
  for (const m of METIERS) {
    if (m.motsCles.some((k) => n.includes(k))) {
      return dispo.has(m.fournisseur) ? m.fournisseur : null; // ne jamais inventer
    }
  }
  return null; // par défaut : interne
}

// ── Programme principal ──────────────────────────────────────────────────────
async function main() {
  const now = new Date();

  // 0) Garde-fou : templates JUMELE ET MAISON peuplés AVANT tout wipe.
  const templates = await prisma.template.findMany({
    where: { type: { in: ['JUMELE', 'MAISON'] } },
    include: { etapes: { orderBy: { ordre: 'asc' } } },
  });
  const tplJumele = templates.find((t) => t.type === 'JUMELE');
  const tplMaison = templates.find((t) => t.type === 'MAISON');
  const manquant: string[] = [];
  if (!tplJumele || tplJumele.etapes.length === 0) manquant.push('JUMELE (npm run seed:jumele)');
  if (!tplMaison || tplMaison.etapes.length === 0) manquant.push('MAISON (npm run seed:maison)');
  if (manquant.length > 0) {
    console.error(`✋ ARRÊT : template(s) vide(s)/absent(s) → ${manquant.join(', ')}.`);
    console.error("   Aucune donnée n'a été supprimée.");
    process.exitCode = 1;
    return;
  }

  // Parametres : garantir la ligne singleton (créée avec défauts si absente,
  // sinon laissée intacte — seed-demo n'écrase pas une config existante).
  const parametres = await prisma.parametres.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton' },
  });
  const marge = parametres.margeCeduleJours;
  const maxHeures = parametres.maxHeuresParSemaine;

  const baseParType: Record<TypeP, EtapeEditable[]> = {
    JUMELE: baseDepuisTemplate(tplJumele!.etapes),
    MAISON: baseDepuisTemplate(tplMaison!.etapes),
  };

  // 1) WIPE (ordre FK : enfants → Projet → Client ; Employe APRÈS feuilleTemps).
  //    Employe inclus → recréation à neuf ci-dessous (corrige le bug de
  //    duplication de l'ancien seed, qui créait les employés sans les wiper).
  await prisma.$transaction([
    prisma.feuilleTemps.deleteMany({}),
    prisma.employe.deleteMany({}),
    prisma.depense.deleteMany({}),
    prisma.projetFournisseur.deleteMany({}),
    prisma.tache.deleteMany({}),
    prisma.extra.deleteMany({}),
    prisma.paiement.deleteMany({}),
    prisma.inspectionGCR.deleteMany({}),
    prisma.projet.deleteMany({}),
    prisma.client.deleteMany({}),
  ]);

  // Employés recréés à neuf (jamais de doublon) → main-d'œuvre des feuilles.
  await prisma.employe.createMany({ data: EMPLOYES });
  const employes: Emp[] = (await prisma.employe.findMany({ where: { actif: true }, orderBy: { tauxHoraire: 'asc' } })).map((e) => ({ id: e.id, tauxHoraire: e.tauxHoraire }));

  // Fournisseurs réels (lus, JAMAIS créés ici) → assignation des étapes.
  const fournisseurs = await prisma.fournisseur.findMany({ where: { actif: true } });
  const fournNoms = new Set(fournisseurs.map((f) => f.nom));

  // 2) Clients
  const clientIds: string[] = [];
  for (const c of CLIENTS) {
    const created = await prisma.client.create({ data: c });
    clientIds.push(created.id);
  }

  // 3) + 4) Projets + cédule depuis le template de leur type
  type Ligne = { type: string; phase: string; avancement: number; ville: string; adresse: string; livraison: Date; slug: string; coords: string; etapes: number };
  const resume: Ligne[] = [];
  let totalFeuilles = 0;
  let totalDepenses = 0;
  let totalAttendu = 0;
  let totalExtras = 0;
  let extrasSignesN = 0, extrasSignesM = 0, extrasAttenteN = 0, extrasAttenteM = 0;
  const assignTally: Record<string, number> = {};
  let interneCount = 0;
  const costing: { adresse: string; revenu: number; depenses: number; marge: number }[] = [];
  const usedSlugs = new Set<string>();
  let exempleEntreprise: { adresse: string; avancement: number; jalons: string[] } | null = null;
  // Dates d'ancre GCR par projet (pour créer les inspections après la boucle).
  const inspectionsPlan: { projetId: string; gypseDate: Date | null; finitionDate: Date | null }[] = [];
  // Liens ProjetFournisseur à créer (après la boucle).
  const projFournData: { projetId: string; fournisseurId: string; budgetAlloue: number; confirme: boolean }[] = [];

  for (let i = 0; i < PROJETS.length; i++) {
    const p = PROJETS[i];
    const base = baseParType[p.type];
    const nbEtapes = base.length;
    const cibleN = Math.round(p.frac * nbEtapes);
    const livraison = trouverLivraison(base, marge, cibleN, now);

    const cedule = calculerDepuisLivraison(base, livraison, marge);
    const passees = cedule.filter((e) => estPassee(e.dateFin, now)).length;
    const avancement = Math.round((passees / nbEtapes) * 100);

    const A = passees / nbEtapes;
    // Slug {nomclient}-{numero}-{nomrue}, unique (suffixe -2, -3… si collision).
    let slug = genererSlug(CLIENTS[i].prenom, CLIENTS[i].nom, p.adresse);
    if (usedSlugs.has(slug)) { let n = 2; while (usedSlugs.has(`${slug}-${n}`)) n++; slug = `${slug}-${n}`; }
    usedSlugs.add(slug);
    const premierDebut = cedule[0]?.dateDebut ?? now;
    const ancre = premierDebut.getTime() < now.getTime() ? premierDebut : now;
    const dateContrat = dayPlus(ancre, -21);
    const [lat, lng] = coordsPour(p.ville, i + 1);

    const projet = await prisma.projet.create({
      data: {
        numero: `PRJ-2600${String(i + 1).padStart(2, '0')}`,
        adresse: p.adresse,
        ville: p.ville,
        typeProjet: p.type,
        typeContrat: p.typeContrat,
        phase: p.phase,
        dateContrat,
        dateLivraison: livraison,
        montantTotal: p.montant,
        toleranceJours: parametres?.toleranceDefautJours ?? 3,
        slug,
        urlClient: slug,
        latitude: lat,
        longitude: lng,
        clientId: clientIds[i],
      },
    });

    await prisma.tache.createMany({
      data: cedule.map((e) => {
        const assigneA = fournisseurPourEtape(e.nom, fournNoms);
        if (assigneA) assignTally[assigneA] = (assignTally[assigneA] || 0) + 1;
        else interneCount++;
        return {
          projetId: projet.id,
          nom: e.nom,
          ordre: e.ordre,
          dateDebut: e.dateDebut,
          dateFin: e.dateFin,
          dureeJours: e.jours,
          assigneA,
          visibleClient: e.visibleClient,
          interne: e.interne,
          // Ancre d'inspection GCR posée par nom (étapes uniques du template).
          ancrageInspection: e.nom === 'Pose gypse' ? 'GYPSE' : e.nom === 'Pose finition' ? 'FINITION' : null,
          buffer: 0,
        };
      }),
    });

    inspectionsPlan.push({
      projetId: projet.id,
      gypseDate: cedule.find((e) => e.nom === 'Pose gypse')?.dateDebut ?? null,
      finitionDate: cedule.find((e) => e.nom === 'Pose finition')?.dateDebut ?? null,
    });

    // Liens fournisseurs : les sous-traitants assignés à la cédule de ce projet.
    // Confirmés (= visibles côté client) dès que le chantier est lancé (A > 0.1).
    const fournProjet = new Set(cedule.map((e) => fournisseurPourEtape(e.nom, fournNoms)).filter((x): x is string => !!x));
    for (const nom of fournProjet) {
      const f = fournisseurs.find((ff) => ff.nom === nom);
      if (!f) continue;
      projFournData.push({
        projetId: projet.id,
        fournisseurId: f.id,
        budgetAlloue: Math.round((p.montant * 0.08) / 500) * 500,
        confirme: A > 0.1,
      });
    }

    const paiements = paiementsPour(p.typeContrat, p.montant, A, now);
    await prisma.paiement.createMany({
      data: paiements.map((pp) => ({ projetId: projet.id, ...pp })),
    });
    totalAttendu += paiements.filter((pp) => !pp.recu).reduce((s, pp) => s + pp.montant, 0);
    if (!exempleEntreprise && p.typeContrat === 'ENTREPRISE' && avancement >= 45 && avancement <= 60) {
      exempleEntreprise = { adresse: `${p.adresse}, ${p.ville}`, avancement, jalons: paiements.map((pp) => `${pp.description} — ${pp.recu ? 'reçu' : 'attendu'}`) };
    }

    // Extras (travaux additionnels) — alimentent le revenu costing (signés) et la
    // métrique dashboard « Extras non signés ».
    const extras = genExtras(projet.id, A, premierDebut, now, mulberry32(i + 101));
    let extrasSignesProjet = 0;
    if (extras.length > 0) {
      await prisma.extra.createMany({ data: extras });
      totalExtras += extras.length;
      for (const ex of extras) {
        if (ex.statut === 'SIGNE') { extrasSignesN++; extrasSignesM += ex.montant; extrasSignesProjet += ex.montant; }
        else if (ex.statut === 'EN_ATTENTE') { extrasAttenteN++; extrasAttenteM += ex.montant; }
      }
    }

    // Couche financière — proportionnelle à l'avancement A, calibrée sur la marge
    // FINALE du projet. Main-d'œuvre (feuilles) + dépenses (matériaux/sous-traitants/
    // équipement/autre). Rien si avancement nul (projets SIGNE).
    let depTotal = 0;
    if (A > 0) {
      const margeFinale = MARGES_FINALES[i] ?? 18;
      const fullBudget = p.montant * (1 - margeFinale / 100);
      // Coûts engagés proportionnels à l'avancement, avec un plancher
      // « mobilisation » (~21 % du contrat) dès que le chantier est lancé
      // (≥ 15 %) : fondation/charpente/matériaux sont front-loadés. Garde la
      // marge affichée < 80 % sur les chantiers actifs sans gonfler les projets
      // à peine commencés (PREPARATION).
      const engagedProp = A * fullBudget;
      const engaged = A >= 0.15 ? Math.max(engagedProp, p.montant * 0.21) : engagedProp;
      const { rows: feuilles, coutMO } = genFeuilles(projet.id, i, A, p.montant, premierDebut, now, employes, maxHeures);
      const nonLabor = Math.max(0, engaged - coutMO);
      const deps = genDepenses(projet.id, A, nonLabor, premierDebut, now, mulberry32(i + 1));
      if (feuilles.length > 0) { await prisma.feuilleTemps.createMany({ data: feuilles }); totalFeuilles += feuilles.length; }
      if (deps.length > 0) { await prisma.depense.createMany({ data: deps }); totalDepenses += deps.length; }
      depTotal = coutMO + deps.reduce((s, d) => s + d.montant, 0);
    }
    // Revenu costing = contrat + extras signés (comme /api/projets/costing).
    const revenu = p.montant + extrasSignesProjet;
    const margeAffichee = revenu > 0 ? Math.round(((revenu - depTotal) / revenu) * 100) : 0;
    costing.push({ adresse: `${p.adresse}, ${p.ville}`, revenu, depenses: Math.round(depTotal), marge: margeAffichee });

    resume.push({ type: p.type, phase: p.phase, avancement, ville: p.ville, adresse: p.adresse, livraison, slug, coords: `${lat}, ${lng}`, etapes: cedule.length });
  }

  // 4-bis) Inspections GCR — 1 GYPSE + 1 FINITION par projet. RÉSERVÉES partout
  // (statut RESERVE + dateReservee = date de l'étape ancrée) SAUF ~3 laissées
  // A_RESERVER, choisies parmi celles dont l'étape ancrée tombe à <= 21 jours,
  // pour produire ~3 alertes dashboard réelles (pas une par projet).
  const inspData: { projetId: string; type: 'GYPSE' | 'FINITION'; statut: 'A_RESERVER' | 'RESERVE'; dateReservee: Date | null }[] = [];
  let inspAReserver = 0;
  for (const plan of inspectionsPlan) {
    const paires: { type: 'GYPSE' | 'FINITION'; date: Date | null }[] = [
      { type: 'GYPSE', date: plan.gypseDate },
      { type: 'FINITION', date: plan.finitionDate },
    ];
    for (const { type, date } of paires) {
      const j = date ? Math.ceil((date.getTime() - now.getTime()) / 86400000) : null;
      const garderAlerte = inspAReserver < 3 && j !== null && j >= 0 && j <= 21;
      if (garderAlerte) inspAReserver++;
      inspData.push({
        projetId: plan.projetId,
        type,
        statut: garderAlerte ? 'A_RESERVER' : 'RESERVE',
        dateReservee: garderAlerte ? null : date,
      });
    }
  }
  await prisma.inspectionGCR.createMany({ data: inspData });
  await prisma.projetFournisseur.createMany({ data: projFournData });

  // 5) Résumé
  resume.sort((a, b) => a.livraison.getTime() - b.livraison.getTime());
  console.log('\n=== SEED DÉMO — RÉSUMÉ (20 projets, triés par livraison) ===');
  console.log(`Templates : JUMELE ${tplJumele!.etapes.length} ét. · MAISON ${tplMaison!.etapes.length} ét. · marge ${marge} j ouvr.`);
  console.log(`${CLIENTS.length} clients, ${PROJETS.length} projets créés.\n`);
  for (const r of resume) {
    const liv = r.livraison.toLocaleDateString('fr-CA', { day: '2-digit', month: 'short', year: 'numeric' });
    console.log(`  ${liv}  ${r.type.padEnd(6)} ${r.phase.padEnd(11)} ${String(r.avancement).padStart(3)}%  ${r.adresse}, ${r.ville}`);
  }
  const livs = resume.map((r) => r.livraison.getTime());
  const span = Math.round((Math.max(...livs) - Math.min(...livs)) / (1000 * 60 * 60 * 24));
  const tousCoords = resume.every((r) => !!r.coords && !r.coords.startsWith('undefined'));
  const tousSlug = resume.every((r) => !!r.slug);
  console.log(`\nPlage de livraisons : ${span} jours (~${Math.round(span / 30)} mois) → Gantt avec chevauchements.`);
  console.log(`Carte : ${tousCoords ? 'OK — 20 projets géocodés.' : '⚠ coordonnées manquantes.'}`);
  console.log(`Vue client : ${tousSlug ? 'OK — 20 slugs.' : '⚠ slug manquant.'}`);

  // Financier
  console.log(`\nFinancier : ${totalFeuilles} feuilles de temps, ${totalDepenses} dépenses fournisseurs.`);
  const sain = costing.filter((c) => c.marge >= 20).sort((a, b) => b.depenses - a.depenses)[0];
  const surveiller = costing.filter((c) => c.marge >= 10 && c.marge < 20).sort((a, b) => a.marge - b.marge)[0];
  const pression = costing.filter((c) => c.marge < 10).sort((a, b) => a.marge - b.marge)[0];
  console.log('Costing — exemples (revenu / dépenses engagées / marge affichée) :');
  for (const ex of [sain, surveiller, pression]) {
    if (ex) {
      const sante = ex.marge >= 20 ? 'sain' : ex.marge >= 10 ? 'à surveiller' : 'sous pression';
      console.log(`  ${ex.adresse} : ${ex.revenu.toLocaleString('fr-CA')} $ / ${ex.depenses.toLocaleString('fr-CA')} $ / ${ex.marge}% (${sante})`);
    }
  }
  console.log(`Santé : ${costing.filter((c) => c.marge >= 20).length} sains · ${costing.filter((c) => c.marge >= 10 && c.marge < 20).length} à surveiller · ${costing.filter((c) => c.marge < 10).length} sous pression.`);

  // Slugs + paiements
  console.log('\nSlugs (exemples) :');
  for (const r of resume.slice(0, 3)) console.log(`  ${r.adresse} → ${r.slug}`);
  console.log(`\nPaiements — total « attendu » (non reçus) = ${Math.round(totalAttendu).toLocaleString('fr-CA')} $.`);
  if (exempleEntreprise) {
    console.log(`Exemple Entreprise à ~${exempleEntreprise.avancement}% (${exempleEntreprise.adresse}) :`);
    for (const j of exempleEntreprise.jalons) console.log(`  ${j}`);
  }

  console.log(`\nExtras : ${totalExtras} créés — ${extrasSignesN} signés (${Math.round(extrasSignesM).toLocaleString('fr-CA')} $, ajoutés au revenu costing), ${extrasAttenteN} en attente (${Math.round(extrasAttenteM).toLocaleString('fr-CA')} $ → « Extras non signés »).`);

  console.log(`\nInspections GCR : ${inspData.length} créées — ${inspAReserver} « à réserver » (~alertes dashboard), ${inspData.length - inspAReserver} réservées.`);
  console.log(`Liens fournisseurs : ${projFournData.length} créés (${projFournData.filter((l) => l.confirme).length} confirmés → visibles client).`);

  // Attribution des étapes aux fournisseurs
  console.log('\nÉtapes assignées aux fournisseurs :');
  for (const [f, n] of Object.entries(assignTally).sort((a, b) => b[1] - a[1])) console.log(`  ${f.padEnd(16)} ${n}`);
  console.log(`  ${'(interne / DG)'.padEnd(16)} ${interneCount}`);
}

main()
  .catch((e) => { console.error('ERREUR seed démo:', e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
