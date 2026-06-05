import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Note: Cette route était déjà implémentée correctement avec de vraies requêtes Prisma

export async function GET() {
  try {
    const now = new Date();
    const dans30jours = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Projets actifs (non terminés)
    const projetsActifs = await prisma.projet.count({
      where: {
        phase: { not: 'TERMINE' },
      },
    });

    // Livraisons dans les 30 prochains jours
    const livraisons30j = await prisma.projet.count({
      where: {
        dateLivraison: {
          gte: now,
          lte: dans30jours,
        },
      },
    });

    // Alertes: livraison dans moins de 14 jours
    const dans14jours = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const alertes = await prisma.projet.count({
      where: {
        dateLivraison: {
          gte: now,
          lt: dans14jours,
        },
      },
    });

    // Extras non signés
    const extrasNonSignes = await prisma.extra.count({
      where: {
        statut: 'EN_ATTENTE',
      },
    });

    // Tâches à commencer (date début > aujourd'hui)
    const gcrAPlanifier = await prisma.tache.count({
      where: {
        dateDebut: {
          gt: now,
        },
      },
    });

    return NextResponse.json({
      projetsActifs,
      livraisons30j,
      alertes,
      extrasNonSignes,
      gcrAPlanifier,
    });
  } catch (error: any) {
    console.error('Erreur API métriques:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
