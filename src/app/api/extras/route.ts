import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projetId, description, montant, fournisseur } = body;

    const extra = await prisma.extra.create({
      data: {
        projetId,
        description,
        montant: parseFloat(montant),
        fournisseur: fournisseur || null,
        statut: 'EN_ATTENTE',
      },
    });

    return NextResponse.json({ extra }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, description, montant, fournisseur, statut } = body;

    const extra = await prisma.extra.update({
      where: { id },
      data: {
        description,
        montant: montant ? parseFloat(montant) : undefined,
        fournisseur,
        statut,
        signeLe: statut === 'SIGNE' ? new Date() : null,
      },
    });

    return NextResponse.json({ extra });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
