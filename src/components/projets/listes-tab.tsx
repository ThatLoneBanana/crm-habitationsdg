'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';

interface ListesTabProps {
  projectId: string;
  taches: any[];
  inspections: any[] | null;
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

function Badge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  const s = BADGE[tone];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 'var(--text-2xs)', fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--radius-full)', background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}

export function ListesTab({ projectId, taches, inspections, loading, onRefresh }: ListesTabProps) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  const tachesTriees = [...(taches || [])].sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0));

  const patch = async (inspectionId: string, body: any) => {
    setBusyId(inspectionId);
    try {
      const res = await fetch(`/api/projets/${projectId}/inspections/${inspectionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Échec de la mise à jour');
      }
      onRefresh();
      router.refresh();
    } catch (err: any) {
      alert('Erreur : ' + err.message);
    } finally {
      setBusyId(null);
    }
  };

  if (loading || inspections === null) {
    return <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>Chargement des inspections…</div>;
  }

  return (
    <div className="space-y-6">
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
                  {/* En-tête : type + statut */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 14px', borderBottom: '1px solid var(--border)', background: 'var(--surface-subtle)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                      <i className="ti ti-shield-check" aria-hidden="true" style={{ fontSize: 15, color: 'var(--text-secondary)' }} />
                      {TYPE_LABEL[insp.type] ?? insp.type}
                    </span>
                    <Badge tone={st.tone}>{st.label}</Badge>
                  </div>

                  {/* Corps : ancre + date + réservation */}
                  <div style={{ padding: '12px 14px', display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, alignItems: 'start' }}>
                    {/* Ancre */}
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
                            onChange={(e) => patch(insp.id, { ancreTacheId: e.target.value || null })}
                            style={{ width: '100%', fontSize: 12, padding: '6px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)', color: 'var(--text-primary)' }}
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

                    {/* Réservation */}
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', marginBottom: 5 }}>Date réservée</div>
                      <input
                        type="date"
                        value={dateReserveeVal}
                        disabled={busy}
                        onChange={(e) => patch(insp.id, { dateReservee: e.target.value || null })}
                        style={{ width: '100%', fontSize: 12, padding: '6px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)', color: 'var(--text-primary)' }}
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
    </div>
  );
}
