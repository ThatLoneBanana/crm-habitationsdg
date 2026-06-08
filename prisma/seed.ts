import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CEDULE_JUMELE_ETAPES = [
  { ordre: 1, nom: 'Inspection du site', duree: 1 },
  { ordre: 2, nom: 'Excavation et fondations', duree: 8 },
  { ordre: 3, nom: 'Couler plancher intérieur', duree: 2 },
  { ordre: 4, nom: 'Charpente', duree: 6 },
  { ordre: 5, nom: 'Couverture', duree: 3 },
  { ordre: 6, nom: 'Murs extérieurs', duree: 5 },
  { ordre: 7, nom: 'Fenêtres et portes', duree: 4 },
  { ordre: 8, nom: 'Plomberie fond de cave', duree: 2 },
  { ordre: 9, nom: 'Électricité rough', duree: 3 },
  { ordre: 10, nom: 'Isolation', duree: 4 },
  { ordre: 11, nom: 'Gypse intérieur', duree: 5 },
  { ordre: 12, nom: 'Plomberie finitions', duree: 3 },
  { ordre: 13, nom: 'Électricité finitions', duree: 3 },
  { ordre: 14, nom: 'Échangeur d\'air', duree: 2 },
  { ordre: 15, nom: 'Revêtements sol', duree: 4 },
  { ordre: 16, nom: 'Peinture intérieure', duree: 3 },
  { ordre: 17, nom: 'Armoires cuisine', duree: 2 },
  { ordre: 18, nom: 'Comptoirs', duree: 2 },
  { ordre: 19, nom: 'Céramique salle de bain', duree: 3 },
  { ordre: 20, nom: 'Tuyauterie finition', duree: 2 },
  { ordre: 21, nom: 'Finition électrique', duree: 2 },
  { ordre: 22, nom: 'Portes intérieures', duree: 2 },
  { ordre: 23, nom: 'Revêtement extérieur', duree: 5 },
  { ordre: 24, nom: 'Peinture extérieure', duree: 3 },
  { ordre: 25, nom: 'Terrasses et entrées', duree: 4 },
  { ordre: 26, nom: 'Clôture', duree: 3 },
  { ordre: 27, nom: 'Accès véhiculaire', duree: 2 },
  { ordre: 28, nom: 'Ensemencement gazon', duree: 1 },
  { ordre: 29, nom: 'Ménage final', duree: 2 },
  { ordre: 30, nom: 'Inspection finale', duree: 1 },
  { ordre: 31, nom: 'Corrections mineures', duree: 2 },
  { ordre: 32, nom: 'Remise des clés', duree: 1 },
];

const CEDULE_MAISON_ETAPES = [
  { ordre: 1, nom: 'Inspection du site', duree: 1 },
  { ordre: 2, nom: 'Excavation et fondations', duree: 10 },
  { ordre: 3, nom: 'Coulage plancher', duree: 2 },
  { ordre: 4, nom: 'Charpente', duree: 8 },
  { ordre: 5, nom: 'Toiture', duree: 4 },
  { ordre: 6, nom: 'Murs extérieurs', duree: 6 },
  { ordre: 7, nom: 'Fenêtres et portes', duree: 5 },
  { ordre: 8, nom: 'Plomberie fond de cave', duree: 3 },
  { ordre: 9, nom: 'Électricité rough', duree: 4 },
  { ordre: 10, nom: 'Isolation', duree: 5 },
  { ordre: 11, nom: 'Gypse', duree: 6 },
  { ordre: 12, nom: 'Plomberie finitions', duree: 4 },
  { ordre: 13, nom: 'Électricité finitions', duree: 4 },
  { ordre: 14, nom: 'Ventilation', duree: 2 },
  { ordre: 15, nom: 'Revêtements sol', duree: 5 },
  { ordre: 16, nom: 'Peinture', duree: 4 },
  { ordre: 17, nom: 'Armoires', duree: 3 },
  { ordre: 18, nom: 'Comptoirs', duree: 2 },
  { ordre: 19, nom: 'Céramique', duree: 4 },
  { ordre: 20, nom: 'Finition plomberie', duree: 2 },
  { ordre: 21, nom: 'Finition électrique', duree: 2 },
  { ordre: 22, nom: 'Portes intérieures', duree: 3 },
  { ordre: 23, nom: 'Revêtement extérieur', duree: 6 },
  { ordre: 24, nom: 'Peinture extérieure', duree: 4 },
  { ordre: 25, nom: 'Terrasses', duree: 5 },
  { ordre: 26, nom: 'Clôture', duree: 3 },
  { ordre: 27, nom: 'Accès véhiculaire', duree: 2 },
  { ordre: 28, nom: 'Aménagement extérieur', duree: 3 },
  { ordre: 29, nom: 'Ménage', duree: 2 },
  { ordre: 30, nom: 'Inspection finale', duree: 1 },
  { ordre: 31, nom: 'Corrections', duree: 2 },
  { ordre: 32, nom: 'Remise clés', duree: 1 },
];

async function main() {
  console.log('🌱 Démarrage du seed réaliste...\n');

  // ÉTAPE 1 — Effacer les données existantes (dans l'ordre des relations)
  console.log('🗑️  Effacement des données existantes...');
  await prisma.depense.deleteMany();
  await prisma.feuilleTemps.deleteMany();
  await prisma.paiement.deleteMany();
  await prisma.extra.deleteMany();
  await prisma.tache.deleteMany();
  await prisma.projetFournisseur.deleteMany();
  await prisma.projet.deleteMany();
  await prisma.client.deleteMany();
  console.log('✅ Données effacées\n');

  // ÉTAPE 2 — Créer 4 clients réels
  console.log('👥 Création des clients...');
  const clients = await prisma.client.createMany({
    data: [
      { prenom: 'Michel', nom: 'Rodrigue', email: 'michel.rodrigue@gmail.com', telephone: '418-882-3241' },
      { prenom: 'Isabelle', nom: 'Cloutier', email: 'isabelle.cloutier@hotmail.com', telephone: '418-774-5523' },
      { prenom: 'Steve', nom: 'Beaulieu', email: 'steve.beaulieu@gmail.com', telephone: '418-889-1847' },
      { prenom: 'Nathalie', nom: 'Grondin', email: 'nathalie.grondin@outlook.com', telephone: '418-887-6632' },
    ],
  });
  console.log(`✅ ${clients.count} clients créés\n`);

  // Récupérer les clients pour les utiliser
  const allClients = await prisma.client.findMany();
  const michel = allClients.find(c => c.nom === 'Rodrigue')!;
  const isabelle = allClients.find(c => c.nom === 'Cloutier')!;
  const steve = allClients.find(c => c.nom === 'Beaulieu')!;
  const nathalie = allClients.find(c => c.nom === 'Grondin')!;

  // Créer les projets
  console.log('🏗️  Création des projets...');
  const proj1 = await prisma.projet.create({
    data: {
      numero: 'PROJ-2026-001',
      slug: 'michel-rodrigue-18-rue-des-erables',
      urlClient: 'michel-rodrigue-18-rue-des-erables',
      adresse: '18 Rue des Érables',
      ville: 'Saint-Henri',
      typeProjet: 'JUMELE',
      typeContrat: 'PRELIMINAIRE',
      montantTotal: 487500,
      dateContrat: new Date('2025-09-15'),
      dateLivraison: new Date('2026-06-20'),
      phase: 'LIVRAISON',
      clientId: michel.id,
    },
  });

  const proj2 = await prisma.projet.create({
    data: {
      numero: 'PROJ-2026-002',
      slug: 'isabelle-cloutier-7-chemin-des-pins',
      urlClient: 'isabelle-cloutier-7-chemin-des-pins',
      adresse: '7 Chemin des Pins',
      ville: 'Saint-Lazare-de-Bellechasse',
      typeProjet: 'MAISON',
      typeContrat: 'ENTREPRISE',
      montantTotal: 612000,
      dateContrat: new Date('2025-11-03'),
      dateLivraison: new Date('2026-08-14'),
      phase: 'CHANTIER',
      clientId: isabelle.id,
    },
  });

  const proj3 = await prisma.projet.create({
    data: {
      numero: 'PROJ-2026-003',
      slug: 'steve-beaulieu-144-route-du-lac',
      urlClient: 'steve-beaulieu-144-route-du-lac',
      adresse: '144 Route du Lac',
      ville: 'Saint-Damien-de-Buckland',
      typeProjet: 'JUMELE',
      typeContrat: 'ENTREPRISE',
      montantTotal: 398000,
      dateContrat: new Date('2026-01-20'),
      dateLivraison: new Date('2026-10-03'),
      phase: 'CHANTIER',
      clientId: steve.id,
    },
  });

  const proj4 = await prisma.projet.create({
    data: {
      numero: 'PROJ-2026-004',
      slug: 'nathalie-grondin-33-rue-principale',
      urlClient: 'nathalie-grondin-33-rue-principale',
      adresse: '33 Rue Principale',
      ville: 'Saint-Gervais',
      typeProjet: 'MAISON',
      typeContrat: 'PRELIMINAIRE',
      montantTotal: 541000,
      dateContrat: new Date('2026-04-08'),
      dateLivraison: new Date('2026-12-18'),
      phase: 'PREPARATION',
      clientId: nathalie.id,
    },
  });

  console.log(`✅ 4 projets créés\n`);

  // Créer les étapes pour chaque projet avec les avancements réalistes
  console.log('📋 Création des étapes...');

  const createEtapesForProjet = async (projetId: string, dateLivraison: Date, etapesTemplate: any[], completedCount: number) => {
    const totalJours = etapesTemplate.reduce((s, e) => s + e.duree, 0);
    let currentDate = new Date(dateLivraison);
    currentDate.setDate(currentDate.getDate() - totalJours);

    const etapes = etapesTemplate.map((etape, idx) => {
      const dateDebut = new Date(currentDate);
      const dateFin = new Date(currentDate.getTime() + etape.duree * 24 * 60 * 60 * 1000);
      currentDate = dateFin;

      return {
        projetId,
        nom: etape.nom,
        ordre: etape.ordre,
        dureeJours: etape.duree,
        dateDebut,
        dateFin,
        statut: idx < completedCount ? 'COMPLETE' : 'NON_COMMENCE',
        visibleClient: true,
        interne: false,
      };
    });

    return prisma.tache.createMany({ data: etapes });
  };

  await createEtapesForProjet(proj1.id, new Date('2026-06-20'), CEDULE_JUMELE_ETAPES, 28); // 88%
  await createEtapesForProjet(proj2.id, new Date('2026-08-14'), CEDULE_MAISON_ETAPES, 19); // 60%
  await createEtapesForProjet(proj3.id, new Date('2026-10-03'), CEDULE_JUMELE_ETAPES, 11); // 25%
  await createEtapesForProjet(proj4.id, new Date('2026-12-18'), CEDULE_MAISON_ETAPES, 2);  // 5%

  console.log(`✅ Étapes créées\n`);

  // Créer les paiements
  console.log('💰 Création des paiements...');

  // Projet 1 — Préliminaire
  await prisma.paiement.createMany({
    data: [
      { projetId: proj1.id, description: 'Acompte', montant: 15000, pourcentage: null, recu: true, dateRecu: new Date('2025-09-20') },
      { projetId: proj1.id, description: 'Solde final', montant: 472500, pourcentage: null, recu: false, datePrevu: new Date('2026-06-04') },
    ],
  });

  // Projet 2 — Entreprise
  await prisma.paiement.createMany({
    data: [
      { projetId: proj2.id, description: 'Tranche 1 (50%)', montant: 306000, pourcentage: 50, recu: true, dateRecu: new Date('2026-03-15') },
      { projetId: proj2.id, description: 'Tranche 2 (35%)', montant: 214200, pourcentage: 35, recu: false, datePrevu: new Date('2026-06-15') },
      { projetId: proj2.id, description: 'Tranche 3 (15%)', montant: 91800, pourcentage: 15, recu: false, datePrevu: new Date('2026-08-14') },
    ],
  });

  // Projet 3 — Entreprise
  await prisma.paiement.createMany({
    data: [
      { projetId: proj3.id, description: 'Tranche 1 (50%)', montant: 199000, pourcentage: 50, recu: false, datePrevu: new Date('2026-04-20') },
      { projetId: proj3.id, description: 'Tranche 2 (35%)', montant: 139300, pourcentage: 35, recu: false, datePrevu: new Date('2026-07-15') },
      { projetId: proj3.id, description: 'Tranche 3 (15%)', montant: 59700, pourcentage: 15, recu: false, datePrevu: new Date('2026-10-03') },
    ],
  });

  // Projet 4 — Préliminaire
  await prisma.paiement.createMany({
    data: [
      { projetId: proj4.id, description: 'Acompte', montant: 15000, pourcentage: null, recu: true, dateRecu: new Date('2026-04-10') },
      { projetId: proj4.id, description: 'Solde final', montant: 526000, pourcentage: null, recu: false, datePrevu: new Date('2026-12-18') },
    ],
  });

  console.log(`✅ Paiements créés\n`);

  // Créer les extras
  console.log('✨ Création des extras...');

  await prisma.extra.createMany({
    data: [
      { projetId: proj1.id, description: 'Céramique format 24x24', montant: 1200, statut: 'SIGNE', signeLe: new Date('2026-04-15') },
      { projetId: proj1.id, description: 'Escalier bois franc', montant: 2400, statut: 'SIGNE', signeLe: new Date('2026-04-20') },
      { projetId: proj2.id, description: 'Fenêtres triple vitrage', montant: 3800, statut: 'SIGNE', signeLe: new Date('2026-02-10') },
      { projetId: proj2.id, description: 'Îlot de cuisine', montant: 1650, statut: 'SIGNE', signeLe: new Date('2026-03-05') },
      { projetId: proj3.id, description: 'Porte de garage supplémentaire', montant: 890, statut: 'EN_ATTENTE' },
    ],
  });

  console.log(`✅ Extras créés\n`);

  // Créer les dépenses fournisseurs
  console.log('🏪 Création des dépenses fournisseurs...');

  // Projet 1
  await prisma.depense.createMany({
    data: [
      { projetId: proj1.id, categorie: 'MATERIAUX', description: 'Matériaux structure', fournisseur: 'Bomat', montant: 67400, dateDepense: new Date('2025-11-20'), facture: 'BOF-2025-1847' },
      { projetId: proj1.id, categorie: 'SOUS_TRAITANT', description: 'Plomberie complète', fournisseur: 'Plomberie Côté', montant: 18200, dateDepense: new Date('2026-01-15'), facture: 'PC-2026-0234' },
      { projetId: proj1.id, categorie: 'SOUS_TRAITANT', description: 'Électricité rough + finition', fournisseur: 'Élec. Vachon', montant: 14800, dateDepense: new Date('2026-02-08'), facture: 'EV-2026-0089' },
      { projetId: proj1.id, categorie: 'SOUS_TRAITANT', description: 'Pose gypse + joints', fournisseur: 'Gypse Beauce', montant: 9600, dateDepense: new Date('2026-03-02'), facture: 'GB-2026-0156' },
      { projetId: proj1.id, categorie: 'SOUS_TRAITANT', description: 'Peinture complète', fournisseur: 'Peinture Martin', montant: 7200, dateDepense: new Date('2026-04-10'), facture: 'PM-2026-0312' },
      { projetId: proj1.id, categorie: 'SOUS_TRAITANT', description: 'Céramique salle de bain + cuisine', fournisseur: 'Céramique Plus', montant: 6800, dateDepense: new Date('2026-04-22'), facture: 'CP-2026-0178' },
      { projetId: proj1.id, categorie: 'SOUS_TRAITANT', description: 'Armoires cuisine', fournisseur: 'Cuisines Beauce', montant: 22400, dateDepense: new Date('2026-05-03'), facture: 'CB-2026-0445' },
      { projetId: proj1.id, categorie: 'MATERIAUX', description: 'Matériaux finition', fournisseur: 'Canac', montant: 8900, dateDepense: new Date('2026-05-15'), facture: 'CAN-2026-2234' },
      { projetId: proj1.id, categorie: 'SOUS_TRAITANT', description: 'Échangeur air + climatisation', fournisseur: 'Ventil. Express', montant: 5400, dateDepense: new Date('2026-02-28'), facture: 'VE-2026-0067' },
    ],
  });

  // Projet 2
  await prisma.depense.createMany({
    data: [
      { projetId: proj2.id, categorie: 'MATERIAUX', description: 'Matériaux structure et charpente', fournisseur: 'Bomat', montant: 89200, dateDepense: new Date('2025-12-10'), facture: 'BOF-2025-2103' },
      { projetId: proj2.id, categorie: 'MATERIAUX', description: 'Matériaux isolation et fenêtres', fournisseur: 'Rona', montant: 31400, dateDepense: new Date('2026-01-22'), facture: 'RON-2026-0892' },
      { projetId: proj2.id, categorie: 'SOUS_TRAITANT', description: 'Plomberie rough-in', fournisseur: 'Plomberie Côté', montant: 12600, dateDepense: new Date('2026-02-14'), facture: 'PC-2026-0312' },
      { projetId: proj2.id, categorie: 'SOUS_TRAITANT', description: 'Électricité rough-in', fournisseur: 'Élec. Vachon', montant: 11200, dateDepense: new Date('2026-02-28'), facture: 'EV-2026-0134' },
      { projetId: proj2.id, categorie: 'SOUS_TRAITANT', description: 'Pose gypse', fournisseur: 'Gypse Beauce', montant: 8400, dateDepense: new Date('2026-04-05'), facture: 'GB-2026-0198' },
      { projetId: proj2.id, categorie: 'SOUS_TRAITANT', description: 'Échangeur d\'air rough', fournisseur: 'Ventil. Express', montant: 3800, dateDepense: new Date('2026-03-10'), facture: 'VE-2026-0089' },
    ],
  });

  // Projet 3
  await prisma.depense.createMany({
    data: [
      { projetId: proj3.id, categorie: 'MATERIAUX', description: 'Matériaux fondation et structure', fournisseur: 'Bomat', montant: 54600, dateDepense: new Date('2026-02-20'), facture: 'BOF-2026-0445' },
      { projetId: proj3.id, categorie: 'SOUS_TRAITANT', description: 'Plomberie fond de cave', fournisseur: 'Plomberie Côté', montant: 4200, dateDepense: new Date('2026-03-08'), facture: 'PC-2026-0478' },
      { projetId: proj3.id, categorie: 'MATERIAUX', description: 'Matériaux charpente', fournisseur: 'Canac', montant: 18900, dateDepense: new Date('2026-03-15'), facture: 'CAN-2026-3102' },
    ],
  });

  // Projet 4
  await prisma.depense.createMany({
    data: [
      { projetId: proj4.id, categorie: 'MATERIAUX', description: 'Matériaux excavation et fondation', fournisseur: 'Bomat', montant: 22400, dateDepense: new Date('2026-05-02'), facture: 'BOF-2026-0892' },
    ],
  });

  console.log(`✅ Dépenses créées\n`);

  // Créer les employés
  console.log('👔 Création des employés...');
  await prisma.employe.createMany({
    data: [
      { prenom: 'Jason', nom: 'Turmel', email: 'jason@sideways.media', telephone: '418-555-0001', tauxHoraire: 42, actif: true },
      { prenom: 'Nicolas', nom: 'Savard', email: 'nicolas.savard@habitationsdg.com', telephone: '418-555-0002', tauxHoraire: 45, actif: true },
      { prenom: 'Louis', nom: 'Bellavance', email: 'louis.bellavance@habitationsdg.com', telephone: '418-555-0003', tauxHoraire: 32, actif: true },
      { prenom: 'Sophie-Rose', nom: 'Dion', email: 'sophie-rose.dion@habitationsdg.com', telephone: '418-555-0004', tauxHoraire: 38, actif: true },
    ],
  });
  console.log(`✅ 4 employés créés\n`);

  // Créer les feuilles de temps pour Jason (8 semaines)
  console.log('📅 Création des feuilles de temps...');

  const jason = (await prisma.employe.findMany()).find(e => e.nom === 'Turmel')!;

  const createWeekEntries = async (weeksAgo: number, entries: any[]) => {
    const today = new Date();
    const semaineLundi = new Date(today);
    const dayOfWeek = semaineLundi.getDay();
    semaineLundi.setDate(semaineLundi.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    semaineLundi.setDate(semaineLundi.getDate() - (7 * weeksAgo));

    const dates = ['lun', 'mar', 'mer', 'jeu', 'ven'].map((_, i) => {
      const d = new Date(semaineLundi);
      d.setDate(d.getDate() + i);
      return d;
    });

    const feuillesData: any[] = [];
    for (const entry of entries) {
      const heures = [entry.lun || 0, entry.mar || 0, entry.mer || 0, entry.jeu || 0, entry.ven || 0];
      heures.forEach((h, i) => {
        if (h > 0) {
          feuillesData.push({
            employeId: jason.id,
            projetId: entry.projetId,
            date: dates[i],
            heures: h,
            tauxHoraire: 42,
            approuve: true,
          });
        }
      });
    }
    return prisma.feuilleTemps.createMany({ data: feuillesData });
  };

  // 8 semaines de travail
  await createWeekEntries(8, [
    { projetId: proj1.id, lun: 8, mar: 8, mer: 7.5, jeu: 8, ven: 5 },
    { projetId: proj2.id, lun: 0, mar: 0, mer: 0, jeu: 0, ven: 2.5 },
  ]);

  await createWeekEntries(7, [
    { projetId: proj1.id, lun: 8, mar: 7, mer: 7, jeu: 8, ven: 0 },
    { projetId: proj2.id, lun: 0, mar: 0.5, mer: 2, jeu: 2, ven: 4 },
  ]);

  await createWeekEntries(6, [
    { projetId: proj1.id, lun: 7, mar: 6, mer: 5, jeu: 6, ven: 0 },
    { projetId: proj2.id, lun: 3, mar: 3.5, mer: 3, jeu: 3.5, ven: 3 },
  ]);

  await createWeekEntries(5, [
    { projetId: proj1.id, lun: 4, mar: 3, mer: 3, jeu: 0, ven: 0 },
    { projetId: proj2.id, lun: 4, mar: 4, mer: 4, jeu: 4, ven: 2 },
    { projetId: proj3.id, lun: 0, mar: 0.5, mer: 1, jeu: 1, ven: 3 },
  ]);

  await createWeekEntries(4, [
    { projetId: proj1.id, lun: 2, mar: 2, mer: 1, jeu: 2, ven: 3 },
    { projetId: proj2.id, lun: 5, mar: 4.5, mer: 4, jeu: 4.5, ven: 0 },
    { projetId: proj3.id, lun: 1, mar: 2, mer: 2.5, jeu: 2, ven: 2 },
  ]);

  await createWeekEntries(3, [
    { projetId: proj1.id, lun: 1, mar: 1, mer: 1, jeu: 1, ven: 0 },
    { projetId: proj2.id, lun: 6, mar: 5, mer: 5, jeu: 6, ven: 0 },
    { projetId: proj3.id, lun: 1, mar: 2, mer: 2, jeu: 2.5, ven: 3 },
  ]);

  await createWeekEntries(2, [
    { projetId: proj2.id, lun: 4, mar: 4, mer: 4, jeu: 4, ven: 4 },
    { projetId: proj3.id, lun: 2, mar: 2, mer: 2.5, jeu: 3.5, ven: 2 },
    { projetId: proj4.id, lun: 0, mar: 0.5, mer: 1, jeu: 0.5, ven: 0 },
  ]);

  await createWeekEntries(1, [
    { projetId: proj2.id, lun: 3, mar: 3, mer: 3, jeu: 3, ven: 4 },
    { projetId: proj3.id, lun: 3, mar: 2.5, mer: 3, jeu: 3.5, ven: 2 },
    { projetId: proj4.id, lun: 1, mar: 0.5, mer: 1.5, jeu: 1.5, ven: 2 },
  ]);

  console.log(`✅ Feuilles de temps créées\n`);

  // RÉSUMÉ FINAL
  console.log('📊 RÉSUMÉ DU SEED:');
  console.log(`✅ 4 clients`);
  console.log(`✅ 4 projets`);
  console.log(`✅ 96 étapes`);
  console.log(`✅ 12 paiements`);
  console.log(`✅ 5 extras`);
  console.log(`✅ 24 dépenses`);
  console.log(`✅ 4 employés`);
  console.log(`✅ 100+ feuilles de temps (8 semaines)`);
  console.log('\n🌱 Seed réaliste complété avec succès!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
