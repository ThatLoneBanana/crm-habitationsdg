import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const fournisseurs = await prisma.fournisseur.findMany({
      orderBy: { nom: 'asc' },
    });
    return NextResponse.json({ fournisseurs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nom, metier, email, telephone, actif } = await request.json();
    const fournisseur = await prisma.fournisseur.create({
      data: { nom, metier, email, telephone, actif: actif !== false },
    });
    return NextResponse.json(fournisseur, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
