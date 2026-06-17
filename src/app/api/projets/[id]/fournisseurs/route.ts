import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

// Lier un fournisseur (du catalogue) à un projet. Gating identique aux écritures
// extras/cédule (auth via le proxy ; pas de capacité spécifique). Le catalogue
// Fournisseur se gère ailleurs (/fournisseurs) — ici on ne crée QUE le lien.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { fournisseurId, budgetAlloue, confirme } = await req.json();
    if (!fournisseurId) return NextResponse.json({ error: 'Fournisseur requis' }, { status: 400 });

    // Évite un doublon de lien (pas de contrainte unique en base).
    const existant = await prisma.projetFournisseur.findFirst({ where: { projetId: id, fournisseurId } });
    if (existant) return NextResponse.json({ lien: existant });

    const lien = await prisma.projetFournisseur.create({
      data: {
        projetId: id,
        fournisseurId,
        budgetAlloue: budgetAlloue === undefined || budgetAlloue === null || budgetAlloue === '' ? null : Number(budgetAlloue),
        confirme: !!confirme,
      },
    });
    revalidatePath('/projets/[id]', 'page');
    return NextResponse.json({ lien }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
