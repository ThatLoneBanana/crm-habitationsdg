import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiRole, ROLES_VIEW_COSTING } from '@/lib/auth-guard'

export async function GET(request: NextRequest) {
  try {
    const guard = await requireApiRole(ROLES_VIEW_COSTING)
    if (guard.response) return guard.response

    const { searchParams } = new URL(request.url)
    const projetId = searchParams.get('projetId')

    if (!projetId) {
      return NextResponse.json({ error: 'projetId requis' }, { status: 400 })
    }

    // Récupère le projet
    const projet = await prisma.projet.findUnique({
      where: { id: projetId },
      select: {
        id: true,
        numero: true,
        montantTotal: true,
      }
    })

    if (!projet) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 })
    }

    // Récupère les dépenses
    const depenses = await prisma.depense.findMany({
      where: { projetId },
      include: {
        projet: { select: { numero: true, adresse: true } }
      }
    })

    // Récupère les feuilles de temps
    const feuillesDeTemps = await prisma.feuilleTemps.findMany({
      where: { projetId },
      include: {
        employe: { select: { prenom: true, nom: true } },
        projet: { select: { numero: true, adresse: true } }
      }
    })

    // Récupère les extras signés
    const extras = await prisma.extra.findMany({
      where: { projetId, statut: 'SIGNE' }
    })

    // CALCULS
    const montantContrat = parseFloat(projet.montantTotal?.toString() || '0')
    const extrasSignes = extras.reduce((sum, e) => sum + e.montant, 0)
    const revenues = montantContrat + extrasSignes

    const depensesMateriaux = depenses
      .filter(d => d.categorie === 'MATERIAUX')
      .reduce((sum, d) => sum + d.montant, 0)

    const depensesSousTraitants = depenses
      .filter(d => d.categorie === 'SOUS_TRAITANT')
      .reduce((sum, d) => sum + d.montant, 0)

    const depensesEquipement = depenses
      .filter(d => d.categorie === 'EQUIPEMENT')
      .reduce((sum, d) => sum + d.montant, 0)

    const depensesAutre = depenses
      .filter(d => d.categorie === 'AUTRE')
      .reduce((sum, d) => sum + d.montant, 0)

    const depensesMainOeuvre = feuillesDeTemps.reduce((sum, f) => sum + (f.heures * f.tauxHoraire), 0)

    const totalDepenses = depensesMateriaux + depensesSousTraitants + depensesEquipement + depensesAutre + depensesMainOeuvre
    const profitNet = revenues - totalDepenses
    const marge = revenues > 0 ? (profitNet / revenues * 100) : 0

    return NextResponse.json({
      projet,
      depenses,
      feuillesDeTemps,
      extras,
      calculs: {
        montantContrat,
        extrasSignes,
        revenues,
        depensesMateriaux,
        depensesSousTraitants,
        depensesEquipement,
        depensesAutre,
        depensesMainOeuvre,
        totalDepenses,
        profitNet,
        marge,
      }
    })
  } catch (error: any) {
    console.error('Erreur API costing:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
