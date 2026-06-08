'use server';

import { prisma } from '@/lib/prisma';
import { PhaseProjet } from '@prisma/client';

export async function getProjetsData(phase?: string, search?: string) {
  try {
    const where: any = {};

    if (phase && phase !== 'TOUS') {
      where.phase = phase as PhaseProjet;
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
        extras: { where: { statut: 'EN_ATTENTE' } },
        paiements: true,
      },
      orderBy: { dateLivraison: 'asc' },
    });

    return projets;
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    return [];
  }
}

export async function getMetrics() {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [
      projetActifs,
      livraisonsMonth,
      extrasNonSignes,
      paiementsEnRetard,
    ] = await Promise.all([
      prisma.projet.count({
        where: {
          phase: {
            notIn: ['TERMINE'],
          },
        },
      }),
      prisma.projet.count({
        where: {
          dateLivraison: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      }),
      prisma.extra.count({
        where: {
          statut: 'EN_ATTENTE',
        },
      }),
      prisma.paiement.count({
        where: {
          recu: false,
          datePrevu: {
            lt: now,
          },
        },
      }),
    ]);

    return {
      projetActifs,
      livraisonsMonth,
      alertes: paiementsEnRetard,
      extrasNonSignes,
      gcrAPlanifier: 0, // À implémenter avec GCR model si nécessaire
    };
  } catch (error) {
    console.error('Erreur lors du calcul des métriques:', error);
    return {
      projetActifs: 0,
      livraisonsMonth: 0,
      alertes: 0,
      extrasNonSignes: 0,
      gcrAPlanifier: 0,
    };
  }
}
