import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth-guard';

const PROJET_SELECT = { select: { id: true, adresse: true, ville: true } };

// Notes PRIVÉES par utilisateur — aucune capability spéciale, chaque user a ses
// propres notes. userId vient TOUJOURS de la session serveur, jamais du body.
export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const notes = await prisma.note.findMany({
    where: { userId: user.id },
    orderBy: [{ fait: 'asc' }, { createdAt: 'desc' }],
    include: { projet: PROJET_SELECT },
  });
  return NextResponse.json({ notes });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const { contenu, fait, projetId } = await req.json();
  if (!contenu || !String(contenu).trim()) {
    return NextResponse.json({ error: 'Contenu requis' }, { status: 400 });
  }

  const note = await prisma.note.create({
    data: {
      userId: user.id,
      contenu: String(contenu).trim(),
      fait: !!fait,
      projetId: projetId || null,
    },
    include: { projet: PROJET_SELECT },
  });
  return NextResponse.json({ note }, { status: 201 });
}
