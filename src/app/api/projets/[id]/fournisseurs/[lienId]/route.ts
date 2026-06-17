import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

// Édition (budgetAlloue / confirme) et suppression d'un lien ProjetFournisseur.
// `confirme` = ce lien est visible côté client (filtre confirme:true de la vue
// client). On vérifie que le lien appartient bien au projet.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; lienId: string }> }) {
  try {
    const { id, lienId } = await params;
    const lien = await prisma.projetFournisseur.findUnique({ where: { id: lienId } });
    if (!lien || lien.projetId !== id) return NextResponse.json({ error: 'Lien introuvable' }, { status: 404 });

    const { budgetAlloue, confirme } = await req.json();
    const data: any = {};
    if (budgetAlloue !== undefined) data.budgetAlloue = budgetAlloue === null || budgetAlloue === '' ? null : Number(budgetAlloue);
    if (confirme !== undefined) data.confirme = !!confirme;

    const updated = await prisma.projetFournisseur.update({ where: { id: lienId }, data });
    revalidatePath('/projets/[id]', 'page');
    return NextResponse.json({ lien: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string; lienId: string }> }) {
  try {
    const { id, lienId } = await params;
    const lien = await prisma.projetFournisseur.findUnique({ where: { id: lienId } });
    if (!lien || lien.projetId !== id) return NextResponse.json({ error: 'Lien introuvable' }, { status: 404 });

    await prisma.projetFournisseur.delete({ where: { id: lienId } });
    revalidatePath('/projets/[id]', 'page');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
