import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { semaine, entries } = await request.json()

    const lundiSemaine = new Date(semaine)
    lundiSemaine.setHours(0, 0, 0, 0)
    const vendrediSemaine = new Date(lundiSemaine)
    vendrediSemaine.setDate(lundiSemaine.getDate() + 4)
    vendrediSemaine.setHours(23, 59, 59, 999)

    // Identifie les paires userId-projetId à supprimer
    const userProjetPairs = [...new Set(entries.map((e: any) => `${e.userId}-${e.projetId}`))]

    // Supprime les entrées existantes pour cette semaine
    for (const pair of userProjetPairs) {
      const [userId, projetId] = pair.split('-')
      await prisma.feuilleTemps.deleteMany({
        where: {
          userId,
          projetId,
          date: { gte: lundiSemaine, lte: vendrediSemaine }
        }
      })
    }

    // Crée toutes les nouvelles entrées
    await prisma.feuilleTemps.createMany({
      data: entries.map((e: any) => ({
        userId: e.userId,
        projetId: e.projetId,
        date: new Date(e.date),
        heures: parseFloat(e.heures),
        tauxHoraire: parseFloat(e.tauxHoraire),
        notes: e.notes || '',
        approuve: false,
      }))
    })

    return NextResponse.json({ success: true, count: entries.length })
  } catch (error: any) {
    console.error('Erreur sauvegarde semaine:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
