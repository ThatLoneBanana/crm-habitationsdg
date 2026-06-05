import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projetId, nom, dateDebut, dateFin, assigneA, statut, visibleClient } = body;

    const tache = await prisma.tache.create({
      data: {
        projetId,
        nom,
        dateDebut: new Date(dateDebut),
        dateFin: new Date(dateFin),
        assigneA: assigneA || null,
        statut: statut || 'NON_COMMENCE',
        visibleClient: visibleClient || false,
        ordre: 99,
      },
    });

    return NextResponse.json({ tache }, { status: 201 });
  } catch (error: any) {
    console.error('Erreur création tâche:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, nom, dateDebut, dateFin, assigneA, statut, visibleClient } = body;

    const tache = await prisma.tache.update({
      where: { id },
      data: {
        nom,
        dateDebut: dateDebut ? new Date(dateDebut) : undefined,
        dateFin: dateFin ? new Date(dateFin) : undefined,
        assigneA: assigneA || null,
        statut,
        visibleClient,
      },
    });

    return NextResponse.json({ tache });
  } catch (error: any) {
    console.error('Erreur mise à jour tâche:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
