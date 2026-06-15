import { requirePageCapability } from '@/lib/auth-guard'
import CostingClient from './CostingClient'

// Garde serveur : refuse réellement selon la capacité configurable (voirCosting),
// pas seulement le masquage du lien dans la sidebar.
export default async function CostingPage() {
  await requirePageCapability('voirCosting')
  return <CostingClient />
}
