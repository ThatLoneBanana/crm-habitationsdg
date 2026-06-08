import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Chercher dans Prisma par email
    let userPrisma = await prisma.user.findUnique({
      where: { email: user.email },
      select: {
        id: true,
        email: true,
        prenom: true,
        nom: true,
        role: true,
        actif: true
      }
    })

    // Si n'existe pas, créer avec les données Supabase
    if (!userPrisma) {
      userPrisma = await prisma.user.create({
        data: {
          email: user.email,
          prenom: user.user_metadata?.prenom || 'Utilisateur',
          nom: user.user_metadata?.nom || '',
          role: 'ADMIN',
          actif: true,
        },
        select: {
          id: true,
          email: true,
          prenom: true,
          nom: true,
          role: true,
          actif: true
        }
      })
    }

    return NextResponse.json(userPrisma)
  } catch (error: any) {
    console.error('Erreur API me:', error)
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

    if (!user || !user.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { prenom, nom } = await request.json()

    const userPrisma = await prisma.user.update({
      where: { email: user.email },
      data: { prenom, nom },
      select: {
        id: true,
        email: true,
        prenom: true,
        nom: true,
        role: true,
        actif: true
      }
    })

    return NextResponse.json(userPrisma)
  } catch (error: any) {
    console.error('Erreur API me PUT:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}
