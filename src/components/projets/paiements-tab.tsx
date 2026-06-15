'use client';

import { useState } from 'react';
import { Paiement } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { formatMontant, formatDate } from '@/lib/utils';
import { Plus, Check, X } from 'lucide-react';

interface PaiementsTabProps {
  paiements: Paiement[];
  typeContrat: string;
  projectId: string;
}

const TH: React.CSSProperties = {
  textAlign: 'left', padding: '9px 14px', fontSize: 10, fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', whiteSpace: 'nowrap',
};

function StatutBadge({ recu }: { recu: boolean }) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 'var(--text-2xs)', fontWeight: 600,
    lineHeight: 1, padding: '3px 8px', borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap',
  };
  return recu ? (
    <span style={{ ...base, background: 'var(--success-tint)', color: 'var(--success-text)' }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />Reçu
    </span>
  ) : (
    <span style={{ ...base, background: 'var(--warning-tint)', color: 'var(--warning-text)' }}>Attendu</span>
  );
}

export function PaiementsTab({ paiements: initialPaiements, typeContrat, projectId }: PaiementsTabProps) {
  const [paiements, setPaiements] = useState(initialPaiements);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dateRecu, setDateRecu] = useState('');

  // Mutation préservée — PUT /api/paiements
  const handleMarkAsReceived = async (paiement: Paiement) => {
    const date = dateRecu || new Date().toISOString().split('T')[0];
    try {
      const res = await fetch('/api/paiements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: paiement.id, recu: true, dateRecu: date }),
      });
      if (!res.ok) throw new Error('Erreur lors de la sauvegarde');
      setPaiements(paiements.map((p) => (p.id === paiement.id ? { ...p, recu: true, dateRecu: new Date(date) } : p)));
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
    setEditingId(null);
    setDateRecu('');
  };

  const handleMarkAsNotReceived = async (paiement: Paiement) => {
    try {
      const res = await fetch('/api/paiements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: paiement.id, recu: false, dateRecu: null }),
      });
      if (!res.ok) throw new Error('Erreur lors de la sauvegarde');
      setPaiements(paiements.map((p) => (p.id === paiement.id ? { ...p, recu: false, dateRecu: null } : p)));
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  return (
    <div className="space-y-4">
      {/* Fonctionnalité voulue mais pas encore bâtie -> désactivée */}
      <div className="flex justify-end">
        <Button className="gap-2" disabled title="Bientôt disponible">
          <Plus className="w-4 h-4" />
          Ajouter un paiement
        </Button>
      </div>

      {/* Tableau sobre dans une card bordée (REF PaiementsTab) */}
      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--surface)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)' }}>
              <th style={TH}>Description</th>
              <th style={{ ...TH, textAlign: 'right' }}>Montant</th>
              <th style={TH}>Statut</th>
              <th style={TH}>Date</th>
              <th style={{ ...TH, textAlign: 'right' }} />
            </tr>
          </thead>
          <tbody>
            {paiements.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-tertiary)' }}>Aucun paiement défini</td></tr>
            ) : (
              paiements.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: i === paiements.length - 1 ? 'none' : '1px solid var(--divider)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 500 }}>
                    {p.description}
                    {p.pourcentage ? <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}> · {p.pourcentage}%</span> : null}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 500, color: p.recu ? 'var(--success-text)' : 'var(--text-primary)' }}>
                    {formatMontant(p.montant)}
                  </td>
                  <td style={{ padding: '10px 14px' }}><StatutBadge recu={p.recu} /></td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                    {p.recu ? formatDate(p.dateRecu) : p.datePrevu ? formatDate(p.datePrevu) : '—'}
                  </td>
                  <td style={{ padding: '8px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {p.recu ? (
                      <Button size="sm" variant="outline" onClick={() => handleMarkAsNotReceived(p)}>Annuler reçu</Button>
                    ) : editingId === p.id ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <input
                          type="date"
                          value={dateRecu}
                          onChange={(e) => setDateRecu(e.target.value)}
                          style={{ padding: '4px 6px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 12 }}
                        />
                        <button onClick={() => handleMarkAsReceived(p)} title="Confirmer" style={{ padding: 5, color: 'var(--success)', background: 'none', border: 'none', cursor: 'pointer' }}><Check className="w-4 h-4" /></button>
                        <button onClick={() => setEditingId(null)} title="Annuler" style={{ padding: 5, color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}><X className="w-4 h-4" /></button>
                      </span>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => { setEditingId(p.id); setDateRecu(new Date().toISOString().split('T')[0]); }}>Marquer reçu</Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
