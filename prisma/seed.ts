import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 45 étapes de la cédule JUMELE avec durées
const CEDULE_JUMELE = [
  { ordre: 1, nom: 'Plombier fond de cave', duree: 2, interne: true, visible: false },
  { ordre: 2, nom: 'Couler plancher intérieur', duree: 1, interne: true, visible: false },
  { ordre: 3, nom: 'Intérieur division', duree: 3, interne: true, visible: false },
  { ordre: 4, nom: 'Installation foyer', duree: 2, interne: true, visible: false },
  { ordre: 5, nom: 'Intérieur division', duree: 1, interne: false, visible: true },
  { ordre: 6, nom: 'Mesure armoire', duree: 1, interne: false, visible: true },
  { ordre: 7, nom: 'Air climatisé', duree: 1, interne: false, visible: true },
  { ordre: 8, nom: 'Électricien + TV & Tél', duree: 2, interne: false, visible: true },
  { ordre: 9, nom: 'Plombier', duree: 1, interne: false, visible: true },
  { ordre: 10, nom: 'Échangeur d\'air', duree: 1, interne: false, visible: true },
  { ordre: 11, nom: 'Isolation entretoit', duree: 1, interne: false, visible: true },
  { ordre: 12, nom: 'Mesure finition', duree: 1, interne: false, visible: true },
  { ordre: 13, nom: 'Final menuiserie', duree: 2, interne: false, visible: true },
  { ordre: 14, nom: 'Entrée gypse', duree: 0.5, interne: false, visible: true },
  { ordre: 15, nom: 'Pose gypse', duree: 3, interne: false, visible: true },
  { ordre: 16, nom: 'Tireur de joints', duree: 5, interne: false, visible: true },
  { ordre: 17, nom: 'Entrée finition', duree: 0.5, interne: false, visible: true },
  { ordre: 18, nom: 'Pose finition', duree: 3, interne: false, visible: true },
  { ordre: 19, nom: 'Peinture', duree: 3, interne: false, visible: true },
  { ordre: 20, nom: 'Livraison céramique', duree: 0.5, interne: false, visible: true },
  { ordre: 21, nom: 'Pose céramique', duree: 2, interne: false, visible: true },
  { ordre: 22, nom: 'Coulis', duree: 1, interne: false, visible: true },
  { ordre: 23, nom: 'Livraison armoire', duree: 1, interne: false, visible: true },
  { ordre: 24, nom: 'Pose armoire', duree: 1, interne: false, visible: true },
  { ordre: 25, nom: 'Dosseret', duree: 1, interne: false, visible: true },
  { ordre: 26, nom: 'Livraison fixture', duree: 1, interne: false, visible: true },
  { ordre: 27, nom: 'Finition électrique + TV & Tél', duree: 1, interne: false, visible: true },
  { ordre: 28, nom: 'Finition plomberie', duree: 1, interne: false, visible: true },
  { ordre: 29, nom: 'Finition échangeur d\'air', duree: 1, interne: false, visible: true },
  { ordre: 30, nom: 'Air climatisé final', duree: 1, interne: false, visible: true },
  { ordre: 31, nom: 'Installation porte de douche', duree: 1, interne: false, visible: true },
  { ordre: 32, nom: 'Pose escalier ou rampe', duree: 1, interne: false, visible: true },
  { ordre: 33, nom: 'Pose plancher', duree: 2, interne: false, visible: true },
  { ordre: 34, nom: 'Petite finition', duree: 1, interne: false, visible: true },
  { ordre: 35, nom: 'Peinture finale', duree: 2, interne: false, visible: true },
  { ordre: 36, nom: 'Pose miroir + tablettes', duree: 1, interne: false, visible: true },
  { ordre: 37, nom: 'Service +', duree: 1, interne: false, visible: true },
  { ordre: 38, nom: 'Pose tapis', duree: 1, interne: false, visible: true },
  { ordre: 39, nom: 'Ménage', duree: 1, interne: false, visible: true },
];

// Fonction pour assigner le fournisseur selon l'étape
function assignerFournisseur(nomTache: string): string | null {
  if (
    nomTache.includes('Plombier') ||
    nomTache.includes('Finition plomberie')
  ) {
    return 'Plomberie Côté';
  }
  if (
    nomTache.includes('Électricien') ||
    nomTache.includes('Finition électrique')
  ) {
    return 'Élec. Vachon';
  }
  if (
    nomTache.includes('Échangeur') ||
    nomTache.includes('Air climatisé')
  ) {
    return 'Ventil. Express';
  }
  if (
    nomTache.includes('Mesure armoire') ||
    nomTache.includes('Pose armoire') ||
    nomTache.includes('Dosseret') ||
    nomTache.includes('Livraison armoire')
  ) {
    return 'Cuisines Beauce';
  }
  if (
    nomTache.includes('Pose gypse') ||
    nomTache.includes('Entrée gypse') ||
    nomTache.includes('Tireur de joints')
  ) {
    return 'Gypse Beauce';
  }
  if (
    nomTache.includes('Pose céramique') ||
    nomTache.includes('Livraison céramique') ||
    nomTache.includes('Coulis')
  ) {
    return 'Céramique Plus';
  }
  if (
    nomTache.includes('Peinture') &&
    !nomTache.includes('Final menuiserie')
  ) {
    return 'Peinture Martin';
  }
  return null;
}

// Fonction pour calculer dates à rebours sans weekends
function calculerDatesProjet(dateLivraison: Date, cedule: any[]) {
  const dates: { ordre: number; debut: Date; fin: Date }[] = [];

  let dateActuelle = new Date(dateLivraison);
  dateActuelle.setHours(0, 0, 0, 0);

  // Reculer depuis la fin
  for (let i = cedule.length - 1; i >= 0; i--) {
    const tache = cedule[i];
    const dureeJours = tache.duree;

    // Reculer du nombre de jours (en sautant les weekends)
    // pour trouver le début de cette étape
    let joursAReculer = dureeJours;
    while (joursAReculer > 0) {
      dateActuelle.setDate(dateActuelle.getDate() - 1);
      const jour = dateActuelle.getDay();
      if (jour !== 0 && jour !== 6) { // pas dimanche (0) ni samedi (6)
        joursAReculer--;
      }
    }

    // dateActuelle est maintenant le premier jour ouvrable de cette étape
    const debut = new Date(dateActuelle);
    debut.setHours(0, 0, 0, 0);

    // La fin est dateActuelle + (dureeJours - 1) jours ouvrables
    let dateFinEtape = new Date(dateActuelle);
    let joursAAvancer = dureeJours - 1;
    while (joursAAvancer > 0) {
      dateFinEtape.setDate(dateFinEtape.getDate() + 1);
      const jour = dateFinEtape.getDay();
      if (jour !== 0 && jour !== 6) { // pas dimanche (0) ni samedi (6)
        joursAAvancer--;
      }
    }

    const fin = new Date(dateFinEtape);
    fin.setHours(23, 59, 59, 999);

    dates.unshift({ ordre: tache.ordre, debut, fin });
  }

  return dates;
}

async function main() {
  console.log('🌱 Démarrage du seed Habitations DG...');

  // Nettoyer
  await prisma.tache.deleteMany({});
  await prisma.extra.deleteMany({});
  await prisma.paiement.deleteMany({});
  await prisma.projetFournisseur.deleteMany({});
  await prisma.projet.deleteMany({});
  await prisma.fournisseur.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('✅ Base de données nettoyée');

  // Utilisateurs
  const jason = await prisma.user.create({
    data: { email: 'jason@sideways.media', nom: 'Dion', prenom: 'Jason', role: 'ADMIN', actif: true },
  });

  const nicolas = await prisma.user.create({
    data: { email: 'nicolas@habitations-dg.com', nom: 'Savard', prenom: 'Nicolas', role: 'ADMIN', actif: true },
  });

  const sophie = await prisma.user.create({
    data: { email: 'sophierose@habitations-dg.com', nom: 'Rose', prenom: 'Sophie', role: 'CHARGE_PROJET', actif: true },
  });

  const louis = await prisma.user.create({
    data: { email: 'louis@habitations-dg.com', nom: 'Bellavance', prenom: 'Louis', role: 'CHARGE_PROJET', actif: true },
  });

  console.log('✅ 4 utilisateurs créés (Louis Bellavance ajouté comme chargé par défaut)');

  // Fournisseurs
  const fournisseurs = await prisma.fournisseur.createMany({
    data: [
      { nom: 'Plomberie Côté', metier: 'Plomberie', actif: true },
      { nom: 'Élec. Vachon', metier: 'Électricité', actif: true },
      { nom: 'Ventil. Express', metier: 'Ventilation/Climatisation', actif: true },
      { nom: 'Cuisines Beauce', metier: 'Armoires de cuisine', actif: true },
      { nom: 'Gypse Beauce', metier: 'Gypse et finitions', actif: true },
      { nom: 'Céramique Plus', metier: 'Céramique', actif: true },
      { nom: 'Peinture Martin', metier: 'Peinture', actif: true },
    ],
  });

  console.log('✅ 7 fournisseurs créés');

  // Clients
  const clients = await Promise.all([
    prisma.client.create({
      data: { nom: 'Pelchat', prenom: 'Cedrick', email: 'cedrick@email.com', telephone: '418-555-1001' },
    }),
    prisma.client.create({
      data: { nom: 'Tanguay', prenom: 'Famille', email: 'tanguay@email.com', telephone: '418-555-1002' },
    }),
    prisma.client.create({
      data: { nom: 'Fortier', prenom: 'Mélanie', email: 'melanie@email.com', telephone: '418-555-1003' },
    }),
    prisma.client.create({
      data: { nom: 'Drouin', prenom: 'Patrick', email: 'patrick@email.com', telephone: '418-555-1004' },
    }),
    prisma.client.create({
      data: { nom: 'Veilleux', prenom: 'Marc-Antoine', email: 'marc-antoine@email.com', telephone: '418-555-1005' },
    }),
  ]);

  console.log('✅ 5 clients créés');

  // Générer slug unique: prenom+nom-adresse-complete (sans accents)
  const removeAccents = (str: string) => {
    return str.normalize('NFD').replace(/[̀-ͯ]/g, '');
  };

  const generateSlug = (prenom: string, nom: string, adresse: string) => {
    const prenomNom = removeAccents(`${prenom}${nom}`).toLowerCase().replace(/\s+/g, '');
    const adresseClean = removeAccents(adresse).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `${prenomNom}-${adresseClean}`;
  };

  // 5 Projets avec leurs tâches
  const projets = [
    {
      numero: 'PROJ-2026-001',
      slug: generateSlug(clients[0].prenom, clients[0].nom, '31 Anna-Dussault'),
      urlClient: generateSlug(clients[0].prenom, clients[0].nom, '31 Anna-Dussault'),
      adresse: '31 Anna-Dussault',
      ville: 'Ste-Claire',
      typeProjet: 'JUMELE' as const,
      typeContrat: 'PRELIMINAIRE' as const,
      montantTotal: 300000,
      phase: 'LIVRAISON' as const,
      dateLivraison: new Date('2026-06-25'),
      client: clients[0],
      etapesCompletes: 18,
      etapeCourante: 19,
    },
    {
      numero: 'PROJ-2026-002',
      slug: generateSlug(clients[1].prenom, clients[1].nom, '14 des Érables'),
      urlClient: generateSlug(clients[1].prenom, clients[1].nom, '14 des Érables'),
      adresse: '14 des Érables',
      ville: 'St-Joseph',
      typeProjet: 'JUMELE' as const,
      typeContrat: 'PRELIMINAIRE' as const,
      montantTotal: 320000,
      phase: 'LIVRAISON' as const,
      dateLivraison: new Date('2026-06-10'),
      client: clients[1],
      etapesCompletes: 35,
      etapeCourante: 36,
    },
    {
      numero: 'PROJ-2026-003',
      slug: generateSlug(clients[2].prenom, clients[2].nom, '8 du Boisé'),
      urlClient: generateSlug(clients[2].prenom, clients[2].nom, '8 du Boisé'),
      adresse: '8 du Boisé',
      ville: 'Ste-Marie',
      typeProjet: 'MAISON' as const,
      typeContrat: 'ENTREPRISE' as const,
      montantTotal: 280000,
      phase: 'CHANTIER' as const,
      dateLivraison: new Date('2026-07-18'),
      client: clients[2],
      etapesCompletes: 14,
      etapeCourante: 15,
    },
    {
      numero: 'PROJ-2026-004',
      slug: generateSlug(clients[3].prenom, clients[3].nom, '22 des Pins'),
      urlClient: generateSlug(clients[3].prenom, clients[3].nom, '22 des Pins'),
      adresse: '22 des Pins',
      ville: 'St-Lambert',
      typeProjet: 'JUMELE' as const,
      typeContrat: 'ENTREPRISE' as const,
      montantTotal: 350000,
      phase: 'PREPARATION' as const,
      dateLivraison: new Date('2026-08-15'),
      client: clients[3],
      etapesCompletes: 8,
      etapeCourante: 9,
    },
    {
      numero: 'PROJ-2026-005',
      slug: generateSlug(clients[4].prenom, clients[4].nom, '5 Bellevue'),
      urlClient: generateSlug(clients[4].prenom, clients[4].nom, '5 Bellevue'),
      adresse: '5 Bellevue',
      ville: 'Vallée-Jonction',
      typeProjet: 'MAISON' as const,
      typeContrat: 'PRELIMINAIRE' as const,
      montantTotal: 310000,
      phase: 'CHANTIER' as const,
      dateLivraison: new Date('2026-10-01'),
      client: clients[4],
      etapesCompletes: 5,
      etapeCourante: 6,
    },
  ];

  for (const projetData of projets) {
    // Créer le projet
    const projet = await prisma.projet.create({
      data: {
        numero: projetData.numero,
        slug: projetData.slug,
        urlClient: projetData.urlClient,
        adresse: projetData.adresse,
        ville: projetData.ville,
        typeProjet: projetData.typeProjet,
        typeContrat: projetData.typeContrat,
        montantTotal: projetData.montantTotal,
        phase: projetData.phase,
        dateLivraison: projetData.dateLivraison,
        dateContrat: new Date(projetData.dateLivraison.getTime() - 90 * 24 * 60 * 60 * 1000),
        toleranceJours: 3,
        clientId: projetData.client.id,
        vendeurId: jason.id,
        chargeProjetId: louis.id,
      },
    });

    // Calculer les dates pour les tâches
    const datesTaches = calculerDatesProjet(projetData.dateLivraison, CEDULE_JUMELE);

    // Créer les tâches
    for (let i = 0; i < CEDULE_JUMELE.length; i++) {
      const cedule = CEDULE_JUMELE[i];
      const dates = datesTaches[i];

      const statut =
        i < projetData.etapesCompletes
          ? 'COMPLETE'
          : i === projetData.etapeCourante - 1
          ? 'EN_COURS'
          : 'NON_COMMENCE';

      const fournisseur = assignerFournisseur(cedule.nom);

      await prisma.tache.create({
        data: {
          projetId: projet.id,
          nom: cedule.nom,
          description: null,
          ordre: cedule.ordre,
          dateDebut: dates.debut,
          dateFin: dates.fin,
          dureeJours: cedule.duree,
          statut,
          visibleClient: cedule.visible,
          interne: cedule.interne,
          assigneA: fournisseur,
        },
      });
    }

    // Créer les extras (2-3 par projet)
    const isLivraison = projetData.phase === 'LIVRAISON';
    const extras = [
      { description: 'Mise à niveau électrique', montant: 1500, statut: isLivraison ? 'SIGNE' as const : 'EN_ATTENTE' as const },
      { description: 'Fenêtres éco', montant: 3200, statut: 'EN_ATTENTE' as const },
    ];
    if (projetData.typeProjet === 'JUMELE') {
      extras.push({ description: 'Clôture premium', montant: 2800, statut: 'EN_ATTENTE' as const });
    }

    for (const extra of extras) {
      await prisma.extra.create({
        data: {
          projetId: projet.id,
          description: extra.description,
          montant: extra.montant,
          fournisseur: null,
          statut: extra.statut,
          signeLe: extra.statut === 'SIGNE' ? new Date() : null,
        },
      });
    }

    // Créer les paiements selon le type de contrat
    const montantTotal = projetData.montantTotal || 250000;
    const isPrelim = projetData.typeContrat === 'PRELIMINAIRE';

    if (isPrelim) {
      // CONTRAT PRÉLIMINAIRE: acompte 15000$ (reçu) + balance
      const acompte = 15000;
      const balance = montantTotal - acompte;

      // Acompte (reçu à la signature)
      await prisma.paiement.create({
        data: {
          projetId: projet.id,
          description: 'Acompte à la signature',
          montant: acompte,
          pourcentage: Math.round((acompte / montantTotal) * 100),
          recu: true,
          dateRecu: new Date(projetData.dateLivraison.getTime() - 90 * 24 * 60 * 60 * 1000),
          datePrevu: new Date(projetData.dateLivraison.getTime() - 90 * 24 * 60 * 60 * 1000),
        },
      });

      // Balance (via notaire, 2-3 semaines avant livraison)
      await prisma.paiement.create({
        data: {
          projetId: projet.id,
          description: 'Balance via notaire',
          montant: balance,
          pourcentage: Math.round((balance / montantTotal) * 100),
          recu: isLivraison,
          dateRecu: isLivraison ? new Date(projetData.dateLivraison.getTime() - 14 * 24 * 60 * 60 * 1000) : null,
          datePrevu: new Date(projetData.dateLivraison.getTime() - 14 * 24 * 60 * 60 * 1000),
        },
      });
    } else {
      // CONTRAT ENTREPRISE: 3 tranches (50/35/15%)
      const tranches = [
        { label: 'Tranche 1 - À la signature', pct: 50 },
        { label: 'Tranche 2 - À la pose gypse', pct: 35 },
        { label: 'Tranche 3 - À la remise clés', pct: 15 },
      ];

      for (let i = 0; i < tranches.length; i++) {
        const tranche = tranches[i];
        const montant = (montantTotal * tranche.pct) / 100;
        const recu = isLivraison;

        await prisma.paiement.create({
          data: {
            projetId: projet.id,
            description: tranche.label,
            montant: montant,
            pourcentage: tranche.pct,
            recu: recu,
            dateRecu: recu ? new Date() : null,
            datePrevu: new Date(projetData.dateLivraison.getTime() - (3 - i) * 30 * 24 * 60 * 60 * 1000),
          },
        });
      }
    }
  }

  console.log('✅ 5 projets avec tâches, extras et paiements créés');
  console.log('🌱 Seed terminé avec succès!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
