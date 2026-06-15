import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import type { Role } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

/**
 * Garde de rôle/capacité côté serveur — sécurité réelle (pas cosmétique).
 * Utilisable dans les Server Components ET les routes API.
 * Lit le rôle depuis Prisma via la session Supabase validée (getUser).
 *
 * Capacités configurables (grain grossier) lues depuis la table RolePermission.
 * ADMIN/DEVELOPPEUR : accès total EN DUR (jamais lus en table — aucune config
 * ne peut les enfermer dehors). Tout le reste : fail-closed (refus par défaut).
 */

export type Capability = 'voirCosting' | 'voirFeuilles' | 'editFeuilles' | 'voirGCR' | 'editCedule'

export interface AuthUser {
  id: string
  email: string
  role: Role
  actif: boolean
}

type ApiGuard = { user: AuthUser; response?: undefined } | { user?: undefined; response: NextResponse }

export async function getAuthUser(): Promise<AuthUser | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return null
  return prisma.user.findUnique({
    where: { email: user.email },
    select: { id: true, email: true, role: true, actif: true },
  })
}

/** Lecture des permissions configurables, mémorisée par requête (React cache). */
const loadRolePermissions = cache(async (): Promise<Record<string, Record<Capability, boolean>>> => {
  const rows = await prisma.rolePermission.findMany()
  const map: Record<string, Record<Capability, boolean>> = {}
  for (const r of rows) {
    map[r.role] = {
      voirCosting: r.voirCosting,
      voirFeuilles: r.voirFeuilles,
      editFeuilles: r.editFeuilles,
      voirGCR: r.voirGCR,
      editCedule: r.editCedule,
    }
  }
  return map
})

/**
 * Décision de capacité. ADMIN/DEVELOPPEUR → toujours true (court-circuit en dur,
 * sans lire la table). Autres rôles → la table décide. Rôle/capacité absent ou
 * erreur DB → false (fail-closed, jamais autoriser).
 */
export async function userHasCapability(user: AuthUser | null, cap: Capability): Promise<boolean> {
  if (!user || !user.actif) return false
  if (user.role === 'ADMIN' || user.role === 'DEVELOPPEUR') return true
  try {
    const perms = await loadRolePermissions()
    return perms[user.role]?.[cap] === true
  } catch {
    return false
  }
}

/* ---- Gardes par capacité (surfaces configurables) ---- */

export async function requireApiCapability(cap: Capability): Promise<ApiGuard> {
  const user = await getAuthUser()
  if (!user) return { response: NextResponse.json({ error: 'Non authentifié' }, { status: 401 }) }
  if (!(await userHasCapability(user, cap))) {
    return { response: NextResponse.json({ error: 'Accès refusé' }, { status: 403 }) }
  }
  return { user }
}

export async function requirePageCapability(cap: Capability): Promise<AuthUser> {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  if (!(await userHasCapability(user, cap))) redirect('/')
  return user
}

/* ---- Gardes par rôle FIXE (gates non configurables : admin/manage_users) ---- */

export async function requireApiRole(allowed: Role[]): Promise<ApiGuard> {
  const user = await getAuthUser()
  if (!user) return { response: NextResponse.json({ error: 'Non authentifié' }, { status: 401 }) }
  if (!user.actif) return { response: NextResponse.json({ error: 'Compte désactivé' }, { status: 403 }) }
  if (!allowed.includes(user.role)) return { response: NextResponse.json({ error: 'Accès refusé' }, { status: 403 }) }
  return { user }
}

export async function requirePageRole(allowed: Role[]): Promise<AuthUser> {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  if (!user.actif || !allowed.includes(user.role)) redirect('/')
  return user
}

/** Gate fixe ADMIN/DEVELOPPEUR (gestion users + édition des permissions). Non configurable. */
export const ROLES_MANAGE_USERS: Role[] = ['ADMIN', 'DEVELOPPEUR']
