import { prisma } from '../src/lib/prisma';

const users = [
  {
    email: 'jason@sideways.media',
    prenom: 'Jason',
    nom: 'Dion',
    role: 'ADMIN',
  },
  {
    email: 'nicolas@habitations-dg.com',
    prenom: 'Nicolas',
    nom: 'Savard',
    role: 'ADMIN',
  },
  {
    email: 'sophierose@habitations-dg.com',
    prenom: 'Sophie',
    nom: 'Rose',
    role: 'COMPTABILITE',
  },
];

async function seedUsers() {
  console.log('🌱 Création des utilisateurs de test dans Prisma...');
  console.log('📝 NOTE: Les utilisateurs doivent être créés dans Supabase Auth avec le mot de passe: HabitationsDG2026!\n');

  for (const user of users) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (existingUser) {
        await prisma.user.update({
          where: { email: user.email },
          data: {
            prenom: user.prenom,
            nom: user.nom,
            role: user.role as any,
          },
        });
        console.log(`✅ ${user.email} mis à jour dans Prisma`);
      } else {
        await prisma.user.create({
          data: {
            email: user.email,
            prenom: user.prenom,
            nom: user.nom,
            role: user.role as any,
          },
        });
        console.log(`✅ ${user.email} créé dans Prisma`);
      }
    } catch (error) {
      console.error(`❌ Erreur pour ${user.email}:`, error);
    }
  }
}

async function seedProjects() {
  console.log('\n🌱 Création des projets fictifs...');

  const jason = await prisma.user.findUnique({
    where: { email: 'jason@sideways.media' },
  });

  const nicolas = await prisma.user.findUnique({
    where: { email: 'nicolas@habitations-dg.com' },
  });

  const clients = await prisma.client.findMany();

  if (clients.length === 0) {
    console.log('Création des clients...');
    const client1 = await prisma.client.create({
      data: {
        nom: 'Martin',
        prenom: 'Jean-Pierre',
        email: 'jp.martin@email.com',
        telephone: '514-555-0101',
      },
    });

    const client2 = await prisma.client.create({
      data: {
        nom: 'Gauthier',
        prenom: 'Marie',
        email: 'marie.gauthier@email.com',
        telephone: '514-555-0102',
      },
    });

    console.log('✅ Clients créés');

    // Créer les projets
    const now = new Date();

    const projet1 = await prisma.projet.create({
      data: {
        numero: 'PROJ-2026-001',
        adresse: '123 rue de la Paix, Montréal',
        ville: 'Montréal',
        typeProjet: 'MAISON',
        typeContrat: 'PRELIMINAIRE',
        phase: 'CHANTIER',
        clientId: client1.id,
        vendeurId: jason?.id,
        chargeProjetId: nicolas?.id,
        dateContrat: new Date(now.getFullYear(), now.getMonth() - 2),
        dateLivraison: new Date(now.getFullYear(), now.getMonth() + 1, 15),
        toleranceJours: 3,
      },
    });

    const projet2 = await prisma.projet.create({
      data: {
        numero: 'PROJ-2026-002',
        adresse: '456 avenue du Commerce, Laval',
        ville: 'Laval',
        typeProjet: 'MULTILOGEMENT',
        typeContrat: 'ENTREPRISE',
        phase: 'PREPARATION',
        clientId: client2.id,
        vendeurId: jason?.id,
        chargeProjetId: nicolas?.id,
        dateContrat: new Date(now.getFullYear(), now.getMonth() - 1),
        dateLivraison: new Date(now.getFullYear(), now.getMonth() + 3, 1),
        toleranceJours: 5,
      },
    });

    console.log('✅ Projets créés');

    // Ajouter des tâches
    const taches1 = [
      {
        projetId: projet1.id,
        nom: 'Fondations',
        ordre: 1,
        dureeJours: 7,
        statut: 'COMPLETE' as const,
        interne: false,
      },
      {
        projetId: projet1.id,
        nom: 'Charpente',
        ordre: 2,
        dureeJours: 10,
        statut: 'EN_COURS' as const,
        interne: false,
      },
      {
        projetId: projet1.id,
        nom: 'Électricité',
        ordre: 3,
        dureeJours: 5,
        statut: 'NON_COMMENCE' as const,
        interne: true,
      },
    ];

    for (const tache of taches1) {
      const dateDebut = new Date(now.getFullYear(), now.getMonth() - 1);
      await prisma.tache.create({
        data: {
          projetId: tache.projetId,
          nom: tache.nom,
          ordre: tache.ordre,
          dureeJours: tache.dureeJours,
          statut: tache.statut,
          interne: tache.interne,
          dateDebut: new Date(dateDebut.getTime()),
          dateFin: new Date(dateDebut.getTime() + tache.dureeJours * 86400000),
        },
      });
    }

    console.log('✅ Tâches créées pour projet 1');

    // Ajouter des extras
    await prisma.extra.create({
      data: {
        projetId: projet1.id,
        description: 'Cuisine haut de gamme',
        montant: 15000,
        statut: 'SIGNE' as const,
        fournisseur: 'Cuisines Modernes Inc.',
        signeLe: new Date(now.getFullYear(), now.getMonth() - 1),
      },
    });

    await prisma.extra.create({
      data: {
        projetId: projet1.id,
        description: 'Piscine creusée',
        montant: 45000,
        statut: 'EN_ATTENTE' as const,
        fournisseur: 'Piscines Québec',
      },
    });

    console.log('✅ Extras créés');

    // Ajouter des paiements
    await prisma.paiement.create({
      data: {
        projetId: projet1.id,
        description: 'Acompte initial',
        montant: 50000,
        pourcentage: 25,
        datePrevu: new Date(now.getFullYear(), now.getMonth() - 2),
        recu: true,
        dateRecu: new Date(now.getFullYear(), now.getMonth() - 2),
      },
    });

    await prisma.paiement.create({
      data: {
        projetId: projet1.id,
        description: 'Paiement phase charpente',
        montant: 50000,
        pourcentage: 25,
        datePrevu: new Date(now.getFullYear(), now.getMonth()),
        recu: false,
      },
    });

    console.log('✅ Paiements créés');
  } else {
    console.log('✅ Les projets existent déjà');
  }
}

async function main() {
  try {
    await seedUsers();
    await seedProjects();
    console.log('\n✅ Seed complété avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
