/**
 * Seed DÉMO idempotent et re-runnable.
 * Lancer : npx tsx prisma/seed-demo.ts
 *
 * Remplace les données de test (projets + clients + leurs dépendances) par
 * 4 projets jumelés réalistes, géocodés en Chaudière-Appalaches, avec une
 * cédule générée à partir du template JUMELE de la DB (jamais hardcodée).
 *
 * Idempotent : à chaque exécution, on WIPE puis on recrée proprement.
 * Ne touche PAS : User, Employe, Fournisseur, Parametres, Template/
 * TemplateEtape, RolePermission.
 *
 * Garde-fou : si le template JUMELE est absent/vide, on s'arrête AVANT tout
 * wipe (npm run seed:jumele doit avoir été lancé).
 */
import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { calculerDepuisLivraison, type EtapeEditable } from '../src/lib/cedula-utils';

dotenv.config();

const prisma = new PrismaClient();

// ── Données démo ───────────────────────────────────────────────────────────
const CLIENTS = [
  { prenom: 'Cédrick', nom: 'Pelchat', email: 'ced.pelchat@outlook.com', telephone: '418-883-6642' },
  { prenom: 'Marie-Pier', nom: 'Lessard', email: 'mp.lessard@videotron.ca', telephone: '418-387-5521' },
  { prenom: 'Jonathan', nom: 'Bilodeau', email: 'jbilodeau.qc@gmail.com', telephone: '418-225-9034' },
  { prenom: 'Karine', nom: 'Veilleux', email: 'karine.veilleux@hotmail.com', telephone: '581-447-1188' },
];

type Frac = 0 | 0.25 | 0.5 | 0.75;
interface ProjetDemo {
  numero: string;
  adresse: string;
  ville: string;
  phase: 'SIGNE' | 'CHANTIER' | 'LIVRAISON';
  typeContrat: 'PRELIMINAIRE' | 'ENTREPRISE';
  montantTotal: number;
  latitude: number;
  longitude: number;
  cibleAvancement: Frac;
}

// Coordonnées fixes (pas de géocodage Nominatim), distinctes, dans la zone réelle
// de chaque ville de Chaudière-Appalaches → marqueurs visibles sur la carte.
const PROJETS: ProjetDemo[] = [
  { numero: 'PRJ-260001', adresse: '31 Anna-Dussault', ville: 'Sainte-Claire', phase: 'SIGNE', typeContrat: 'PRELIMINAIRE', montantTotal: 425000, latitude: 46.6042, longitude: -70.8612, cibleAvancement: 0 },
  { numero: 'PRJ-260002', adresse: '118 Cardinal-Bégin', ville: 'Sainte-Marie', phase: 'CHANTIER', typeContrat: 'ENTREPRISE', montantTotal: 458500, latitude: 46.4419, longitude: -71.0203, cibleAvancement: 0.25 },
  { numero: 'PRJ-260003', adresse: '55 Rosaire-Cliche', ville: 'Beauceville', phase: 'CHANTIER', typeContrat: 'PRELIMINAIRE', montantTotal: 412000, latitude: 46.2108, longitude: -70.7791, cibleAvancement: 0.5 },
  { numero: 'PRJ-260004', adresse: '24 Honoré-Mercier', ville: 'Saint-Henri', phase: 'LIVRAISON', typeContrat: 'ENTREPRISE', montantTotal: 489000, latitude: 46.6891, longitude: -71.0704, cibleAvancement: 0.75 },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function normalize(str: string): string {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
}
// Slug au format habituel : prenomnom-numero-rue
function buildSlug(prenom: string, nom: string, adresse: string): string {
  const numAdresse = adresse.match(/^\d+/)?.[0] ?? '';
  const premierMot = adresse.replace(/^\d+\s*/, '').split(/[\s-]/)[0] ?? '';
  return `${normalize(prenom)}${normalize(nom)}-${numAdresse}-${normalize(premierMot)}`;
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
// Nombre d'étapes terminées (dateFin passée) pour une date de livraison donnée.
function nbPassees(base: EtapeEditable[], livraison: Date, marge: number, now: Date): number {
  const ced = calculerDepuisLivraison(base, livraison, marge);
  return ced.filter((e) => estPassee(e.dateFin, now)).length;
}
// Cherche une date de livraison telle que EXACTEMENT cibleN étapes soient
// terminées aujourd'hui. nbPassees est monotone non-croissant en livraison →
// on scanne et on prend la médiane des candidats (boundary stable d'un jour à
// l'autre, donc avancement robuste aux ré-exécutions dans la même semaine).
function trouverLivraison(base: EtapeEditable[], marge: number, cibleN: number, now: Date): Date {
  const candidats: Date[] = [];
  for (let off = -220; off <= 240; off++) {
    const liv = dayPlus(now, off);
    if (nbPassees(base, liv, marge, now) === cibleN) candidats.push(liv);
  }
  if (candidats.length > 0) return candidats[Math.floor(candidats.length / 2)];
  // Repli : la date qui s'approche le plus de la cible.
  let best = dayPlus(now, 0);
  let bestDiff = Infinity;
  for (let off = -220; off <= 240; off++) {
    const liv = dayPlus(now, off);
    const diff = Math.abs(nbPassees(base, liv, marge, now) - cibleN);
    if (diff < bestDiff) { bestDiff = diff; best = liv; }
  }
  return best;
}

// Échéancier de paiement selon le type de contrat (logique CLAUDE.md).
function paiementsPour(typeContrat: string, total: number) {
  if (typeContrat === 'PRELIMINAIRE') {
    return [
      { description: 'Acompte', montant: 15000, pourcentage: null as number | null, recu: false },
      { description: 'Solde — notaire', montant: total - 15000, pourcentage: null as number | null, recu: false },
    ];
  }
  return [
    { description: 'Toiture (50 %)', montant: total * 0.5, pourcentage: 50 as number | null, recu: false },
    { description: 'Gypse (35 %)', montant: total * 0.35, pourcentage: 35 as number | null, recu: false },
    { description: 'Remise des clés (15 %)', montant: total * 0.15, pourcentage: 15 as number | null, recu: false },
  ];
}

// ── Programme principal ──────────────────────────────────────────────────────
async function main() {
  const now = new Date();

  // 0) Garde-fou : template JUMELE peuplé AVANT tout wipe.
  const template = await prisma.template.findFirst({
    where: { type: 'JUMELE' },
    include: { etapes: { orderBy: { ordre: 'asc' } } },
  });
  if (!template || template.etapes.length === 0) {
    console.error('✋ ARRÊT : le template JUMELE est absent ou vide en DB.');
    console.error('   Lance d\'abord :  npm run seed:jumele');
    console.error('   Aucune donnée n\'a été supprimée.');
    process.exitCode = 1;
    return;
  }

  const parametres = await prisma.parametres.findUnique({ where: { id: 'singleton' } });
  const marge = parametres?.margeCeduleJours ?? 5;

  // Étapes de base (depuis le template, jamais hardcodées).
  const baseEtapes: EtapeEditable[] = template.etapes.map((te) => ({
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
  const nbEtapes = baseEtapes.length;

  // 1) WIPE (ordre FK : enfants → Projet → Client). Transaction.
  await prisma.$transaction([
    prisma.feuilleTemps.deleteMany({}),
    prisma.depense.deleteMany({}),
    prisma.projetFournisseur.deleteMany({}),
    prisma.tache.deleteMany({}),
    prisma.extra.deleteMany({}),
    prisma.paiement.deleteMany({}),
    prisma.projet.deleteMany({}),
    prisma.client.deleteMany({}),
  ]);

  // 2) Clients
  const clientIds: string[] = [];
  for (const c of CLIENTS) {
    const created = await prisma.client.create({ data: c });
    clientIds.push(created.id);
  }

  // 3) + 4) Projets + cédule depuis le template
  const resume: { adresse: string; ville: string; phase: string; livraison: string; etapes: number; passees: number; avancement: number; slug: string; coords: string }[] = [];

  for (let i = 0; i < PROJETS.length; i++) {
    const p = PROJETS[i];
    const cibleN = Math.round(p.cibleAvancement * nbEtapes);
    const livraison = trouverLivraison(baseEtapes, marge, cibleN, now);

    // Cédule calculée à rebours depuis la livraison (logique cedula-utils).
    const cedule = calculerDepuisLivraison(baseEtapes, livraison, marge);
    const passees = cedule.filter((e) => estPassee(e.dateFin, now)).length;
    const avancement = Math.round((passees / nbEtapes) * 100);

    const slug = buildSlug(CLIENTS[i].prenom, CLIENTS[i].nom, p.adresse);
    // dateContrat : antérieure (≤ aujourd'hui), juste avant le début des travaux.
    const premierDebut = cedule[0]?.dateDebut ?? now;
    const ancre = premierDebut.getTime() < now.getTime() ? premierDebut : now;
    const dateContrat = dayPlus(ancre, -21);

    const projet = await prisma.projet.create({
      data: {
        numero: p.numero,
        adresse: p.adresse,
        ville: p.ville,
        typeProjet: 'JUMELE',
        typeContrat: p.typeContrat,
        phase: p.phase,
        dateContrat,
        dateLivraison: livraison,
        montantTotal: p.montantTotal,
        toleranceJours: parametres?.toleranceDefautJours ?? 3,
        slug,
        urlClient: slug,
        latitude: p.latitude,
        longitude: p.longitude,
        clientId: clientIds[i],
      },
    });

    await prisma.tache.createMany({
      data: cedule.map((e) => ({
        projetId: projet.id,
        nom: e.nom,
        ordre: e.ordre,
        dateDebut: e.dateDebut,
        dateFin: e.dateFin,
        dureeJours: e.jours,
        assigneA: e.assigneA ? e.assigneA : null,
        visibleClient: e.visibleClient,
        interne: e.interne,
        buffer: 0,
      })),
    });

    await prisma.paiement.createMany({
      data: paiementsPour(p.typeContrat, p.montantTotal).map((pp) => ({ projetId: projet.id, ...pp })),
    });

    resume.push({
      adresse: `${p.adresse}, ${p.ville}`,
      ville: p.ville,
      phase: p.phase,
      livraison: livraison.toLocaleDateString('fr-CA', { day: 'numeric', month: 'long', year: 'numeric' }),
      etapes: cedule.length,
      passees,
      avancement,
      slug,
      coords: `${p.latitude}, ${p.longitude}`,
    });
  }

  // 5) Résumé
  console.log('\n=== SEED DÉMO — RÉSUMÉ ===');
  console.log(`Template JUMELE : ${nbEtapes} étapes · marge cédule : ${marge} j ouvrables`);
  console.log(`${CLIENTS.length} clients créés, ${PROJETS.length} projets créés.\n`);
  for (const r of resume) {
    console.log(`• ${r.adresse} [${r.phase}]`);
    console.log(`    livraison ${r.livraison} · cédule ${r.etapes} étapes · ${r.passees}/${r.etapes} terminées → avancement ${r.avancement}%`);
    console.log(`    slug=${r.slug} · coords=(${r.coords})`);
  }
  const tousCoords = resume.every((r) => r.coords && !r.coords.startsWith('undefined'));
  const tousSlug = resume.every((r) => !!r.slug);
  console.log(`\nCarte : ${tousCoords ? 'OK — les 4 projets ont des coordonnées.' : '⚠ coordonnées manquantes.'}`);
  console.log(`Vue client : ${tousSlug ? 'OK — les 4 projets ont un slug.' : '⚠ slug manquant.'}`);
}

main()
  .catch((e) => { console.error('ERREUR seed démo:', e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
