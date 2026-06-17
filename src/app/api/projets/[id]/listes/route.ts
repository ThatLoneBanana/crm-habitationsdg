import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireApiCapability } from '@/lib/auth-guard';

// Création d'un item de liste simple (Permis / Arpentage / Autres). La lecture
// passe par le fetch unique du tab (GET /api/projets/[id]/inspections). Gatée voirGCR.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireApiCapability('voirGCR');
  if (guard.response) return guard.response;

  const { id } = await params;
  const { categorie, nom, statut, date, notes } = await req.json();

  if (!categorie || !nom) {
    return NextResponse.json({ error: 'Catégorie et nom requis' }, { status: 400 });
  }

  const item = await prisma.listeItem.create({
    data: {
      projetId: id,
      categorie,
      nom,
      statut: statut || 'A_FAIRE',
      date: date ? new Date(date) : null,
      notes: notes || null,
    },
  });

  revalidatePath('/projets/[id]', 'page');
  return NextResponse.json({ item }, { status: 201 });
}
