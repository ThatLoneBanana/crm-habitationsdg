import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApiRole, ROLES_MANAGE_USERS } from '@/lib/auth-guard';

// Duplique un template (copie STRUCTURELLE : nom + type + étapes). Sert à créer
// des variantes d'une cédule type. Aucune donnée projet n'est touchée.
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireApiRole(ROLES_MANAGE_USERS);
    if (guard.response) return guard.response;

    const { id } = await params;
    const source = await prisma.template.findUnique({
      where: { id },
      include: { etapes: { orderBy: { ordre: 'asc' } } },
    });
    if (!source) {
      return NextResponse.json({ error: 'Template introuvable' }, { status: 404 });
    }

    // Nom de la copie, en évitant les collisions : « X (copie) », puis
    // « X (copie 2) », « X (copie 3) »… si « (copie) » existe déjà.
    const noms = new Set((await prisma.template.findMany({ select: { nom: true } })).map((t) => t.nom));
    let nom = `${source.nom} (copie)`;
    if (noms.has(nom)) {
      let n = 2;
      while (noms.has(`${source.nom} (copie ${n})`)) n++;
      nom = `${source.nom} (copie ${n})`;
    }

    const copie = await prisma.template.create({
      data: {
        nom,
        type: source.type,
        actif: source.actif,
        etapes: {
          createMany: {
            data: source.etapes.map((e) => ({
              ordre: e.ordre,
              nom: e.nom,
              joursDefaut: e.joursDefaut,
              assigneA: e.assigneA,
              visibleClient: e.visibleClient,
              interne: e.interne,
            })),
          },
        },
      },
      include: { etapes: { orderBy: { ordre: 'asc' } } },
    });

    return NextResponse.json({ template: copie }, { status: 201 });
  } catch (error: any) {
    console.error('Erreur duplication template:', error);
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}
