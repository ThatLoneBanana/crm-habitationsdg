'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface FournisseursTabProps {
  projectId: string;
  liens: any[]; // ProjetFournisseur { id, fournisseurId, budgetAlloue, confirme, fournisseur:{id,nom,metier} }
}

export function FournisseursTab({ projectId, liens }: FournisseursTabProps) {
  const router = useRouter();
  const [catalogue, setCatalogue] = useState<any[]>([]);
  const [choisi, setChoisi] = useState('');
  const [busy, setBusy] = useState<string | null>(null); // id du lien en cours, ou 'ADD'

  // Catalogue global des fournisseurs (pour le sélecteur d'ajout).
  useEffect(() => {
    fetch('/api/fournisseurs')
      .then((r) => (r.ok ? r.json() : { fournisseurs: [] }))
      .then((d) => setCatalogue(d.fournisseurs || []))
      .catch(() => {});
  }, []);

  const liesIds = new Set((liens || []).map((l) => l.fournisseurId));
  const dispo = catalogue.filter((f) => !liesIds.has(f.id));

  const apiLien = async (cle: string, init: RequestInit, url: string) => {
    setBusy(cle);
    try {
      const res = await fetch(url, init);
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Échec'); }
      router.refresh();
    } catch (err: any) {
      alert('Erreur : ' + err.message);
    } finally {
      setBusy(null);
    }
  };

  const lier = () => {
    if (!choisi) return;
    apiLien('ADD', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fournisseurId: choisi }) }, `/api/projets/${projectId}/fournisseurs`);
    setChoisi('');
  };
  const patch = (lienId: string, body: any) =>
    apiLien(lienId, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }, `/api/projets/${projectId}/fournisseurs/${lienId}`);
  const delier = (lienId: string, nom: string) => {
    if (!confirm(`Retirer ${nom} de ce projet ?`)) return;
    apiLien(lienId, { method: 'DELETE' }, `/api/projets/${projectId}/fournisseurs/${lienId}`);
  };

  const inputStyle: React.CSSProperties = { fontSize: 12, padding: '6px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)', color: 'var(--text-primary)' };

  return (
    <div className="space-y-4">
      <section>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Fournisseurs du projet</h3>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
          Lier les sous-traitants de ce chantier. « Visible par le client » les expose dans la vue client.
        </p>

        {/* Ajout */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <select value={choisi} onChange={(e) => setChoisi(e.target.value)} disabled={busy === 'ADD'} style={{ ...inputStyle, flex: 1, cursor: 'pointer' }}>
            <option value="">{dispo.length ? 'Ajouter un fournisseur…' : 'Tous les fournisseurs sont liés'}</option>
            {dispo.map((f) => (
              <option key={f.id} value={f.id}>{f.nom}{f.metier ? ` — ${f.metier}` : ''}</option>
            ))}
          </select>
          <button
            onClick={lier}
            disabled={!choisi || busy === 'ADD'}
            style={{ fontSize: 12, fontWeight: 500, padding: '0 14px', borderRadius: 'var(--radius)', border: 'none', background: 'var(--text-primary)', color: 'var(--surface)', cursor: !choisi || busy === 'ADD' ? 'not-allowed' : 'pointer', opacity: !choisi || busy === 'ADD' ? 0.5 : 1, whiteSpace: 'nowrap' }}
          >
            Lier
          </button>
        </div>

        {/* Liste des liens */}
        {(liens || []).length === 0 ? (
          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)', padding: '28px 24px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>
            Aucun fournisseur lié à ce projet.
          </div>
        ) : (
          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)', overflow: 'hidden' }}>
            {liens.map((l, i) => {
              const busyL = busy === l.id;
              return (
                <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderTop: i === 0 ? 'none' : '1px solid var(--divider)', opacity: busyL ? 0.6 : 1 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{l.fournisseur?.nom ?? '—'}</div>
                    {l.fournisseur?.metier ? <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{l.fournisseur.metier}</div> : null}
                  </div>

                  {/* Budget alloué (interne) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <input
                      type="number"
                      min="0"
                      defaultValue={l.budgetAlloue ?? ''}
                      placeholder="Budget"
                      disabled={busyL}
                      onBlur={(e) => {
                        const v = e.target.value;
                        const actuel = l.budgetAlloue ?? '';
                        if (String(v) !== String(actuel)) patch(l.id, { budgetAlloue: v });
                      }}
                      style={{ ...inputStyle, width: 100, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}
                    />
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>$</span>
                  </div>

                  {/* Confirme = visible par le client */}
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-secondary)', cursor: busyL ? 'default' : 'pointer', whiteSpace: 'nowrap' }}>
                    <input type="checkbox" checked={!!l.confirme} disabled={busyL} onChange={() => patch(l.id, { confirme: !l.confirme })} style={{ cursor: 'pointer' }} />
                    Visible par le client
                  </label>

                  <button onClick={() => delier(l.id, l.fournisseur?.nom ?? 'ce fournisseur')} disabled={busyL} title="Délier" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: 2, flexShrink: 0 }}>
                    <i className="ti ti-trash" aria-hidden="true" style={{ fontSize: 15 }} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
