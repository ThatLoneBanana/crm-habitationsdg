'use server';

import { getCurrentUser as getSupabaseUser } from './auth';
import { UserRole, Permission, hasPermission, hasRole } from './auth-roles';

export interface CurrentUser {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: UserRole;
  actif: boolean;
}

export interface CurrentUserWithPermissions extends CurrentUser {
  permissions: Permission[];
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const user = await getSupabaseUser();
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    nom: user.nom,
    prenom: user.prenom,
    role: user.role as UserRole,
    actif: user.actif,
  };
}

export async function getCurrentUserWithPermissions(): Promise<CurrentUserWithPermissions | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  return {
    ...user,
    permissions: Object.entries(require('./auth-roles').ROLE_PERMISSIONS[user.role] || []),
  };
}

export async function requirePermission(permission: Permission): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Non authentifié');
  }

  if (!hasPermission(user.role, permission)) {
    throw new Error('Accès refusé');
  }

  return user;
}

export async function requireRole(
  ...roles: UserRole[]
): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Non authentifié');
  }

  if (!hasRole(user.role, ...roles)) {
    throw new Error('Accès refusé');
  }

  return user;
}
