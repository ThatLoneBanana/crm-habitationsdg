import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { titre, datePlanifiee } = await req.json();

    const inspection = await prisma.gCRInspection.create({
      data: {
        projetId: id,
        titre,
        datePlanifiee: datePlanifiee ? new Date(datePlanifiee) : null,
      },
    });

    await prisma.gCRLog.create({
      data: {
        projetId: id,
        action: 'INSP_CREEE',
        description: `Inspection GCR créée: ${titre}`,
      },
    });

    return NextResponse.json(inspection, { status: 201 });
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
    const { inspectionId, statut, dateRealisee, notes } = await req.json();

    const inspection = await prisma.gCRInspection.update({
      where: { id: inspectionId },
      data: {
        statut,
        dateRealisee: dateRealisee ? new Date(dateRealisee) : null,
        notes,
      },
    });

    const statutLabels: Record<string, string> = {
      PLANIFIEE: 'planifiée',
      COMPLETEE: 'complétée',
      NON_CONFORME: 'marquée non-conforme',
    };

    await prisma.gCRLog.create({
      data: {
        projetId: id,
        action: 'INSP_MODIFIEE',
        description: `Inspection GCR ${statutLabels[statut] || statut}: ${inspection.titre}`,
      },
    });

    return NextResponse.json(inspection);
  } catch (error: any) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
