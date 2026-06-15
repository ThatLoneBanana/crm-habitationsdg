interface DocumentsTabProps {
  projectId: string;
}

// État vide propre (REF EmptyTab) — rendu final v1 tant que la fonctionnalité
// Documents n'est pas implémentée.
export function DocumentsTab({ projectId }: DocumentsTabProps) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)', padding: '48px 24px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
      <i className="ti ti-folder" aria-hidden="true" style={{ fontSize: 30, color: 'var(--text-disabled)' }} />
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 10 }}>Documents</div>
      <div style={{ fontSize: 12, marginTop: 3 }}>Contrat, plans, devis et photos de chantier.</div>
    </div>
  );
}
