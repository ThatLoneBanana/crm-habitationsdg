import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const models = Object.getOwnPropertyNames(prisma)
    .filter(p => !p.startsWith('_') && !p.startsWith('$'))
    .slice(0, 50);

  return NextResponse.json({
    prismaType: typeof prisma,
    models,
    hasTemplate: 'template' in prisma,
    hasTemplateEtape: 'templateEtape' in prisma,
    hasTache: 'tache' in prisma,
    hasClient: 'client' in prisma,
  });
}
