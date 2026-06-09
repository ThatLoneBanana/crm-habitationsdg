import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const logs = await prisma.gCRLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });

    return NextResponse.json({ logs });
  } catch (error: any) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
