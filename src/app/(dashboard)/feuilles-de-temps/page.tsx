import { requirePageCapability } from '@/lib/auth-guard'
import FeuillesClient from './FeuillesClient'

// Garde serveur : refuse réellement selon la capacité configurable (voirFeuilles),
// pas seulement le masquage du lien dans la sidebar.
export default async function FeuillesDeTempsPage() {
  await requirePageCapability('voirFeuilles')
  return <FeuillesClient />
}
