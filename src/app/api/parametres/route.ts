import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    let parametres = await prisma.parametres.findUnique({
      where: { id: 'singleton' }
    })

    if (!parametres) {
      parametres = await prisma.parametres.create({
        data: { id: 'singleton' }
      })
    }

    return NextResponse.json({
      nomCompagnie: parametres.nomCompagnie,
      rbq: parametres.rbq,
      email: parametres.email,
      telephone: parametres.telephone,
      siteWeb: parametres.siteWeb
    })
  } catch (error: any) {
    console.error('Erreur API parametres:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { nomCompagnie, rbq, email, telephone, siteWeb } = await request.json()

    const parametres = await prisma.parametres.upsert({
      where: { id: 'singleton' },
      update: {
        nomCompagnie,
        rbq,
        email,
        telephone,
        siteWeb
      },
      create: {
        id: 'singleton',
        nomCompagnie,
        rbq,
        email,
        telephone,
        siteWeb
      }
    })

    return NextResponse.json({
      nomCompagnie: parametres.nomCompagnie,
      rbq: parametres.rbq,
      email: parametres.email,
      telephone: parametres.telephone,
      siteWeb: parametres.siteWeb
    })
  } catch (error: any) {
    console.error('Erreur API parametres PUT:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}
