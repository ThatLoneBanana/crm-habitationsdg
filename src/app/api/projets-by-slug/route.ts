import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Route PUBLIQUE (vue client anonyme). Ne renvoie QUE des données destinées au
// client — jamais de données internes/financières sensibles (costing, taux,
// dépenses, marges, numéro, vendeur/chargé, étapes internes...).
export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get('slug');
    if (!slug) {
      return NextResponse.json({ error: 'Slug manquant' }, { status: 400 });
    }

    const projet = await prisma.projet.findUnique({
      where: { slug },
      select: {
        adresse: true,
        ville: true,
        dateLivraison: true,
        client: { select: { prenom: true, nom: true, email: true, telephone: true } },
        // Étapes VISIBLES CLIENT uniquement (les étapes internes ne doivent pas fuiter)
        taches: {
          where: { visibleClient: true },
          orderBy: { ordre: 'asc' },
          select: { id: true, nom: true, dateDebut: true, dateFin: true, visibleClient: true },
        },
        // Extras SIGNÉS uniquement (pas les EN_ATTENTE/REFUSE)
        extras: {
          where: { statut: 'SIGNE' },
          select: { id: true, description: true, montant: true, statut: true },
        },
        // Échéancier de paiements (destiné au client)
        paiements: {
          orderBy: { id: 'asc' },
          select: { id: true, description: true, montant: true, recu: true, pourcentage: true },
        },
      },
    });

    if (!projet) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 });
    }

    // Identité d'entreprise publique seulement (pied de page) — pas d'email interne, etc.
    const parametres = await prisma.parametres.findUnique({
      where: { id: 'singleton' },
      select: { nomCompagnie: true, rbq: true, siteWeb: true },
    });

    return NextResponse.json({ projet, parametres });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
