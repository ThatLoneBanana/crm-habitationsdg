import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string; depenseId: string }> }) {
  try {
    const { depenseId } = await params
    const body = await request.json()

    const depense = await prisma.depense.update({
      where: { id: depenseId },
      data: {
        categorie: body.categorie,
        description: body.description,
        fournisseur: body.fournisseur || null,
        montant: parseFloat(body.montant),
        dateDepense: new Date(body.dateDepense),
        facture: body.facture || null,
        notes: body.notes || null,
      },
    })

    return NextResponse.json({ depense })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; depenseId: string }> }) {
  try {
    const { depenseId } = await params

    await prisma.depense.delete({
      where: { id: depenseId },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
