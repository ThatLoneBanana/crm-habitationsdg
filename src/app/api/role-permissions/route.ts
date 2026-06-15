import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiRole, ROLES_MANAGE_USERS } from '@/lib/auth-guard'

// Rôles configurables (ADMIN/DEVELOPPEUR = accès total en dur, jamais ici).
const CONFIGURABLE_ROLES = ['COMPTABILITE', 'CHARGE_PROJET', 'VENDEUR'] as const

function emptyCaps() {
  return { voirCosting: false, voirFeuilles: false, editFeuilles: false, voirGCR: false, editCedule: false }
}

export async function GET() {
  const guard = await requireApiRole(ROLES_MANAGE_USERS)
  if (guard.response) return guard.response

  const rows = await prisma.rolePermission.findMany()
  const permissions: Record<string, ReturnType<typeof emptyCaps>> = {}
  for (const role of CONFIGURABLE_ROLES) {
    const row = rows.find(r => r.role === role)
    permissions[role] = row
      ? {
          voirCosting: row.voirCosting,
          voirFeuilles: row.voirFeuilles,
          editFeuilles: row.editFeuilles,
          voirGCR: row.voirGCR,
          editCedule: row.editCedule,
        }
      : emptyCaps() // fail-closed par défaut si la ligne manque
  }
  return NextResponse.json({ permissions, roles: CONFIGURABLE_ROLES })
}

export async function PUT(request: NextRequest) {
  const guard = await requireApiRole(ROLES_MANAGE_USERS)
  if (guard.response) return guard.response

  const { permissions } = await request.json()

  for (const role of CONFIGURABLE_ROLES) {
    const caps = permissions?.[role]
    if (!caps) continue
    const data = {
      voirCosting: !!caps.voirCosting,
      voirFeuilles: !!caps.voirFeuilles,
      editFeuilles: !!caps.editFeuilles,
      voirGCR: !!caps.voirGCR,
      editCedule: !!caps.editCedule,
    }
    await prisma.rolePermission.upsert({
      where: { role: role as any },
      update: data,
      create: { role: role as any, ...data },
    })
  }

  return NextResponse.json({ success: true })
}
