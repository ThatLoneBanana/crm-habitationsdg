import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const projetId = searchParams.get('projetId')
    const employeId = searchParams.get('employeId')
    const semaine = searchParams.get('semaine')

    const where: any = {}
    if (projetId) where.projetId = projetId
    if (employeId) where.employeId = employeId
    if (semaine) {
      const debut = new Date(semaine)
      const fin = new Date(debut)
      fin.setDate(fin.getDate() + 7)
      where.date = { gte: debut, lt: fin }
    }

    const feuilles = await prisma.feuilleTemps.findMany({
      where,
      include: {
        projet: { select: { id: true, adresse: true, numero: true } },
        employe: { select: { id: true, prenom: true, nom: true } },
      },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json({ feuilles })
  } catch (error: any) {
    console.error('Erreur API feuilles-de-temps:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()

    const feuille = await prisma.feuilleTemps.create({
      data: {
        projetId: body.projetId,
        employeId: body.employeId,
        date: new Date(body.date),
        heures: parseFloat(body.heures),
        tauxHoraire: parseFloat(body.tauxHoraire),
        notes: body.notes || null,
        approuve: false,
      },
      include: {
        projet: true,
        employe: true,
      },
    })

    return NextResponse.json({ feuille })
  } catch (error: any) {
    console.error('Erreur création feuille:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}
