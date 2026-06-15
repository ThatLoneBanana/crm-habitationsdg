import { requirePageRole, ROLES_VIEW_COSTING } from '@/lib/auth-guard'
import CostingClient from './CostingClient'

// Garde serveur : refuse réellement les rôles non autorisés (ex. VENDEUR),
// pas seulement le masquage du lien dans la sidebar.
export default async function CostingPage() {
  await requirePageRole(ROLES_VIEW_COSTING)
  return <CostingClient />
}
