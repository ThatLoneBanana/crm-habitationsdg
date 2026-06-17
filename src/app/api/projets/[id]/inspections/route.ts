import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApiCapability } from '@/lib/auth-guard';

// Données de l'onglet Listes (gatée voirGCR — ADMIN/DEVELOPPEUR true en dur,
// autres rôles selon RolePermission, fail-closed). Renvoie EN UN SEUL appel les
// inspections GCR (Lot 1) ET les items de listes simples (Lot 2), pour le
// lazy-fetch unique du tab à son ouverture.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireApiCapability('voirGCR');
  if (guard.response) return guard.response;

  const { id } = await params;
  const [inspections, listes] = await Promise.all([
    prisma.inspectionGCR.findMany({ where: { projetId: id }, orderBy: { createdAt: 'asc' } }),
    prisma.listeItem.findMany({ where: { projetId: id }, orderBy: { createdAt: 'asc' } }),
  ]);
  return NextResponse.json({ inspections, listes });
}
