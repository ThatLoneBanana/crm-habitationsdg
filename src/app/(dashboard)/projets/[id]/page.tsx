import { notFound, redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth-guard';
import { getProjetComplet, getParametres, getPeriodesNonOuvrables } from '@/lib/projet-data';
import ProjetDetailClient from './ProjetDetailClient';

// Server Component : auth SERVEUR, puis lecture projet + parametres EN PARALLÈLE
// (Prisma direct via lib/projet-data, aucun fetch HTTP) → fin du waterfall
// client. Les données descendent en props au composant client mince.
export default async function ProjetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Garde d'auth côté serveur AVANT tout accès données (sécurité réelle, plus
  // seulement le gating client).
  const user = await getAuthUser();
  if (!user || !user.actif) redirect('/login');

  const { id } = await params;
  const [projetData, parametresData, periodesData] = await Promise.all([
    getProjetComplet(id),
    getParametres(),
    getPeriodesNonOuvrables(),
  ]);
  if (!projetData) notFound();

  // Sérialiser Decimal/Date avant de passer au Client Component.
  const { phasePersistee, ...projetClean } = projetData;
  const projet = JSON.parse(JSON.stringify(projetClean));
  const parametres = parametresData ? JSON.parse(JSON.stringify(parametresData)) : null;
  const periodes = JSON.parse(JSON.stringify(periodesData ?? []));

  return <ProjetDetailClient projet={projet} parametres={parametres} periodes={periodes} />;
}
