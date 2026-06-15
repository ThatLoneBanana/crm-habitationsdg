import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ETAPES_NOMS, DUREES_DEFAUT, ASSIGNATIONS_DEFAUT, ETAPES_INTERNES } from '@/lib/template-utils';
import { requireApiRole, ROLES_MANAGE_USERS } from '@/lib/auth-guard';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    console.log('GET templates - type:', type);

    // Vérifier que prisma.template existe
    if (!prisma || !prisma.template) {
      console.error('Prisma template model not found');
      return NextResponse.json({ error: 'Template model not initialized' }, { status: 500 });
    }

    // Si type spécifié, retourner un seul template
    if (type) {
      const template = await prisma.template.findFirst({
        where: {
          type: type as any,
          actif: true
        },
        include: {
          etapes: {
            orderBy: { ordre: 'asc' }
          }
        }
      });
      return NextResponse.json(template);
    }

    // Sinon retourner tous les templates
    let templates = await prisma.template.findMany({
      include: {
        etapes: { orderBy: { ordre: 'asc' } },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Crée les templates par défaut MANQUANTS (idempotent, couvre les 3 types).
    // template-utils ne sert que de seed initial ici — jamais lu au runtime ailleurs.
    const typesRequis: Array<'JUMELE' | 'MAISON' | 'MULTILOGEMENT'> = ['JUMELE', 'MAISON', 'MULTILOGEMENT'];
    const typesExistants = new Set(templates.map(t => t.type));
    for (const type of typesRequis) {
      if (typesExistants.has(type as any)) continue;
      const template = await prisma.template.create({
        data: {
          nom: type === 'JUMELE' ? 'Jumelé' : type === 'MAISON' ? 'Maison' : 'Multilogement',
          type: type as any,
          etapes: {
            createMany: {
              data: ETAPES_NOMS.map((nom, idx) => ({
                ordre: idx + 1,
                nom,
                joursDefaut: DUREES_DEFAUT[nom] || 1,
                assigneA: ASSIGNATIONS_DEFAUT[nom] || null,
                visibleClient: !ETAPES_INTERNES.includes(nom),
                interne: ETAPES_INTERNES.includes(nom),
              })),
            },
          },
        },
        include: { etapes: { orderBy: { ordre: 'asc' } } },
      });
      templates.push(template);
    }

    return NextResponse.json({ templates });
  } catch (error: any) {
    console.error('Erreur API templates:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const guard = await requireApiRole(ROLES_MANAGE_USERS);
    if (guard.response) return guard.response;

    const body = await request.json();
    const { nom, type, etapes } = body;

    const template = await prisma.template.create({
      data: {
        nom,
        type,
        etapes: {
          createMany: {
            data: etapes.map((e: any, idx: number) => ({
              ordre: idx + 1,
              nom: e.nom,
              joursDefaut: e.jours,
              assigneA: e.assigneA || null,
              visibleClient: e.visibleClient !== false,
              interne: e.interne || false,
            })),
          },
        },
      },
      include: { etapes: { orderBy: { ordre: 'asc' } } },
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error: any) {
    console.error('Erreur création template:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
