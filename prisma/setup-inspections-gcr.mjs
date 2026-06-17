// Setup unique (re-runnable, idempotent) des inspections GCR sur les projets
// EXISTANTS : pose le marqueur d'ancre par nom EXACT (« Pose gypse » → GYPSE,
// « Pose finition » → FINITION) si le type n'est pas déjà marqué, et garantit
// les inspections GYPSE + FINITION par projet.
// Lancer : node prisma/setup-inspections-gcr.mjs
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ANCRAGE_PAR_NOM = { 'Pose gypse': 'GYPSE', 'Pose finition': 'FINITION' };
const TYPES = ['GYPSE', 'FINITION'];
const nomPourType = (type) => Object.keys(ANCRAGE_PAR_NOM).find((n) => ANCRAGE_PAR_NOM[n] === type);

async function main() {
  const projets = await prisma.projet.findMany({ select: { id: true } });
  let marqueurs = 0;
  let inspections = 0;

  for (const p of projets) {
    const taches = await prisma.tache.findMany({
      where: { projetId: p.id },
      orderBy: { ordre: 'asc' },
      select: { id: true, nom: true, ancrageInspection: true },
    });

    for (const type of TYPES) {
      // Marqueur par défaut (uniquement si ce type n'est pas déjà ancré).
      if (!taches.some((t) => t.ancrageInspection === type)) {
        const cible = taches.find((t) => t.nom === nomPourType(type));
        if (cible) {
          await prisma.tache.update({ where: { id: cible.id }, data: { ancrageInspection: type } });
          marqueurs++;
        }
      }
      // Inspection garantie (idempotent).
      const existe = await prisma.inspectionGCR.findFirst({ where: { projetId: p.id, type } });
      if (!existe) {
        await prisma.inspectionGCR.create({ data: { projetId: p.id, type } });
        inspections++;
      }
    }
  }

  console.log(`OK — ${projets.length} projets traités. Marqueurs posés: ${marqueurs}. Inspections créées: ${inspections}.`);
}

main()
  .catch((e) => { console.error('ERREUR setup inspections GCR:', e.message); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
