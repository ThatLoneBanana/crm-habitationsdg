'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';

interface ListesTabProps {
  projectId: string;
  taches: any[];
  inspections: any[] | null;
  listes: any[] | null;
  loading: boolean;
  onRefresh: () => void;
}

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
const BADGE: Record<Tone, { bg: string; color: string }> = {
  neutral: { bg: 'var(--n-100)', color: 'var(--text-secondary)' },
  success: { bg: 'var(--success-tint)', color: 'var(--success-text)' },
  warning: { bg: 'var(--warning-tint)', color: 'var(--warning-text)' },
  danger: { bg: 'var(--danger-tint)', color: 'var(--danger-text)' },
  info: { bg: 'var(--info-tint)', color: 'var(--info-text)' },
};

const STATUT_LABEL: Record<string, { label: string; tone: Tone }> = {
  A_RESERVER: { label: 'À réserver', tone: 'warning' },
  RESERVE: { label: 'Réservée', tone: 'success' },
  COMPLETEE: { label: 'Complétée', tone: 'info' },
  NON_CONFORME: { label: 'Non conforme', tone: 'danger' },
};

const TYPE_LABEL: Record<string, string> = {
  GYPSE: 'Inspection gypse',
  FINITION: 'Inspection finition',
  AUTRE: 'Inspection (autre)',
};

// ── Listes simples (Lot 2) ──────────────────────────────────────────────────
const STATUT_LISTE: Record<string, { label: string; tone: Tone }> = {
  A_FAIRE: { label: 'À faire', tone: 'neutral' },
  EN_COURS: { label: 'En cours', tone: 'info' },
  COMPLETE: { label: 'Complété', tone: 'success' },
};
const STATUTS_LISTE = ['A_FAIRE', 'EN_COURS', 'COMPLETE'] as const;
const CATEGORIES: { cat: 'PERMIS' | 'ARPENTAGE' | 'AUTRE'; titre: string; icon: string }[] = [
  { cat: 'PERMIS', titre: 'Permis', icon: 'ti-file-certificate' },
  { cat: 'ARPENTAGE', titre: 'Arpentage', icon: 'ti-ruler-measure' },
  { cat: 'AUTRE', titre: 'Autres', icon: 'ti-list-details' },
];

function Badge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  const s = BADGE[tone];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 'var(--text-2xs)', fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--radius-full)', background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}

const inputStyle: React.CSSProperties = { width: '100%', fontSize: 12, padding: '6px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)', color: 'var(--text-primary)' };

export function ListesTab({ projectId, taches, inspections, listes, loading, onRefresh }: ListesTabProps) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  const tachesTriees = [...(taches || [])].sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0));

  const patchInspection = async (inspectionId: string, body: any) => {
    setBusyId(inspectionId);
    try {
      const res = await fetch(`/api/projets/${projectId}/inspections/${inspectionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Échec de la mise à jour'); }
      onRefresh();
      router.refresh();
    } catch (err: any) {
      alert('Erreur : ' + err.message);
    } finally {
      setBusyId(null);
    }
  };

  if (loading || inspections === null || listes === null) {
    return <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>Chargement…</div>;
  }

  return (
    <div className="space-y-6">
      {/* ── Inspections GCR (Lot 1) ── */}
      <section>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Inspections GCR</h3>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
          La date d'inspection suit l'étape de cédule ancrée. Réservez l'inspecteur ~3 semaines avant.
        </p>

        {inspections.length === 0 ? (
          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)', padding: '32px 24px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>
            Aucune inspection pour ce projet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {inspections.map((insp) => {
              const ancrable = insp.type === 'GYPSE' || insp.type === 'FINITION';
              const ancre = ancrable ? tachesTriees.find((t) => t.ancrageInspection === insp.type) : null;
              const st = STATUT_LABEL[insp.statut] ?? { label: insp.statut, tone: 'neutral' as Tone };
              const dateReserveeVal = insp.dateReservee ? new Date(insp.dateReservee).toISOString().split('T')[0] : '';
              const busy = busyId === insp.id;

              return (
                <div key={insp.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)', opacity: busy ? 0.6 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 14px', borderBottom: '1px solid var(--border)', background: 'var(--surface-subtle)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                      <i className="ti ti-shield-check" aria-hidden="true" style={{ fontSize: 15, color: 'var(--text-secondary)' }} />
                      {TYPE_LABEL[insp.type] ?? insp.type}
                    </span>
                    <Badge tone={st.tone}>{st.label}</Badge>
                  </div>

                  <div style={{ padding: '12px 14px', display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, alignItems: 'start' }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', marginBottom: 5 }}>Étape d'ancre</div>
                      {ancrable ? (
                        <>
                          {ancre ? (
                            <div style={{ fontSize: 13, color: 'var(--text-primary)', marginBottom: 6 }}>
                              {ancre.nom} <span style={{ color: 'var(--text-tertiary)' }}>· {ancre.dateDebut ? formatDate(ancre.dateDebut) : '—'}</span>
                            </div>
                          ) : (
                            <div style={{ fontSize: 13, color: 'var(--warning-text)', marginBottom: 6, fontWeight: 500 }}>
                              <i className="ti ti-alert-triangle" aria-hidden="true" style={{ marginRight: 5 }} />Ancre à définir
                            </div>
                          )}
                          <select
                            value={ancre?.id ?? ''}
                            disabled={busy}
                            onChange={(e) => patchInspection(insp.id, { ancreTacheId: e.target.value || null })}
                            style={inputStyle}
                          >
                            <option value="">— Choisir l'étape d'ancre —</option>
                            {tachesTriees.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.ordre}. {t.nom}{t.dateDebut ? ` — ${formatDate(t.dateDebut)}` : ''}
                              </option>
                            ))}
                          </select>
                        </>
                      ) : (
                        <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Inspection sans ancre de cédule.</div>
                      )}
                    </div>

                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', marginBottom: 5 }}>Date réservée</div>
                      <input
                        type="date"
                        value={dateReserveeVal}
                        disabled={busy}
                        onChange={(e) => patchInspection(insp.id, { dateReservee: e.target.value || null })}
                        style={inputStyle}
                      />
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 5 }}>
                        {insp.dateReservee ? 'Inspecteur réservé.' : 'Saisir une date la marque « réservée ».'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Listes simples (Lot 2) ── */}
      {CATEGORIES.map(({ cat, titre, icon }) => (
        <ListeSection
          key={cat}
          titre={titre}
          icon={icon}
          categorie={cat}
          items={listes.filter((l) => l.categorie === cat)}
          projectId={projectId}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}

// ── Section d'une catégorie de liste simple ────────────────────────────────
function ListeSection({ titre, icon, categorie, items, projectId, onRefresh }: {
  titre: string; icon: string; categorie: string; items: any[]; projectId: string; onRefresh: () => void;
}) {
  const [adding, setAdding] = useState(false);

  return (
    <section>
      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 14px', borderBottom: '1px solid var(--border)', background: 'var(--surface-subtle)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
            <i className={`ti ${icon}`} aria-hidden="true" style={{ fontSize: 15, color: 'var(--text-secondary)' }} />
            {titre}
          </span>
          <button
            onClick={() => setAdding((a) => !a)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '4px 9px', cursor: 'pointer' }}
          >
            <i className="ti ti-plus" aria-hidden="true" />Ajouter
          </button>
        </div>

        {items.length === 0 && !adding ? (
          <div style={{ padding: '18px 14px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 12 }}>Aucun élément.</div>
        ) : (
          <div>
            {items.map((item) => (
              <ItemRow key={item.id} item={item} projectId={projectId} onRefresh={onRefresh} />
            ))}
          </div>
        )}

        {adding && (
          <ItemForm
            projectId={projectId}
            categorie={categorie}
            onDone={() => { setAdding(false); onRefresh(); }}
            onCancel={() => setAdding(false)}
          />
        )}
      </div>
    </section>
  );
}

// ── Ligne d'item (affichage + édition inline) ──────────────────────────────
function ItemRow({ item, projectId, onRefresh }: { item: any; projectId: string; onRefresh: () => void }) {
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const st = STATUT_LISTE[item.statut] ?? { label: item.statut, tone: 'neutral' as Tone };

  const supprimer = async () => {
    if (!confirm(`Supprimer « ${item.nom} » ?`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/projets/${projectId}/listes/${item.id}`, { method: 'DELETE' });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Échec de la suppression'); }
      onRefresh();
    } catch (err: any) {
      alert('Erreur : ' + err.message);
      setBusy(false);
    }
  };

  if (editing) {
    return (
      <ItemForm
        projectId={projectId}
        categorie={item.categorie}
        item={item}
        onDone={() => { setEditing(false); onRefresh(); }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderTop: '1px solid var(--divider)', opacity: busy ? 0.6 : 1 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{item.nom}</span>
          <Badge tone={st.tone}>{st.label}</Badge>
          {item.date && <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>· {formatDate(item.date)}</span>}
        </div>
        {item.notes && <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 3 }}>{item.notes}</div>}
      </div>
      <button onClick={() => setEditing(true)} disabled={busy} title="Modifier" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 4 }}>
        <i className="ti ti-pencil" aria-hidden="true" style={{ fontSize: 15 }} />
      </button>
      <button onClick={supprimer} disabled={busy} title="Supprimer" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: 4 }}>
        <i className="ti ti-trash" aria-hidden="true" style={{ fontSize: 15 }} />
      </button>
    </div>
  );
}

// ── Formulaire d'ajout / édition d'un item ─────────────────────────────────
function ItemForm({ projectId, categorie, item, onDone, onCancel }: {
  projectId: string; categorie: string; item?: any; onDone: () => void; onCancel: () => void;
}) {
  const [nom, setNom] = useState(item?.nom ?? '');
  const [statut, setStatut] = useState(item?.statut ?? 'A_FAIRE');
  const [date, setDate] = useState(item?.date ? new Date(item.date).toISOString().split('T')[0] : '');
  const [notes, setNotes] = useState(item?.notes ?? '');
  const [busy, setBusy] = useState(false);

  const enregistrer = async () => {
    if (!nom.trim()) { alert('Le nom est requis.'); return; }
    setBusy(true);
    try {
      const url = item ? `/api/projets/${projectId}/listes/${item.id}` : `/api/projets/${projectId}/listes`;
      const method = item ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categorie, nom: nom.trim(), statut, date: date || null, notes: notes.trim() || null }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Échec de l\'enregistrement'); }
      onDone();
    } catch (err: any) {
      alert('Erreur : ' + err.message);
      setBusy(false);
    }
  };

  return (
    <div style={{ padding: '12px 14px', borderTop: '1px solid var(--divider)', background: 'var(--surface-subtle)', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8 }}>
        <input autoFocus placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} style={inputStyle} />
        <select value={statut} onChange={(e) => setStatut(e.target.value)} style={inputStyle}>
          {STATUTS_LISTE.map((s) => <option key={s} value={s}>{STATUT_LISTE[s].label}</option>)}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
      </div>
      <input placeholder="Notes (facultatif)" value={notes} onChange={(e) => setNotes(e.target.value)} style={inputStyle} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button onClick={onCancel} disabled={busy} style={{ fontSize: 12, padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)', cursor: 'pointer', color: 'var(--text-secondary)' }}>Annuler</button>
        <button onClick={enregistrer} disabled={busy} style={{ fontSize: 12, padding: '6px 12px', border: 'none', borderRadius: 'var(--radius)', background: 'var(--text-primary)', color: 'var(--surface)', cursor: 'pointer', fontWeight: 500 }}>
          {busy ? 'Enregistrement…' : item ? 'Enregistrer' : 'Ajouter'}
        </button>
      </div>
    </div>
  );
}
