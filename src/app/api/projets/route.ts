import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { geocoderAdresse } from '@/lib/geocoding';

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
        vendeur: {
          select: { id: true, prenom: true, nom: true }
        },
        chargeProjet: {
          select: { id: true, prenom: true, nom: true }
        },
        taches: {
          select: { dateDebut: true, dateFin: true }
        },
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

async function generateSlugUnique(prenom: string, nom: string, adresse: string): Promise<string> {
  const normalize = (str: string) => str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');

  const numAdresse = adresse.match(/^\d+/)?.[0] || '';
  const premierMot = adresse.replace(/^\d+\s*/, '').split(/[\s-]/)[0];
  const rueClean = normalize(premierMot);

  const baseSlug = `${normalize(prenom)}${normalize(nom)}-${numAdresse}-${rueClean}`;

  // Vérifie si le slug existe déjà
  const existing = await prisma.projet.findUnique({ where: { slug: baseSlug } });

  if (!existing) return baseSlug;

  // Si existe, ajoute un suffixe numérique
  let counter = 2;
  while (true) {
    const slugWithSuffix = `${baseSlug}-${counter}`;
    const exists = await prisma.projet.findUnique({ where: { slug: slugWithSuffix } });
    if (!exists) return slugWithSuffix;
    counter++;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, adresse, ville, typeProjet, typeContrat, montantTotal, dateContrat, dateLivraison, vendeurId, chargeProjetId, urlClient, etapes } = body;

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

    // Générer le slug unique et le numéro
    const slug = await generateSlugUnique(client.prenom, client.nom, adresse);
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
        montantTotal: parseFloat(montantTotal),
        dateContrat: dateContrat ? new Date(dateContrat) : null,
        dateLivraison: new Date(dateLivraison),
        urlClient: urlClient || null,
        vendeurId: vendeurId || null,
        chargeProjetId: chargeProjetId || null,
      },
    });

    // Géocoder l'adresse
    const coords = await geocoderAdresse(adresse, ville);
    if (coords) {
      await prisma.projet.update({
        where: { id: projet.id },
        data: { latitude: coords.lat, longitude: coords.lng }
      });
    }

    // Créer les étapes depuis le body
    if (etapes && Array.isArray(etapes) && etapes.length > 0) {
      const etapesToCreate = etapes.map((e: any, i: number) => ({
        projetId: projet.id,
        nom: e.nom,
        ordre: e.ordre || i + 1,
        dateDebut: new Date(e.dateDebut),
        dateFin: new Date(e.dateFin),
        dureeJours: e.jours || e.dureeJours || 1,
        assigneA: e.assigneA || null,
        visibleClient: e.visibleClient !== false,
        interne: e.interne || false,
        buffer: e.buffer || 0,
      }));

      await prisma.tache.createMany({
        data: etapesToCreate,
      });
    }

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

    console.log('Projet créé:', { id: projet.id, slug: projet.slug });
    return NextResponse.json({
      success: true,
      id: projet.id,
      slug: projet.slug,
      message: 'Projet créé avec succès'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Erreur création projet:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
