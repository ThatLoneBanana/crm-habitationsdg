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
