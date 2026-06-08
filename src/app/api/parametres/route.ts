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

    const parametres = await prisma.parametres.upsert({
      where: { id: 'singleton' },
      create: {
        id: 'singleton',
        nomCompagnie: body.nomCompagnie || 'Habitations DG',
        rbq: body.rbq || '5856-1036-01',
        email: body.email || '',
        telephone: body.telephone || '',
        siteWeb: body.siteWeb || '',
        maxHeuresParSemaine: body.maxHeuresParSemaine ? parseFloat(body.maxHeuresParSemaine) : 36.5,
      },
      update: {
        nomCompagnie: body.nomCompagnie || undefined,
        rbq: body.rbq || undefined,
        email: body.email || undefined,
        telephone: body.telephone || undefined,
        siteWeb: body.siteWeb || undefined,
        maxHeuresParSemaine: body.maxHeuresParSemaine ? parseFloat(body.maxHeuresParSemaine) : undefined,
      }
    })

    return NextResponse.json({ success: true, parametres })
  } catch (error: any) {
    console.error('Erreur parametres:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
