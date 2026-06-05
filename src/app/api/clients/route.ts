import { NextResponse } from 'next/server';
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
