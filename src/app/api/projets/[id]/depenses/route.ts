import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const depenses = await prisma.depense.findMany({
      where: { projetId: id },
      orderBy: { dateDepense: 'desc' },
    })

    return NextResponse.json({ depenses })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const depense = await prisma.depense.create({
      data: {
        projetId: id,
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
