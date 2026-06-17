import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { geocoderAdresse } from '@/lib/geocoding';
import { calculerPhaseAutomatique } from '@/lib/phase-calculator';
import { appliquerAncrageDefaut, ensureInspectionsGCR } from '@/lib/inspection-gcr';

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
          select: { nom: true, dateDebut: true, dateFin: true },
          orderBy: { ordre: 'asc' }
        },
        extras: true,
        paiements: true,
      },
      orderBy: { dateLivraison: 'asc' },
    });

    // Mettre à jour les phases automatiquement et calculer avancement
    const projetsAvecPhasesMaj = await Promise.all(
      projets.map(async (projet: any) => {
        const nouvellePhase = calculerPhaseAutomatique(projet);
        if (nouvellePhase !== projet.phase) {
          await prisma.projet.update({
            where: { id: projet.id },
            data: { phase: nouvellePhase }
          });
          projet.phase = nouvellePhase;
        }

        // Calcul avancement réel
        const avancement = projet.taches.length > 0
          ? Math.round(
              projet.taches.filter((t: any) => {
                const fin = new Date(t.dateFin)
                fin.setHours(23, 59, 59, 999)
                return fin < new Date()
              }).length / projet.taches.length * 100
            )
          : 0

        return { ...projet, avancement }
      })
    );

    return NextResponse.json({ projets: projetsAvecPhasesMaj });
  } catch (error: any) {
    console.error('Erreur API projets:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

function removeAccents(str: string) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '');
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
  // Format : {nomclient}-{numerocivique}-{rue} (ex. catherinenadeau-47-sainte-anne).
  //  nomclient : prénom+nom collés, accents retirés, minuscule, alphanumérique.
  //  rue       : TOUS les mots de la rue (« rue », « chemin »… conservés),
  //              accents retirés, minuscule, espaces → tirets, tirets existants
  //              préservés, collapse des tirets multiples.
  const slugAccents = (str: string) => removeAccents(str).toLowerCase();
  const nomclient = slugAccents(`${prenom}${nom}`).replace(/[^a-z0-9]/g, '');
  const numAdresse = adresse.match(/^\d+/)?.[0] || '';
  const reste = adresse.replace(/^\d+\s*/, '');
  const rueClean = slugAccents(reste)
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const baseSlug = [nomclient, numAdresse, rueClean].filter(Boolean).join('-');

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
    const { clientId, adresse, ville, typeProjet, typeContrat, montantTotal, dateContrat, dateLivraison, vendeurId, chargeProjetId, urlClient, etapes, templateId } = body;

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

    // Tolérance de décalage par défaut depuis les paramètres d'entreprise
    const parametres = await prisma.parametres.findUnique({ where: { id: 'singleton' } });
    const toleranceDefaut = parametres?.toleranceDefautJours ?? 3;

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
        templateId: templateId || null,
        toleranceJours: toleranceDefaut,
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
      // Pose le marqueur d'ancrage GCR par défaut (par nom) avant création.
      const etapesAncrees = appliquerAncrageDefaut(etapes);
      const etapesToCreate = etapesAncrees.map((e: any, i: number) => ({
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
        groupeId: e.groupeId ?? null,
        ancrageInspection: e.ancrageInspection ?? null,
      }));

      await prisma.tache.createMany({
        data: etapesToCreate,
      });
    }

    // Auto-crée les inspections GCR (GYPSE + FINITION) du projet, même sans cédule.
    await ensureInspectionsGCR(projet.id);

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
