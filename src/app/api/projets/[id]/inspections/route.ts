import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApiCapability } from '@/lib/auth-guard';

// Inspections GCR d'un projet. Gatée par la capacité voirGCR (ADMIN/DEVELOPPEUR
// true en dur, autres rôles selon RolePermission, fail-closed).
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireApiCapability('voirGCR');
  if (guard.response) return guard.response;

  const { id } = await params;
  const inspections = await prisma.inspectionGCR.findMany({
    where: { projetId: id },
    orderBy: { createdAt: 'asc' },
  });
  return NextResponse.json({ inspections });
}
