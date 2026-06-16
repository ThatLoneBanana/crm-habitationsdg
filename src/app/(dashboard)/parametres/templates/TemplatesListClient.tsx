'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageHeader, Card, Button, Badge } from '@/components/dg';

interface Template {
  id: string;
  nom: string;
  type: 'JUMELE' | 'MAISON' | 'MULTILOGEMENT';
  actif: boolean;
  etapes: { id: string; nom: string }[];
}

const TYPE_LABEL: Record<string, string> = { JUMELE: 'Jumelé', MAISON: 'Maison', MULTILOGEMENT: 'Multilogement' };

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Template | null>(null);

  const loadTemplates = async () => {
    try {
      const res = await fetch('/api/templates');
      if (!res.ok) throw new Error('Erreur chargement templates');
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTemplates(); }, []);

  // #8-A — Dupliquer : copie structurelle, collision de nom gérée côté serveur.
  const handleDuplicate = async (t: Template) => {
    setBusyId(t.id);
    try {
      const res = await fetch(`/api/templates/${t.id}/duplicate`, { method: 'POST' });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Échec de la duplication'); }
      await loadTemplates();
    } catch (err: any) {
      alert('Erreur : ' + err.message);
    } finally {
      setBusyId(null);
    }
  };

  // #8-B — Supprimer : DELETE template + ses étapes (cascade). Aucun projet/historique touché.
  const handleDelete = async () => {
    if (!confirmDelete) return;
    setBusyId(confirmDelete.id);
    try {
      const res = await fetch(`/api/templates/${confirmDelete.id}`, { method: 'DELETE' });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Échec de la suppression'); }
      setConfirmDelete(null);
      await loadTemplates();
    } catch (err: any) {
      alert('Erreur : ' + err.message);
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <div style={{ padding: '22px 24px', color: 'var(--text-secondary)' }}>Chargement...</div>;

  return (
    <div style={{ padding: '22px 24px 40px' }}>
      <PageHeader
        title="Templates de cédule"
        subtitle="Gérez les templates d'étapes pour chaque type de projet"
        action={<Button><i className="ti ti-plus" aria-hidden="true" />Nouveau template</Button>}
      />

      {templates.length === 0 ? (
        <Card style={{ padding: 32 }}>
          <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>
            Aucun template créé. Les templates par défaut seront créés automatiquement.
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {templates.map((template) => (
            <Card key={template.id} style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{template.nom}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
                    <Badge tone="info">{TYPE_LABEL[template.type] || template.type}</Badge>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{template.etapes.length} étapes</span>
                    <Badge tone={template.actif ? 'success' : 'neutral'}>{template.actif ? 'Actif' : 'Inactif'}</Badge>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <Link href={`/parametres/templates/${template.id}`} style={{ textDecoration: 'none' }}>
                    <Button variant="outline"><i className="ti ti-edit" aria-hidden="true" />Modifier</Button>
                  </Link>
                  <Button variant="outline" disabled={busyId === template.id} onClick={() => handleDuplicate(template)}>
                    <i className="ti ti-copy" aria-hidden="true" />{busyId === template.id ? 'Duplication…' : 'Dupliquer'}
                  </Button>
                  <Button variant="danger" disabled={busyId === template.id} onClick={() => setConfirmDelete(template)}>
                    <i className="ti ti-trash" aria-hidden="true" />Supprimer
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* #8-B — Modal de confirmation de suppression (nomme le template) */}
      {confirmDelete && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}
          onClick={() => { if (!busyId) setConfirmDelete(null); }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: 24, maxWidth: 460, width: '100%', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Supprimer le template</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 12 }}>
              Supprimer le template <b>« {confirmDelete.nom} »</b> ({TYPE_LABEL[confirmDelete.type] || confirmDelete.type}, {confirmDelete.etapes.length} étapes)&nbsp;?
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8 }}>
              Le template et ses étapes seront supprimés définitivement. Les projets existants et leur historique (cédules, feuilles de temps, dépenses) ne sont <b>pas</b> affectés. Action irréversible.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 24 }}>
              <Button variant="outline" disabled={!!busyId} onClick={() => setConfirmDelete(null)}>Annuler</Button>
              <Button variant="primary" disabled={!!busyId} onClick={handleDelete} style={{ background: 'var(--danger)' }}>
                {busyId ? 'Suppression…' : 'Supprimer définitivement'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
