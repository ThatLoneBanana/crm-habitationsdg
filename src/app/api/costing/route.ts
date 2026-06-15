import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiCapability } from '@/lib/auth-guard'

export async function GET(request: NextRequest) {
  try {
    const guard = await requireApiCapability('voirCosting')
    if (guard.response) return guard.response

    const projets = await prisma.projet.findMany({
      include: {
        depenses: true,
        feuillesTemps: true,
      },
    })

    const projetsCosting = projets.map(p => {
      const depensesMateriaux = p.depenses
        .filter(d => d.categorie === 'MATERIAUX')
        .reduce((s, d) => s + d.montant, 0)

      const depensesSousTraitant = p.depenses
        .filter(d => d.categorie === 'SOUS_TRAITANT')
        .reduce((s, d) => s + d.montant, 0)

      const depensesEquipement = p.depenses
        .filter(d => d.categorie === 'EQUIPEMENT')
        .reduce((s, d) => s + d.montant, 0)

      const depensesAutre = p.depenses
        .filter(d => d.categorie === 'AUTRE')
        .reduce((s, d) => s + d.montant, 0)

      // Main d'oeuvre des feuilles de temps
      const depensesMainOeuvre = p.feuillesTemps.reduce(
        (s, f) => s + (f.heures * f.tauxHoraire),
        0
      )

      const depensesTotal =
        depensesMateriaux + depensesSousTraitant + depensesEquipement + depensesAutre + depensesMainOeuvre

      return {
        id: p.id,
        numero: p.numero,
        adresse: p.adresse,
        montantTotal: p.montantTotal ? parseFloat(p.montantTotal.toString()) : 0,
        depensesMateriaux,
        depensesSousTraitant,
        depensesEquipement,
        depensesAutre,
        depensesMainOeuvre,
        depensesTotal,
      }
    })

    return NextResponse.json({ projets: projetsCosting })
  } catch (error: any) {
    console.error('Erreur costing:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
