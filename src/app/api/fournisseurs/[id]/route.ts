import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { nom, metier, email, telephone, actif } = await request.json();

    const fournisseur = await prisma.fournisseur.update({
      where: { id },
      data: { nom, metier, email, telephone, actif },
    });

    return NextResponse.json(fournisseur);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.fournisseur.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    // FK: fournisseur référencé par un projet (ProjetFournisseur, onDelete par défaut = Restrict)
    if (error?.code === 'P2003') {
      return NextResponse.json(
        { error: 'Ce fournisseur est lié à un ou plusieurs projets. Désactivez-le plutôt que de le supprimer.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
