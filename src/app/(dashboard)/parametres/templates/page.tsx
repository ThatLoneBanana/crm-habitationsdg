import { requirePageRole, ROLES_MANAGE_USERS } from '@/lib/auth-guard';
import TemplatesListClient from './TemplatesListClient';

// Éditeur de templates = fonction système, réservé ADMIN/DEVELOPPEUR (garde serveur réelle).
export default async function TemplatesPage() {
  await requirePageRole(ROLES_MANAGE_USERS);
  return <TemplatesListClient />;
}
