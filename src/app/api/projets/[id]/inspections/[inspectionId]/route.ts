import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireApiCapability } from '@/lib/auth-guard';

// Maj d'une inspection GCR : statut / dateReservee / notes, et déplacement de
// l'ancre (le marqueur Tache.ancrageInspection). Gatée voirGCR.
//  - ancreTacheId fourni  → déplace le marqueur du type de l'inspection :
//      efface ce type sur toutes les tâches du projet, puis le pose sur la
//      tâche choisie (ancreTacheId vide/null = désancrer).
//  - dateReservee non nulle → statut RESERVE (sauf statut explicite) ;
//    dateReservee effacée    → statut A_RESERVER (sauf statut explicite).
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; inspectionId: string }> },
) {
  const guard = await requireApiCapability('voirGCR');
  if (guard.response) return guard.response;

  const { id, inspectionId } = await params;
  const { dateReservee, statut, notes, ancreTacheId } = await req.json();

  const inspection = await prisma.inspectionGCR.findUnique({ where: { id: inspectionId } });
  if (!inspection || inspection.projetId !== id) {
    return NextResponse.json({ error: 'Inspection introuvable' }, { status: 404 });
  }

  // 1) Déplacement d'ancre — uniquement les types ancrables (GYPSE/FINITION).
  if (ancreTacheId !== undefined && (inspection.type === 'GYPSE' || inspection.type === 'FINITION')) {
    const type = inspection.type;
    await prisma.$transaction(async (tx) => {
      await tx.tache.updateMany({
        where: { projetId: id, ancrageInspection: type },
        data: { ancrageInspection: null },
      });
      if (ancreTacheId) {
        await tx.tache.updateMany({
          where: { id: ancreTacheId, projetId: id },
          data: { ancrageInspection: type },
        });
      }
    });
  }

  // 2) Mise à jour de l'inspection.
  const data: any = {};
  if (notes !== undefined) data.notes = notes;
  if (statut !== undefined) data.statut = statut;
  if (dateReservee !== undefined) {
    if (dateReservee) {
      data.dateReservee = new Date(dateReservee);
      if (statut === undefined) data.statut = 'RESERVE';
    } else {
      data.dateReservee = null;
      if (statut === undefined) data.statut = 'A_RESERVER';
    }
  }

  const updated = Object.keys(data).length > 0
    ? await prisma.inspectionGCR.update({ where: { id: inspectionId }, data })
    : inspection;

  revalidatePath('/projets/[id]', 'page');
  return NextResponse.json({ inspection: updated });
}
