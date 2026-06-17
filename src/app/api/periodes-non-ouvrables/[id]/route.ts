import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.periodeNonOuvrable.delete({ where: { id } });
    return NextResponse.json({ message: 'Période supprimée' });
  } catch (error: any) {
    console.error('Erreur suppression période:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
