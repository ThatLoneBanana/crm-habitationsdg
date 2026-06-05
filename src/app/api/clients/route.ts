import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        projets: true,
      },
      orderBy: { nom: 'asc' },
    });

    return NextResponse.json({ clients });
  } catch (error: any) {
    console.error('Erreur API clients:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prenom, nom, email, telephone } = body;

    if (!prenom || !nom || !email) {
      return NextResponse.json(
        { error: 'Prénom, nom et email sont requis' },
        { status: 400 }
      );
    }

    const client = await prisma.client.create({
      data: {
        prenom,
        nom,
        email,
        telephone: telephone || null,
      },
      include: {
        projets: true,
      },
    });

    return NextResponse.json({ client }, { status: 201 });
  } catch (error: any) {
    console.error('Erreur création client:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
