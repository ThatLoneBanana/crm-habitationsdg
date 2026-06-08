import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const employe = await prisma.employe.update({
      where: { id },
      data: {
        prenom: body.prenom,
        nom: body.nom,
        email: body.email || null,
        telephone: body.telephone || null,
        tauxHoraire: parseFloat(body.tauxHoraire || 0),
        metier: body.metier || null,
        actif: body.actif !== false,
      }
    })

    return NextResponse.json({ employe })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    await prisma.employe.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
