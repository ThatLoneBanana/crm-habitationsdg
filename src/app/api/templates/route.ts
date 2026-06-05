import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ETAPES_NOMS, DUREES_DEFAUT, ASSIGNATIONS_DEFAUT, ETAPES_INTERNES } from '@/lib/template-utils';

export async function GET() {
  try {
    let templates = await prisma.template.findMany({
      include: {
        etapes: { orderBy: { ordre: 'asc' } },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Créer les templates par défaut s'il n'en existe pas
    if (templates.length === 0) {
      for (const type of ['JUMELE', 'MAISON']) {
        const template = await prisma.template.create({
          data: {
            nom: type === 'JUMELE' ? 'Jumelé' : 'Maison',
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
