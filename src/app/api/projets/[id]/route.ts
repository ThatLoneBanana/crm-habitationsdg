import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const projet = await prisma.projet.findUnique({
      where: { id },
      include: {
        client: true,
        vendeur: true,
        chargeProjet: true,
        taches: { orderBy: { ordre: 'asc' } },
        extras: true,
        paiements: true,
      },
    });

    if (!projet) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ projet });
  } catch (error: any) {
    console.error('Erreur API projet:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Vérifier que le projet existe
    const projet = await prisma.projet.findUnique({
      where: { id },
    });

    if (!projet) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer le projet (cascade supprimes taches, paiements, extras, etc.)
    await prisma.projet.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Projet supprimé avec succès' });
  } catch (error: any) {
    console.error('Erreur suppression projet:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
