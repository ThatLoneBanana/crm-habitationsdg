interface GCRTabProps {
  projectId: string;
}

// État « en développement » — le module GCR (garantie) référence des modèles
// Prisma (GCRChecklist/GCRInspection/GCRLog) absents du schéma, ce qui plantait
// au runtime. On affiche un état vide propre et on N'APPELLE PLUS aucune route
// GCR. Les routes /api/projets/gcr/* restent sur disque (à rebâtir plus tard)
// mais ne sont plus invoquées.
export function GCRTab({ projectId }: GCRTabProps) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)', padding: '48px 24px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
      <i className="ti ti-shield-check" aria-hidden="true" style={{ fontSize: 30, color: 'var(--text-disabled)' }} />
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 10 }}>GCR</div>
      <div style={{ fontSize: 12, marginTop: 3 }}>Module de garantie en développement — bientôt disponible.</div>
    </div>
  );
}
