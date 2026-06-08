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
    const employe = await prisma.employe.create({
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
