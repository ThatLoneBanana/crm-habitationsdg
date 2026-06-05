import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { updates } = body; // Array of { id, dateDebut, dateFin }

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json({ error: 'updates requis' }, { status: 400 });
    }

    const results = await Promise.all(
      updates.map((update: any) =>
        prisma.tache.update({
          where: { id: update.id },
          data: {
            dateDebut: new Date(update.dateDebut),
            dateFin: new Date(update.dateFin),
          },
        })
      )
    );

    return NextResponse.json({ taches: results });
  } catch (error: any) {
    console.error('Erreur batch update:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
