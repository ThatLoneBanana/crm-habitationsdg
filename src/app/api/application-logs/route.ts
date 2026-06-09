import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export interface ApplicationLog {
  action: string;
  entity: string;
  entityId: string;
  description: string;
  userId?: string;
  details?: Record<string, any>;
}

export async function POST(req: NextRequest) {
  try {
    const log: ApplicationLog = await req.json();

    const createdLog = await prisma.gCRLog.create({
      data: {
        projetId: log.entityId,
        userId: log.userId,
        action: log.action,
        description: log.description,
      },
    });

    return NextResponse.json(createdLog, { status: 201 });
  } catch (error: any) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');
    const entityId = searchParams.get('entityId');

    const where: any = {};
    if (userId) where.userId = userId;
    if (action) where.action = action;
    if (entityId) where.projetId = entityId;

    const logs = await prisma.gCRLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ logs });
  } catch (error: any) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
