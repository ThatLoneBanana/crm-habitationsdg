import { getProjetVueClient } from '@/lib/projet-data';
import { VueClientTabs } from '@/components/projets/vue-client-tabs';

/* Vue client publique — mobile-first, lecture seule.
   Server Component : lecture serveur PUBLIC-SAFE (getProjetVueClient) — pas
   d'endpoint public, aucune donnée interne/financière ni PII client. Le rendu
   (chrome téléphone + bottombar à 3 onglets) est dans VueClientTabs (client),
   qui ne reçoit QUE les données déjà filtrées. /p/ reste exempté d'auth. */

export default async function VueClientPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const data = await getProjetVueClient(token);

  if (!data) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-canvas)', color: 'var(--danger)', fontSize: 13 }}>Projet introuvable.</div>;
  }

  // Sérialiser (Date/Decimal) avant de passer au Client Component. Les données
  // sont déjà restreintes à l'allowlist public-safe par getProjetVueClient.
  const projet = JSON.parse(JSON.stringify(data.projet));
  const parametres = data.parametres ? JSON.parse(JSON.stringify(data.parametres)) : null;

  return <VueClientTabs projet={projet} parametres={parametres} />;
}
