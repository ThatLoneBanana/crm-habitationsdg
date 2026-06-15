import { requirePageRole, ROLES_MANAGE_USERS } from '@/lib/auth-guard';
import TemplateEditClient from './TemplateEditClient';

// Éditeur de templates = fonction système, réservé ADMIN/DEVELOPPEUR (garde serveur réelle).
export default async function TemplateEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePageRole(ROLES_MANAGE_USERS);
  const { id } = await params;
  return <TemplateEditClient id={id} />;
}
