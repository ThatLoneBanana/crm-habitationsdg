import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiRole, ROLES_MANAGE_USERS } from '@/lib/auth-guard'

export async function GET(request: NextRequest) {
  try {
    const guard = await requireApiRole(ROLES_MANAGE_USERS)
    if (guard.response) return guard.response

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        prenom: true,
        nom: true,
        role: true,
        actif: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(users)
  } catch (error: any) {
    console.error('Erreur API users:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}
