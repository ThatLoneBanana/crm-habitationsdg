import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    let parametres = await prisma.parametres.findUnique({
      where: { id: 'singleton' }
    })

    if (!parametres) {
      parametres = await prisma.parametres.create({
        data: { id: 'singleton' }
      })
    }

    return NextResponse.json({ parametres })
  } catch (error: any) {
    console.error('Erreur API parametres:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const parametres = await prisma.parametres.update({
      where: { id: 'singleton' },
      data: {
        nomCompagnie: body.nomCompagnie,
        rbq: body.rbq,
        email: body.email,
        telephone: body.telephone,
        siteWeb: body.siteWeb,
        maxHeuresParSemaine: body.maxHeuresParSemaine ? parseFloat(body.maxHeuresParSemaine) : undefined,
      }
    })

    return NextResponse.json({ parametres })
  } catch (error: any) {
    console.error('Erreur mise à jour parametres:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
