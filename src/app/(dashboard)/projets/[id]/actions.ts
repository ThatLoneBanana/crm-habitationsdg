'use server';

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export async function getProjet(id: string) {
  try {
    const projet = await prisma.projet.findUnique({
      where: { id },
      include: {
        client: true,
        vendeur: true,
        chargeProjet: true,
        taches: {
          orderBy: { ordre: 'asc' },
        },
        extras: {
          orderBy: { createdAt: 'desc' },
        },
        paiements: {
          orderBy: { createdAt: 'asc' },
        },
        fournisseurs: {
          include: {
            fournisseur: true,
          },
        },
      },
    });

    if (!projet) {
      notFound();
    }

    return projet;
  } catch (error) {
    console.error('Erreur lors de la récupération du projet:', error);
    notFound();
  }
}

export async function updateProjetPhase(id: string, phase: string) {
  try {
    const projet = await prisma.projet.update({
      where: { id },
      data: { phase: phase as any },
    });
    return { success: true, projet };
  } catch (error) {
    return { success: false, error: 'Erreur lors de la mise à jour' };
  }
}

export async function addExtra(id: string, data: any) {
  try {
    const extra = await prisma.extra.create({
      data: {
        ...data,
        projetId: id,
      },
    });
    return { success: true, extra };
  } catch (error) {
    return { success: false, error: 'Erreur lors de l\'ajout' };
  }
}

export async function updateExtra(id: string, data: any) {
  try {
    const extra = await prisma.extra.update({
      where: { id },
      data,
    });
    return { success: true, extra };
  } catch (error) {
    return { success: false, error: 'Erreur lors de la mise à jour' };
  }
}

export async function addPaiement(id: string, data: any) {
  try {
    const paiement = await prisma.paiement.create({
      data: {
        ...data,
        projetId: id,
      },
    });
    return { success: true, paiement };
  } catch (error) {
    return { success: false, error: 'Erreur lors de l\'ajout' };
  }
}
