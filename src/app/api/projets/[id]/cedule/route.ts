import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { appliquerAncrageDefaut, ensureInspectionsGCR } from '@/lib/inspection-gcr'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { etapes } = await request.json()

    // Préserve les marqueurs d'ancrage existants, dédouble, et pose le défaut
    // par nom (« Pose gypse »/« Pose finition ») si un type n'est pas marqué.
    const etapesAncrees = appliquerAncrageDefaut(etapes ?? [])

    // Supprime les étapes existantes si elles existent
    await prisma.tache.deleteMany({ where: { projetId: id } })

    // Crée les nouvelles étapes (delete+recreate → groupeId + ancrageInspection
    // persistés par tâche).
    await prisma.tache.createMany({
      data: etapesAncrees.map((e: any) => ({
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
        groupeId: e.groupeId ?? null,
        ancrageInspection: e.ancrageInspection ?? null,
      }))
    })

    // Garantit les inspections GCR du projet (idempotent).
    await ensureInspectionsGCR(id)

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
