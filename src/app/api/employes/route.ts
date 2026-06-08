import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const employes = await prisma.employe.findMany({
      orderBy: { nom: 'asc' }
    })
    return NextResponse.json({ employes })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.prenom || !body.nom) {
      return NextResponse.json({ error: 'Prenom et nom requis' }, { status: 400 })
    }

    const employe = await prisma.employe.create({
      data: {
        prenom: body.prenom.trim(),
        nom: body.nom.trim(),
        email: body.email ? body.email.trim() : null,
        telephone: body.telephone ? body.telephone.trim() : null,
        tauxHoraire: body.tauxHoraire ? parseFloat(body.tauxHoraire) : 0,
        metier: body.metier ? body.metier.trim() : null,
        actif: body.actif !== false,
      }
    })
    return NextResponse.json({ employe })
  } catch (error: any) {
    console.error('Erreur création employe:', error)
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 })
  }
}
