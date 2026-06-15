import { requirePageRole, ROLES_VIEW_FEUILLES } from '@/lib/auth-guard'
import FeuillesClient from './FeuillesClient'

// Garde serveur : refuse réellement les rôles non autorisés (ex. VENDEUR),
// pas seulement le masquage du lien dans la sidebar.
export default async function FeuillesDeTempsPage() {
  await requirePageRole(ROLES_VIEW_FEUILLES)
  return <FeuillesClient />
}
