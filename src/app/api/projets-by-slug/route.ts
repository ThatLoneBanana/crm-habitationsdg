import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get('slug');
    if (!slug) {
      return NextResponse.json({ error: 'Slug manquant' }, { status: 400 });
    }

    const projet = await prisma.projet.findUnique({
      where: { slug },
      include: {
        client: true,
        vendeur: true,
        chargeProjet: true,
        taches: { orderBy: { ordre: 'asc' } },
        extras: true,
        paiements: { orderBy: { id: 'asc' } },
      },
    });

    if (!projet) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ projet });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
