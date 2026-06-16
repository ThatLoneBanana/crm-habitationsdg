/**
 * Seed des UTILISATEURS d'authentification (et RIEN d'autre).
 * Lancer : npm run seed:users   (ou : npx tsx prisma/seed-users.ts)
 *
 * Ce fichier ne crée QUE les 3 Users applicatifs (table User). Il ne touche
 * NI clients, NI projets, NI tâches, NI extras, NI paiements — ça, c'est le rôle
 * de seed-demo.ts. Idempotent : upsert par email (re-runnable sans doublon).
 *
 * NOTE : ces Users doivent aussi exister dans Supabase Auth (même courriel),
 * mot de passe : HabitationsDG2026!  — Supabase Auth se gère hors Prisma.
 */
import * as dotenv from 'dotenv';
import { PrismaClient, Role } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

const USERS: { email: string; prenom: string; nom: string; role: Role }[] = [
  { email: 'jason@sideways.media', prenom: 'Jason', nom: 'Dion', role: 'ADMIN' },
  { email: 'nicolas@habitations-dg.com', prenom: 'Nicolas', nom: 'Savard', role: 'ADMIN' },
  { email: 'sophierose@habitations-dg.com', prenom: 'Sophie', nom: 'Rose', role: 'COMPTABILITE' },
];

async function main() {
  console.log('🌱 Seed des utilisateurs (table User) — upsert par courriel…');
  console.log('📝 Rappel : créer les mêmes courriels dans Supabase Auth (mot de passe : HabitationsDG2026!).\n');

  for (const u of USERS) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { prenom: u.prenom, nom: u.nom, role: u.role },
      create: { email: u.email, prenom: u.prenom, nom: u.nom, role: u.role },
    });
    console.log(`✅ ${u.email} (${u.role})`);
  }

  console.log(`\nOK — ${USERS.length} utilisateurs en place.`);
}

main()
  .catch((e) => { console.error('ERREUR seed users:', e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
