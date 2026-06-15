import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { prenom, nom, email, telephone } = await request.json();

    const client = await prisma.client.update({
      where: { id },
      data: { prenom, nom, email, telephone: telephone || null },
    });

    return NextResponse.json(client);
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
    await prisma.client.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    // FK: client référencé par un ou des projets (Projet.clientId, onDelete par défaut = Restrict)
    if (error?.code === 'P2003') {
      return NextResponse.json(
        { error: "Ce client est lié à un ou plusieurs projets. Supprimez ou réassignez d'abord ses projets." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
