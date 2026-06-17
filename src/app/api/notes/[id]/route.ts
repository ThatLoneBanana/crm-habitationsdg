import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth-guard';

const PROJET_SELECT = { select: { id: true, adresse: true, ville: true } };

// Édition / suppression d'une note. SÉCURITÉ : avant toute mutation, on vérifie
// que la note appartient à l'utilisateur courant — sinon 404 (on ne révèle pas
// l'existence de la note d'un autre). Un user ne touche jamais la note d'un autre.
async function noteDeLUtilisateur(id: string, userId: string) {
  const note = await prisma.note.findUnique({ where: { id } });
  return note && note.userId === userId ? note : null;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const { id } = await params;
  if (!(await noteDeLUtilisateur(id, user.id))) {
    return NextResponse.json({ error: 'Note introuvable' }, { status: 404 });
  }

  const { contenu, fait, projetId } = await req.json();
  const data: any = {};
  if (contenu !== undefined) data.contenu = String(contenu).trim();
  if (fait !== undefined) data.fait = !!fait;
  if (projetId !== undefined) data.projetId = projetId || null;

  const note = await prisma.note.update({ where: { id }, data, include: { projet: PROJET_SELECT } });
  return NextResponse.json({ note });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const { id } = await params;
  if (!(await noteDeLUtilisateur(id, user.id))) {
    return NextResponse.json({ error: 'Note introuvable' }, { status: 404 });
  }

  await prisma.note.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
