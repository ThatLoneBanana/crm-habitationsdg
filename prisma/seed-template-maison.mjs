// Seed idempotent et re-runnable : peuple le template MAISON en COPIANT les
// étapes du template JUMELE (copie temporaire — Jason raffinera MAISON dans
// l'éditeur quand il aura les vraies différences).
// Lancer : npm run seed:maison  (ou : node prisma/seed-template-maison.mjs)
//
// Re-runnable sans effet de bord (transaction deleteMany + createMany). Les
// étapes MAISON sont des LIGNES DISTINCTES (nouveaux IDs) → éditer MAISON
// n'affecte jamais JUMELE. Ne touche pas aux projets existants.
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Source : template JUMELE (doit être peuplé).
  const jumele = await prisma.template.findFirst({
    where: { type: 'JUMELE' },
    include: { etapes: { orderBy: { ordre: 'asc' } } },
  });
  if (!jumele || jumele.etapes.length === 0) {
    throw new Error("Template JUMELE absent ou vide — lance d'abord : npm run seed:jumele");
  }

  // Cible : template MAISON (créé s'il n'existe pas).
  let maison = await prisma.template.findFirst({ where: { type: 'MAISON' } });
  if (!maison) {
    maison = await prisma.template.create({ data: { nom: 'Maison', type: 'MAISON', actif: true } });
  }

  await prisma.$transaction(async (tx) => {
    await tx.templateEtape.deleteMany({ where: { templateId: maison.id } });
    await tx.templateEtape.createMany({
      data: jumele.etapes.map((e) => ({
        templateId: maison.id,
        nom: e.nom,
        ordre: e.ordre,
        joursDefaut: e.joursDefaut,
        assigneA: e.assigneA,
        visibleClient: e.visibleClient,
        interne: e.interne,
      })),
    });
  });

  const count = await prisma.templateEtape.count({ where: { templateId: maison.id } });
  console.log(`OK — Template MAISON (${maison.id}) = copie de JUMELE : ${count} étapes.`);
}

main()
  .catch((e) => { console.error('ERREUR seed MAISON:', e.message); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
