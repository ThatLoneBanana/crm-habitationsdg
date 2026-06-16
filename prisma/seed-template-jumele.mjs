// Seed idempotent et re-runnable : remplace les étapes du template JUMELE par la
// cédule officielle (38 étapes). Lancer : npm run seed:jumele
// (ou : node prisma/seed-template-jumele.mjs — charge .env via dotenv).
// Re-runnable sans effet de bord : on supprime puis recrée les étapes (transaction).
// Ne touche pas aux projets existants (TemplateEtape = définition du gabarit).
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Séquence officielle — [nom, joursDefaut]. ordre = position (1..n).
// assigneA vide, visibleClient = true, interne = false par défaut (Jason ajuste
// les corps de métier, les préalables internes et la visibilité dans l'éditeur).
// Doublons voulus : « Intérieur division » (3 & 5), « Air climatisé » (7 & 29).
const ETAPES = [
  ['Plombier fond de cave', 1],
  ['Couler plancher', 1],
  ['Intérieur division', 1],
  ['Installation foyer', 1],
  ['Intérieur division', 1],
  ['Mesure armoire', 1],
  ['Air climatisé', 1],
  ['Électricien + T.V. & Tél', 1],
  ['Plombier', 1],
  ["Échangeur d'air", 1],
  ['Isolation entretoit', 1],
  ['Mesure finition', 1],
  ['Final menuiserie', 1],
  ['Entrée gypse', 1],
  ['Pose gypse', 2],
  ['Tireur de joints', 5],
  ['Entrée finition', 1],
  ['Pose finition', 2],
  ['Peinture', 2],
  ['Livraison céramique', 1],
  ['Pose céramique', 2],
  ['Coulis', 1],
  ['Livraison armoire', 1],
  ['Pose armoire / Dosseret', 1],
  ['Livraison fixture', 1],
  ['Finition électrique + T.V. & Tél', 1],
  ['Finition plomberie', 1],
  ["Finition échangeur d'air", 1],
  ['Air climatisé', 1],
  ['Installation porte de douche', 1],
  ['Pose escalier ou rampe', 2],
  ['Pose plancher', 2],
  ['Petite finition', 1],
  ['Peinture finale', 2],
  ['Pose miroir + tablettes', 1],
  ['Service +', 1],
  ['Pose tapis', 1],
  ['Ménage', 1],
];

async function main() {
  const template = await prisma.template.findFirst({ where: { type: 'JUMELE' } });
  if (!template) {
    throw new Error("Aucun template de type JUMELE en DB — impossible de le peupler.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.templateEtape.deleteMany({ where: { templateId: template.id } });
    await tx.templateEtape.createMany({
      data: ETAPES.map(([nom, joursDefaut], i) => ({
        templateId: template.id,
        nom,
        ordre: i + 1,
        joursDefaut,
        assigneA: null,
        visibleClient: true,
        interne: false,
      })),
    });
  });

  const count = await prisma.templateEtape.count({ where: { templateId: template.id } });
  console.log(`OK — Template JUMELE (${template.id}) peuplé : ${count} étapes.`);
}

main()
  .catch((e) => { console.error('ERREUR seed JUMELE:', e.message); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
