const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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
  console.log('🌱 Création des utilisateurs de test...');

  for (const user of users) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (existingUser) {
        await prisma.user.update({
          where: { email: user.email },
          data: user,
        });
        console.log(`✅ ${user.email} mis à jour`);
      } else {
        await prisma.user.create({ data: user });
        console.log(`✅ ${user.email} créé`);
      }
    } catch (error) {
      console.error(`❌ Erreur pour ${user.email}:`, error.message);
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

  if (clients.length > 0) {
    console.log('✅ Les projets existent déjà');
    return;
  }

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

  // Tâches
  const taches = [
    {
      projetId: projet1.id,
      nom: 'Fondations',
      ordre: 1,
      dureeJours: 7,
      statut: 'COMPLETE',
    },
    {
      projetId: projet1.id,
      nom: 'Charpente',
      ordre: 2,
      dureeJours: 10,
      statut: 'EN_COURS',
    },
    {
      projetId: projet1.id,
      nom: 'Électricité',
      ordre: 3,
      dureeJours: 5,
      statut: 'NON_COMMENCE',
      interne: true,
    },
  ];

  for (const tache of taches) {
    const dateDebut = new Date(now.getFullYear(), now.getMonth() - 1);
    await prisma.tache.create({
      data: {
        ...tache,
        dateDebut,
        dateFin: new Date(dateDebut.getTime() + tache.dureeJours * 86400000),
      },
    });
  }

  console.log('✅ Tâches créées');

  // Extras
  await prisma.extra.create({
    data: {
      projetId: projet1.id,
      description: 'Cuisine haut de gamme',
      montant: 15000,
      statut: 'SIGNE',
      fournisseur: 'Cuisines Modernes Inc.',
      signeLe: new Date(now.getFullYear(), now.getMonth() - 1),
    },
  });

  await prisma.extra.create({
    data: {
      projetId: projet1.id,
      description: 'Piscine creusée',
      montant: 45000,
      statut: 'EN_ATTENTE',
      fournisseur: 'Piscines Québec',
    },
  });

  console.log('✅ Extras créés');

  // Paiements
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
}

async function main() {
  try {
    await seedUsers();
    await seedProjects();
    console.log('\n✅ Seed complété avec succès!');
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
