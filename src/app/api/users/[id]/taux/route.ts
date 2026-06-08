import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    await prisma.user.update({
      where: { id },
      data: {
        tauxHoraire: parseFloat(body.tauxHoraire)
      }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erreur mise à jour taux:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
