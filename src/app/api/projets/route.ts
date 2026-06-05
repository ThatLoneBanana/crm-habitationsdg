import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phase = searchParams.get('phase');
    const search = searchParams.get('search');
    const urlClient = searchParams.get('urlClient');

    const where: any = {};

    // Si urlClient est fourni, chercher par slug
    if (urlClient) {
      where.urlClient = urlClient;
    }

    if (phase && phase !== 'TOUS') {
      where.phase = phase;
    }

    if (search) {
      where.OR = [
        { numero: { contains: search, mode: 'insensitive' } },
        { adresse: { contains: search, mode: 'insensitive' } },
        { client: { nom: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const projets = await prisma.projet.findMany({
      where,
      include: {
        client: true,
        vendeur: true,
        chargeProjet: true,
        taches: true,
        extras: true,
        paiements: true,
      },
      orderBy: { dateLivraison: 'asc' },
    });

    return NextResponse.json({ projets });
  } catch (error: any) {
    console.error('Erreur API projets:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const projet = await prisma.projet.create({ data });
    return NextResponse.json(projet, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
