import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireApiCapability } from '@/lib/auth-guard';

// Édition / suppression d'un item de liste simple. Gatée voirGCR.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> },
) {
  const guard = await requireApiCapability('voirGCR');
  if (guard.response) return guard.response;

  const { id, itemId } = await params;
  const existant = await prisma.listeItem.findUnique({ where: { id: itemId } });
  if (!existant || existant.projetId !== id) {
    return NextResponse.json({ error: 'Item introuvable' }, { status: 404 });
  }

  const { nom, statut, date, notes, categorie } = await req.json();
  const data: any = {};
  if (nom !== undefined) data.nom = nom;
  if (statut !== undefined) data.statut = statut;
  if (categorie !== undefined) data.categorie = categorie;
  if (notes !== undefined) data.notes = notes || null;
  if (date !== undefined) data.date = date ? new Date(date) : null;

  const item = await prisma.listeItem.update({ where: { id: itemId }, data });
  revalidatePath('/projets/[id]', 'page');
  return NextResponse.json({ item });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> },
) {
  const guard = await requireApiCapability('voirGCR');
  if (guard.response) return guard.response;

  const { id, itemId } = await params;
  const existant = await prisma.listeItem.findUnique({ where: { id: itemId } });
  if (!existant || existant.projetId !== id) {
    return NextResponse.json({ error: 'Item introuvable' }, { status: 404 });
  }

  await prisma.listeItem.delete({ where: { id: itemId } });
  revalidatePath('/projets/[id]', 'page');
  return NextResponse.json({ success: true });
}
