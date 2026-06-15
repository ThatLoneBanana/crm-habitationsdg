import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
import type { Role } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

/**
 * Garde de rôle côté serveur — sécurité réelle (pas cosmétique).
 * Utilisable dans les Server Components (requirePageRole) ET les routes API
 * (requireApiRole). Lit le rôle depuis Prisma via la session Supabase validée
 * (getUser, qui revalide le JWT — pas getSession).
 */

export interface AuthUser {
  id: string
  email: string
  role: Role
  actif: boolean
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return null
  return prisma.user.findUnique({
    where: { email: user.email },
    select: { id: true, email: true, role: true, actif: true },
  })
}

/** Routes API : renvoie { user } si autorisé, sinon { response } (401/403) à retourner tel quel. */
export async function requireApiRole(
  allowed: Role[]
): Promise<{ user: AuthUser; response?: undefined } | { user?: undefined; response: NextResponse }> {
  const user = await getAuthUser()
  if (!user) return { response: NextResponse.json({ error: 'Non authentifié' }, { status: 401 }) }
  if (!user.actif) return { response: NextResponse.json({ error: 'Compte désactivé' }, { status: 403 }) }
  if (!allowed.includes(user.role)) return { response: NextResponse.json({ error: 'Accès refusé' }, { status: 403 }) }
  return { user }
}

/** Server Components : redirige (/login si non connecté, / si rôle non autorisé). */
export async function requirePageRole(allowed: Role[]): Promise<AuthUser> {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  if (!user.actif || !allowed.includes(user.role)) redirect('/')
  return user
}

/* Politiques de rôle réutilisables (alignées sur le mapping historique). */
export const ROLES_VIEW_COSTING: Role[] = ['ADMIN', 'DEVELOPPEUR', 'COMPTABILITE', 'CHARGE_PROJET']
export const ROLES_VIEW_FEUILLES: Role[] = ['ADMIN', 'DEVELOPPEUR', 'COMPTABILITE', 'CHARGE_PROJET']
export const ROLES_EDIT_FEUILLES: Role[] = ['ADMIN', 'DEVELOPPEUR', 'COMPTABILITE']
export const ROLES_MANAGE_USERS: Role[] = ['ADMIN', 'DEVELOPPEUR']
