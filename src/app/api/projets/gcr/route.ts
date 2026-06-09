import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const [checklists, inspections, logs] = await Promise.all([
      prisma.gCRChecklist.findMany({
        where: { projetId: id },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.gCRInspection.findMany({
        where: { projetId: id },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.gCRLog.findMany({
        where: { projetId: id },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    ]);

    return NextResponse.json({ checklists, inspections, logs });
  } catch (error: any) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { checklists } = await req.json();

    const updates = await Promise.all(
      checklists.map((item: any) =>
        prisma.gCRChecklist.update({
          where: { id: item.id },
          data: {
            estCocha: item.estCocha,
            dateCocha: item.estCocha ? new Date() : null,
            notes: item.notes,
          },
        })
      )
    );

    return NextResponse.json(updates);
  } catch (error: any) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
