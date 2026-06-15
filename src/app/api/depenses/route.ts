import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jours = parseInt(searchParams.get("jours") || "30")
    const projetId = searchParams.get("projetId")

    const debut = new Date()
    debut.setDate(debut.getDate() - jours)

    const where: any = {
      dateDepense: { gte: debut }
    }
    if (projetId) where.projetId = projetId

    const depenses = await prisma.depense.findMany({
      where,
      include: {
        projet: { select: { id: true, numero: true, adresse: true, ville: true } }
      },
      orderBy: { dateDepense: "desc" }
    })

    return NextResponse.json({ depenses })
  } catch (error: any) {
    console.error("Erreur API depenses:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
