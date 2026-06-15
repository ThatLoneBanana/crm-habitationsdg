import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiRole, ROLES_EDIT_FEUILLES } from '@/lib/auth-guard'

export async function POST(request: NextRequest) {
  try {
    const guard = await requireApiRole(ROLES_EDIT_FEUILLES)
    if (guard.response) return guard.response

    const { semaine, entries } = await request.json()

    const lundiSemaine = new Date(semaine)
    lundiSemaine.setHours(0, 0, 0, 0)
    const vendrediSemaine = new Date(lundiSemaine)
    vendrediSemaine.setDate(lundiSemaine.getDate() + 4)
    vendrediSemaine.setHours(23, 59, 59, 999)

    // Identifie les paires employeId-projetId à supprimer
    const employeProjetPairs = [...new Set(entries.map((e: any) => `${e.employeId}-${e.projetId}`))]

    // Supprime les entrées existantes pour cette semaine
    for (const pair of employeProjetPairs) {
      const [employeId, projetId] = (pair as string).split('-')
      await prisma.feuilleTemps.deleteMany({
        where: {
          employeId,
          projetId,
          date: { gte: lundiSemaine, lte: vendrediSemaine }
        }
      })
    }

    // Crée toutes les nouvelles entrées
    await prisma.feuilleTemps.createMany({
      data: entries.map((e: any) => ({
        employeId: e.employeId,
        projetId: e.projetId,
        date: new Date(e.date),
        heures: parseFloat(e.heures),
        tauxHoraire: parseFloat(e.tauxHoraire),
        notes: e.notes || '',
        approuve: true,
      }))
    })

    return NextResponse.json({ success: true, count: entries.length })
  } catch (error: any) {
    console.error('Erreur sauvegarde semaine:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
