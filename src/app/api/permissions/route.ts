import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

const DEFAULT_PERMISSIONS: Record<string, string[]> = {
  ADMIN: [
    'view_dashboard', 'view_projets', 'view_costing', 'edit_costing',
    'view_feuilles_de_temps', 'edit_feuilles_de_temps',
    'view_parametres', 'edit_parametres', 'view_gcr', 'edit_gcr',
    'view_logs', 'export_logs', 'manage_users'
  ],
  DEVELOPPEUR: [
    'view_dashboard', 'view_projets', 'view_costing', 'edit_costing',
    'view_feuilles_de_temps', 'edit_feuilles_de_temps',
    'view_parametres', 'view_gcr', 'edit_gcr',
    'view_logs', 'export_logs'
  ],
  COMPTABILITE: [
    'view_dashboard', 'view_projets', 'view_costing',
    'view_feuilles_de_temps', 'edit_feuilles_de_temps',
    'view_parametres'
  ],
  CHARGE_PROJET: [
    'view_dashboard', 'view_projets', 'view_costing',
    'view_feuilles_de_temps', 'view_parametres',
    'view_gcr', 'edit_gcr'
  ],
  VENDEUR: [
    'view_dashboard', 'view_projets'
  ]
}

const ALL_PERMISSIONS = [
  'view_dashboard',
  'view_projets',
  'view_costing',
  'edit_costing',
  'view_feuilles_de_temps',
  'edit_feuilles_de_temps',
  'view_parametres',
  'edit_parametres',
  'view_gcr',
  'edit_gcr',
  'view_logs',
  'export_logs',
  'manage_users'
]

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

    // Vérifier que c'est ADMIN
    const currentUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { role: true }
    })

    if (currentUser?.role !== 'ADMIN' && currentUser?.role !== 'DEVELOPPEUR') {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      )
    }

    // Récupérer toutes les permissions configurées
    const rolePermissions = await prisma.rolePermission.findMany()

    const permissions: Record<string, string[]> = {}
    for (const role of ['ADMIN', 'DEVELOPPEUR', 'COMPTABILITE', 'CHARGE_PROJET', 'VENDEUR']) {
      const found = rolePermissions.find(rp => rp.role === role)
      permissions[role] = found ? JSON.parse(found.permissions) : DEFAULT_PERMISSIONS[role] || []
    }

    return NextResponse.json({
      permissions,
      allPermissions: ALL_PERMISSIONS,
      roles: ['ADMIN', 'DEVELOPPEUR', 'COMPTABILITE', 'CHARGE_PROJET', 'VENDEUR']
    })
  } catch (error: any) {
    console.error('Erreur API permissions:', error)
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

    // Vérifier que c'est ADMIN
    const currentUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { role: true }
    })

    if (currentUser?.role !== 'ADMIN' && currentUser?.role !== 'DEVELOPPEUR') {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      )
    }

    const { permissions } = await request.json()

    // Mettre à jour ou créer les permissions pour chaque rôle
    for (const [role, perms] of Object.entries(permissions)) {
      await prisma.rolePermission.upsert({
        where: { role: role as any },
        update: { permissions: JSON.stringify(perms) },
        create: { role: role as any, permissions: JSON.stringify(perms) }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erreur API permissions PUT:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}
