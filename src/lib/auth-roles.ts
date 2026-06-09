export enum UserRole {
  ADMIN = 'ADMIN',
  COMPTABILITE = 'COMPTABILITE',
  VENDEUR = 'VENDEUR',
  CHARGE_PROJET = 'CHARGE_PROJET',
  DEVELOPPEUR = 'DEVELOPPEUR',
}

export type Permission =
  | 'view_dashboard'
  | 'view_projets'
  | 'view_costing'
  | 'edit_costing'
  | 'view_feuilles_de_temps'
  | 'edit_feuilles_de_temps'
  | 'view_parametres'
  | 'edit_parametres'
  | 'view_gcr'
  | 'edit_gcr'
  | 'view_logs'
  | 'export_logs'
  | 'manage_users';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
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
    'manage_users',
  ],
  [UserRole.DEVELOPPEUR]: [
    'view_dashboard',
    'view_projets',
    'view_costing',
    'edit_costing',
    'view_feuilles_de_temps',
    'edit_feuilles_de_temps',
    'view_parametres',
    'view_gcr',
    'edit_gcr',
    'view_logs',
    'export_logs',
  ],
  [UserRole.COMPTABILITE]: [
    'view_dashboard',
    'view_projets',
    'view_costing',
    'view_feuilles_de_temps',
    'edit_feuilles_de_temps',
    'view_parametres',
  ],
  [UserRole.CHARGE_PROJET]: [
    'view_dashboard',
    'view_projets',
    'view_costing',
    'view_feuilles_de_temps',
    'view_parametres',
    'view_gcr',
    'edit_gcr',
  ],
  [UserRole.VENDEUR]: [
    'view_dashboard',
    'view_projets',
  ],
};

export function hasPermission(role: UserRole | null, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role as UserRole]?.includes(permission) ?? false;
}

export function hasRole(role: UserRole | null, ...requiredRoles: UserRole[]): boolean {
  if (!role) return false;
  return requiredRoles.includes(role as UserRole);
}
