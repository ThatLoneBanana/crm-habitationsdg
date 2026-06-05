import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phase = searchParams.get('phase');
    const search = searchParams.get('search');
    const urlClient = searchParams.get('urlClient');

    const where: any = {};

    // Si urlClient est fourni, chercher par slug
    if (urlClient) {
      where.urlClient = urlClient;
    }

    if (phase && phase !== 'TOUS') {
      where.phase = phase;
    }

    if (search) {
      where.OR = [
        { numero: { contains: search, mode: 'insensitive' } },
        { adresse: { contains: search, mode: 'insensitive' } },
        { client: { nom: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const projets = await prisma.projet.findMany({
      where,
      include: {
        client: true,
        vendeur: true,
        chargeProjet: true,
        taches: true,
        extras: true,
        paiements: true,
      },
      orderBy: { dateLivraison: 'asc' },
    });

    return NextResponse.json({ projets });
  } catch (error: any) {
    console.error('Erreur API projets:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

const ETAPES_TEMPLATE = [
  { nom: 'Inspection du site', dureeJours: 1 },
  { nom: 'Fondations', dureeJours: 10 },
  { nom: 'Charpente', dureeJours: 8 },
  { nom: 'Couverture', dureeJours: 3 },
  { nom: 'Murs extérieurs', dureeJours: 7 },
  { nom: 'Fenêtres et portes', dureeJours: 5 },
  { nom: 'Plomberie brute', dureeJours: 6 },
  { nom: 'Électricité brute', dureeJours: 6 },
  { nom: 'Isolation', dureeJours: 5 },
  { nom: 'Gypse intérieur', dureeJours: 8 },
  { nom: 'Plomberie finitions', dureeJours: 5 },
  { nom: 'Électricité finitions', dureeJours: 5 },
  { nom: 'Revêtements sol', dureeJours: 6 },
  { nom: 'Murs intérieurs', dureeJours: 7 },
  { nom: 'Peinture intérieure', dureeJours: 5 },
  { nom: 'Portes intérieures', dureeJours: 3 },
  { nom: 'Armoires cuisine', dureeJours: 3 },
  { nom: 'Comptoirs cuisine', dureeJours: 2 },
  { nom: 'Finitions salles de bain', dureeJours: 4 },
  { nom: 'Installation luminaires', dureeJours: 2 },
  { nom: 'Installation robinetterie', dureeJours: 2 },
  { nom: 'Revêtement extérieur', dureeJours: 8 },
  { nom: 'Peinture extérieure', dureeJours: 3 },
  { nom: 'Terrasses et entrées', dureeJours: 5 },
  { nom: 'Aménagement extérieur', dureeJours: 4 },
  { nom: 'Clôture', dureeJours: 3 },
  { nom: 'Accès véhiculaire', dureeJours: 2 },
  { nom: 'Ensemencement gazon', dureeJours: 1 },
  { nom: 'Nettoyage final', dureeJours: 2 },
  { nom: 'Inspection finale', dureeJours: 1 },
  { nom: 'Corrections mineures', dureeJours: 2 },
  { nom: 'Signature final', dureeJours: 1 },
  { nom: 'Remise des clés', dureeJours: 1 },
];

function removeAccents(str: string) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function generateSlug(prenom: string, nom: string, adresse: string) {
  const cleanPrenom = removeAccents(prenom).toLowerCase().replace(/\s+/g, '');
  const cleanNom = removeAccents(nom).toLowerCase().replace(/\s+/g, '');
  const cleanAdresse = removeAccents(adresse).toLowerCase().replace(/\s+/g, '-');
  return `${cleanPrenom}${cleanNom}-${cleanAdresse}`;
}

function calculateWorkingDays(startDate: Date, endDate: Date) {
  let count = 0;
  let current = new Date(startDate);
  current.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}

function subtractWorkingDays(date: Date, daysToSubtract: number) {
  let count = 0;
  let current = new Date(date);
  current.setHours(0, 0, 0, 0);

  while (count < daysToSubtract) {
    current.setDate(current.getDate() - 1);
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
  }
  return new Date(current);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, adresse, ville, typeProjet, typeContrat, montantTotal, dateLivraison, vendeur } = body;

    if (!clientId || !adresse || !ville || !dateLivraison || !montantTotal) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Récupérer le client pour le slug
    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client) {
      return NextResponse.json({ error: 'Client non trouvé' }, { status: 404 });
    }

    // Générer le slug et le numéro
    const slug = generateSlug(client.prenom, client.nom, adresse);
    const numero = `PRJ-${Date.now().toString().slice(-6)}`;

    // Créer le projet
    const projet = await prisma.projet.create({
      data: {
        numero,
        clientId,
        slug,
        adresse,
        ville,
        typeProjet,
        typeContrat,
        phase: 'SIGNE',
        dateLivraison: new Date(dateLivraison),
        vendeurId: null,
      },
    });

    // Calculer les dates des étapes (à rebours)
    const livraison = new Date(dateLivraison);
    let currentDate = new Date(livraison);

    // Ajouter les étapes en ordre inverse
    const etapesToCreate = [];
    for (let i = ETAPES_TEMPLATE.length - 1; i >= 0; i--) {
      const template = ETAPES_TEMPLATE[i];
      const debut = subtractWorkingDays(currentDate, template.dureeJours - 1);
      const fin = new Date(currentDate);

      etapesToCreate.unshift({
        projetId: projet.id,
        nom: template.nom,
        ordre: i + 1,
        dateDebut: debut,
        dateFin: fin,
        dureeJours: template.dureeJours,
        statut: 'NON_COMMENCE',
        visibleClient: false,
        interne: false,
      });

      currentDate = new Date(debut);
      currentDate.setDate(currentDate.getDate() - 1);
    }

    // Créer les étapes
    await prisma.tache.createMany({
      data: etapesToCreate,
    });

    // Créer les paiements selon le type de contrat
    if (typeContrat === 'PRELIMINAIRE') {
      // Acompte 15k + solde
      await prisma.paiement.createMany({
        data: [
          {
            projetId: projet.id,
            description: 'Acompte',
            montant: 15000,
            pourcentage: null,
            recu: false,
          },
          {
            projetId: projet.id,
            description: 'Solde final',
            montant: montantTotal - 15000,
            pourcentage: null,
            recu: false,
          },
        ],
      });
    } else if (typeContrat === 'ENTREPRISE') {
      // 3 tranches: 50%, 35%, 15%
      await prisma.paiement.createMany({
        data: [
          {
            projetId: projet.id,
            description: 'Tranche 1 (50%)',
            montant: montantTotal * 0.5,
            pourcentage: 50,
            recu: false,
          },
          {
            projetId: projet.id,
            description: 'Tranche 2 (35%)',
            montant: montantTotal * 0.35,
            pourcentage: 35,
            recu: false,
          },
          {
            projetId: projet.id,
            description: 'Tranche 3 (15%)',
            montant: montantTotal * 0.15,
            pourcentage: 15,
            recu: false,
          },
        ],
      });
    }

    return NextResponse.json({ projet }, { status: 201 });
  } catch (error: any) {
    console.error('Erreur création projet:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
