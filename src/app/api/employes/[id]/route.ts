import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    // Mise à jour partielle : ne touche qu'aux champs réellement fournis.
    // (L'UI envoie parfois { actif } seul ou { tauxHoraire } seul — on ne doit
    //  pas écraser le reste, sinon un toggle remettrait le taux à 0.)
    const data: any = {}
    if (body.prenom !== undefined) data.prenom = body.prenom
    if (body.nom !== undefined) data.nom = body.nom
    if (body.email !== undefined) data.email = body.email || null
    if (body.telephone !== undefined) data.telephone = body.telephone || null
    if (body.tauxHoraire !== undefined) data.tauxHoraire = parseFloat(body.tauxHoraire)
    if (body.metier !== undefined) data.metier = body.metier || null
    if (body.actif !== undefined) data.actif = body.actif

    const employe = await prisma.employe.update({ where: { id }, data })

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
