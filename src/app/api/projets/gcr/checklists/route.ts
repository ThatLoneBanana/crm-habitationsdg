import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { label, estCocha, notes } = await req.json();

    const checklist = await prisma.gCRChecklist.create({
      data: {
        projetId: id,
        label,
        estCocha,
        notes,
      },
    });

    return NextResponse.json(checklist, { status: 201 });
  } catch (error: any) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
