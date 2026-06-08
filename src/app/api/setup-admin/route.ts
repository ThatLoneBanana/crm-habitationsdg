import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, prenom, nom } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      )
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        role: 'ADMIN',
        actif: true,
        prenom: prenom || 'Jason',
        nom: nom || 'Thibault'
      },
      create: {
        email,
        prenom: prenom || 'Jason',
        nom: nom || 'Thibault',
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

    return NextResponse.json({
      success: true,
      message: `User ${email} défini comme ADMIN`,
      user
    })
  } catch (error: any) {
    console.error('Erreur setup admin:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}
