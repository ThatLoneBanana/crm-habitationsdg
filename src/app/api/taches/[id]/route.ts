import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await request.json();
    const { nom, dateDebut, dateFin, dureeJours, assigneA, visibleClient, ordre, description, interne } = body;

    const updateData: any = {};

    if (nom !== undefined && nom !== null) updateData.nom = nom;
    if (dateDebut !== undefined && dateDebut !== null) updateData.dateDebut = new Date(dateDebut);
    if (dateFin !== undefined && dateFin !== null) updateData.dateFin = new Date(dateFin);
    if (dureeJours !== undefined && dureeJours !== null) updateData.dureeJours = parseInt(dureeJours);
    if (assigneA !== undefined) updateData.assigneA = assigneA || null;
    if (visibleClient !== undefined) updateData.visibleClient = visibleClient;
    if (ordre !== undefined && ordre !== null) updateData.ordre = parseInt(ordre);
    if (description !== undefined) updateData.description = description || null;
    if (interne !== undefined) updateData.interne = interne;

    const tache = await prisma.tache.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ tache });
  } catch (error: any) {
    console.error('Erreur mise à jour tâche:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
