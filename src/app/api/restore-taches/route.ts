import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Template d'étapes standard
const ETAPES_STANDARD = [
  { nom: 'Excavation', ordre: 1, jours: 3 },
  { nom: 'Fondations', ordre: 2, jours: 5 },
  { nom: 'Charpente', ordre: 3, jours: 10 },
  { nom: 'Mur extérieur', ordre: 4, jours: 5 },
  { nom: 'Plombier fond de cave', ordre: 5, jours: 2 },
  { nom: 'Couler plancher intérieur', ordre: 6, jours: 1 },
  { nom: 'Intérieur division', ordre: 7, jours: 3 },
  { nom: 'Installation foyer', ordre: 8, jours: 2 },
  { nom: 'Intérieur division (2)', ordre: 9, jours: 1 },
  { nom: 'Mesure armoire', ordre: 10, jours: 1 },
  { nom: 'Air climatisé', ordre: 11, jours: 1 },
  { nom: 'Électricien + TV & Tél', ordre: 12, jours: 2 },
  { nom: 'Plombier', ordre: 13, jours: 1 },
  { nom: 'Échangeur d\'air', ordre: 14, jours: 1 },
  { nom: 'Isolation entretoit', ordre: 15, jours: 1 },
  { nom: 'Mesure finition', ordre: 16, jours: 1 },
  { nom: 'Final menuiserie', ordre: 17, jours: 2 },
  { nom: 'Entrée gypse', ordre: 18, jours: 1 },
  { nom: 'Pose gypse', ordre: 19, jours: 3 },
  { nom: 'Tireur de joints', ordre: 20, jours: 5 },
  { nom: 'Entrée finition', ordre: 21, jours: 1 },
  { nom: 'Pose finition', ordre: 22, jours: 3 },
  { nom: 'Peinture', ordre: 23, jours: 3 },
  { nom: 'Livraison céramique', ordre: 24, jours: 1 },
  { nom: 'Pose céramique', ordre: 25, jours: 2 },
  { nom: 'Coulis', ordre: 26, jours: 1 },
  { nom: 'Livraison armoire', ordre: 27, jours: 1 },
  { nom: 'Pose armoire', ordre: 28, jours: 1 },
  { nom: 'Dosseret', ordre: 29, jours: 1 },
  { nom: 'Livraison fixture', ordre: 30, jours: 1 },
  { nom: 'Finition électrique + TV & Tél', ordre: 31, jours: 1 },
  { nom: 'Finition plomberie', ordre: 32, jours: 1 },
  { nom: 'Finition échangeur d\'air', ordre: 33, jours: 1 },
  { nom: 'Air climatisé final', ordre: 34, jours: 1 },
  { nom: 'Installation porte de douche', ordre: 35, jours: 1 },
  { nom: 'Pose escalier ou rampe', ordre: 36, jours: 1 },
  { nom: 'Pose plancher', ordre: 37, jours: 2 },
  { nom: 'Petite finition', ordre: 38, jours: 1 },
  { nom: 'Peinture finale', ordre: 39, jours: 2 },
  { nom: 'Pose miroir + tablettes', ordre: 40, jours: 1 },
  { nom: 'Service +', ordre: 41, jours: 1 },
  { nom: 'Pose tapis', ordre: 42, jours: 1 },
  { nom: 'Ménage', ordre: 43, jours: 1 },
]

function calculerDates(dateLivraison: Date, totalJours: number) {
  let dateDebut = new Date(dateLivraison)
  dateDebut.setDate(dateDebut.getDate() - totalJours)
  return dateDebut
}

export async function POST(request: NextRequest) {
  try {
    // Trouve tous les projets avec count de tâches
    const projets = await prisma.projet.findMany({
      select: { id: true, dateLivraison: true, _count: { select: { taches: true } } }
    })

    // Filtre ceux sans tâches
    const sansTaches = projets.filter(p => p._count.taches === 0)

    console.log(`Restauration: ${sansTaches.length} projets sans tâches`)

    let totalTaches = 0
    for (const projet of sansTaches) {
      // Calcule la date de début (totalJours avant livraison)
      const totalJours = ETAPES_STANDARD.reduce((s, e) => s + e.jours, 0)
      let dateDebut = new Date(projet.dateLivraison as Date)
      dateDebut.setDate(dateDebut.getDate() - totalJours)

      // Crée les tâches
      const tachesToCreate = ETAPES_STANDARD.map((e, i) => {
        const tacheDebut = new Date(dateDebut)
        tacheDebut.setDate(tacheDebut.getDate() + ETAPES_STANDARD.slice(0, i).reduce((s, x) => s + x.jours, 0))

        const tacheFin = new Date(tacheDebut)
        tacheFin.setDate(tacheFin.getDate() + e.jours - 1)

        return {
          projetId: projet.id,
          nom: e.nom,
          ordre: e.ordre,
          dureeJours: e.jours,
          dateDebut: tacheDebut,
          dateFin: tacheFin,
          assigneA: null,
          visibleClient: true,
          interne: false,
          buffer: 0,
        }
      })

      await prisma.tache.createMany({
        data: tachesToCreate
      })

      totalTaches += tachesToCreate.length
      console.log(`✅ Projet ${projet.id}: ${tachesToCreate.length} tâches créées`)
    }

    return NextResponse.json({
      success: true,
      message: `Restauration complète: ${sansTaches.length} projets, ${totalTaches} tâches créées`
    })
  } catch (error: any) {
    console.error('Erreur restauration:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}
