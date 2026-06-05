import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, recu, dateRecu } = body;

    const paiement = await prisma.paiement.update({
      where: { id },
      data: {
        recu,
        dateRecu: recu && dateRecu ? new Date(dateRecu) : null,
      },
    });

    return NextResponse.json({ paiement });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
