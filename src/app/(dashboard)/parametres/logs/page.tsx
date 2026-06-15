'use client';

import { ProtectedPage } from '@/components/auth/protected-page';

// État « en développement » — le journal d'activité s'appuyait sur le modèle
// Prisma GCRLog (absent du schéma) via /api/logs, ce qui plantait au runtime.
// On affiche un état vide propre, SANS aucun appel API. Accès toujours ADMIN/DEV.
export default function LogsPage() {
  return (
    <ProtectedPage requiredRoles={['ADMIN', 'DEVELOPPEUR']}>
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 20, color: 'var(--text-primary)' }}>Journal d'activité</h1>
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)', padding: '48px 24px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          <i className="ti ti-history" aria-hidden="true" style={{ fontSize: 30, color: 'var(--text-disabled)' }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 10 }}>Journal d'activité</div>
          <div style={{ fontSize: 12, marginTop: 3 }}>Module en développement — bientôt disponible.</div>
        </div>
      </div>
    </ProtectedPage>
  );
}
