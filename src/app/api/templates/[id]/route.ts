import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApiRole, ROLES_MANAGE_USERS } from '@/lib/auth-guard';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const template = await prisma.template.findUnique({
      where: { id },
      include: { etapes: { orderBy: { ordre: 'asc' } } },
    });

    if (!template) {
      return NextResponse.json({ error: 'Template non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ template });
  } catch (error: any) {
    console.error('Erreur API template:', error);
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireApiRole(ROLES_MANAGE_USERS);
    if (guard.response) return guard.response;

    const { id } = await params;
    const body = await request.json();
    const { etapes } = body;

    // Supprimer les étapes existantes
    await prisma.templateEtape.deleteMany({ where: { templateId: id } });

    // Créer les nouvelles étapes
    await prisma.templateEtape.createMany({
      data: etapes.map((e: any, idx: number) => ({
        templateId: id,
        ordre: idx + 1,
        nom: e.nom,
        joursDefaut: e.joursDefaut || e.jours || 1,
        assigneA: e.assigneA || null,
        visibleClient: e.visibleClient !== false,
        interne: e.interne || false,
      })),
    });

    const template = await prisma.template.findUnique({
      where: { id },
      include: { etapes: { orderBy: { ordre: 'asc' } } },
    });

    return NextResponse.json({ template });
  } catch (error: any) {
    console.error('Erreur mise à jour template:', error);
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireApiRole(ROLES_MANAGE_USERS);
    if (guard.response) return guard.response;

    const { id } = await params;

    await prisma.template.delete({ where: { id } });

    return NextResponse.json({ message: 'Template supprimé' });
  } catch (error: any) {
    console.error('Erreur suppression template:', error);
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}
