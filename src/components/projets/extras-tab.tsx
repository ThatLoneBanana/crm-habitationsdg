'use client';

import { useState } from 'react';
import { Extra } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { ExtraDialog } from './extra-dialog';
import { formatMontant, formatDate } from '@/lib/utils';
import { Plus, Edit2, CheckCircle } from 'lucide-react';

interface ExtrasTabProps {
  extras: Extra[];
  projectId: string;
}

const TH: React.CSSProperties = {
  textAlign: 'left', padding: '9px 14px', fontSize: 10, fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', whiteSpace: 'nowrap',
};

function StatutBadge({ statut }: { statut: string }) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 'var(--text-2xs)', fontWeight: 600,
    lineHeight: 1, padding: '3px 8px', borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap',
  };
  if (statut === 'SIGNE') {
    return (
      <span style={{ ...base, background: 'var(--success-tint)', color: 'var(--success-text)' }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />Signé
      </span>
    );
  }
  if (statut === 'REFUSE') {
    return <span style={{ ...base, background: 'var(--danger-tint)', color: 'var(--danger-text)' }}>Refusé</span>;
  }
  return <span style={{ ...base, background: 'var(--warning-tint)', color: 'var(--warning-text)' }}>En attente</span>;
}

export function ExtrasTab({ extras, projectId }: ExtrasTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedExtra, setSelectedExtra] = useState<any>(null);

  const handleAddExtra = () => {
    setSelectedExtra(null);
    setDialogOpen(true);
  };

  const handleEditExtra = (extra: Extra) => {
    setSelectedExtra(extra);
    setDialogOpen(true);
  };

  const handleSignExtra = async (extra: Extra) => {
    try {
      const res = await fetch('/api/extras', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: extra.id, description: extra.description, montant: extra.montant, fournisseur: extra.fournisseur, statut: 'SIGNE' }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Erreur lors de la signature');
      }
      window.location.reload();
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  // Câblé à l'API réelle /api/extras (POST = nouveau, PUT = édition).
  const handleSaveExtra = async (data: any) => {
    const isEdit = !!selectedExtra?.id;
    try {
      const res = await fetch('/api/extras', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isEdit
            ? { id: selectedExtra.id, description: data.description, montant: data.montant, fournisseur: data.fournisseur, statut: selectedExtra.statut }
            : { projetId: projectId, description: data.description, montant: data.montant, fournisseur: data.fournisseur }
        ),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Erreur lors de la sauvegarde');
      }
      setDialogOpen(false);
      window.location.reload();
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  const formatDateFr = (d: Date | string | null) => formatDate(d);

  return (
    <div className="space-y-4">
      {/* Un seul bouton primaire (rouge DG par défaut) */}
      <div className="flex justify-end">
        <Button onClick={handleAddExtra} className="gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un extra
        </Button>
      </div>

      {/* Tableau sobre dans une card bordée (REF ExtrasTab) */}
      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--surface)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)' }}>
              <th style={TH}>Description</th>
              <th style={{ ...TH, textAlign: 'right' }}>Montant</th>
              <th style={TH}>Statut</th>
              <th style={TH}>Signé le</th>
              <th style={{ ...TH, textAlign: 'center' }} />
            </tr>
          </thead>
          <tbody>
            {extras.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-tertiary)' }}>Aucun extra</td></tr>
            ) : (
              extras.map((extra, i) => (
                <tr key={extra.id} style={{ borderBottom: i === extras.length - 1 ? 'none' : '1px solid var(--divider)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 500 }}>
                    {extra.description}
                    {extra.fournisseur ? <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}> · {extra.fournisseur}</span> : null}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>{formatMontant(extra.montant)}</td>
                  <td style={{ padding: '10px 14px' }}><StatutBadge statut={extra.statut} /></td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{formatDateFr(extra.signeLe)}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {extra.statut === 'EN_ATTENTE' && (
                      <button onClick={() => handleSignExtra(extra)} title="Signer" style={{ padding: 6, color: 'var(--success)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => handleEditExtra(extra)} title="Modifier" style={{ padding: 6, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Dialog Ajouter/Éditer extra — logique inchangée */}
      <ExtraDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        extra={selectedExtra}
        onSave={handleSaveExtra}
      />
    </div>
  );
}
