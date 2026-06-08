import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { etapes } = await request.json()

    // Supprime les étapes existantes si elles existent
    await prisma.tache.deleteMany({ where: { projetId: id } })

    // Crée les nouvelles étapes
    await prisma.tache.createMany({
      data: etapes.map((e: any) => ({
        projetId: id,
        nom: e.nom,
        ordre: e.ordre,
        dureeJours: e.dureeJours,
        dateDebut: new Date(e.dateDebut),
        dateFin: new Date(e.dateFin),
        assigneA: e.assigneA,
        visibleClient: e.visibleClient,
        interne: e.interne,
        buffer: e.buffer || 0,
      }))
    })

    // Invalide le cache de la page projet
    revalidatePath(`/projets/[id]`, 'page')

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erreur créer cédule:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}
