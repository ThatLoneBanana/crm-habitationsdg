'use client';

import { useState } from 'react';
import { formatMontant } from '@/lib/utils';
import { calculateTaskStatus } from '@/lib/task-status';

/* Vue client — chrome téléphone à onglets (bottombar). Reçoit des données DÉJÀ
   filtrées public-safe (getProjetVueClient). Zone persistante en haut (header +
   statut) et pied contact toujours visibles ; corps qui change selon l'onglet. */

const STATUT: Record<string, { label: string; color: string }> = {
  completed:   { label: 'Terminé',  color: 'var(--task-termine)' },
  inProgress:  { label: 'En cours', color: 'var(--task-encours)' },
  preparation: { label: 'Bientôt',  color: 'var(--task-demain)' },
  noneStarted: { label: 'À venir',  color: 'var(--task-avenir)' },
};
const statutOf = (t: any): string => calculateTaskStatus(t.dateDebut, t.dateFin).status || 'noneStarted';

// Date HUMAINE dédiée client (« 16 juin 2026 »), composantes UTC → pas de
// décalage de fuseau (dates calendaires stockées à minuit UTC).
const MOIS_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
function formatDateClient(d: Date | string | null): string {
  if (!d) return '—';
  const date = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(date.getTime())) return '—';
  return `${date.getUTCDate()} ${MOIS_FR[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

type Onglet = 'fournisseurs' | 'extras' | 'cedule';
const ONGLETS: { id: Onglet; label: string; icon: string }[] = [
  { id: 'fournisseurs', label: 'Fournisseurs', icon: 'ti-tools' },
  { id: 'extras', label: 'Extras', icon: 'ti-receipt' },
  { id: 'cedule', label: 'Cédule', icon: 'ti-list-check' },
];

const sectionTitre: React.CSSProperties = { fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', marginBottom: 10 };

export function VueClientTabs({ projet, parametres }: { projet: any; parametres: any }) {
  const [onglet, setOnglet] = useState<Onglet>('cedule');

  // Présentation (à partir des données filtrées).
  const sched = [...(projet.taches || [])].sort(
    (a: any, b: any) => new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime()
  );
  const done = sched.filter((t: any) => statutOf(t) === 'completed').length;
  const avancement = sched.length > 0 ? Math.round((done / sched.length) * 100) : 0;
  const next =
    sched.find((t: any) => statutOf(t) === 'inProgress') ||
    sched.find((t: any) => statutOf(t) === 'preparation') ||
    sched.find((t: any) => statutOf(t) === 'noneStarted');

  const jr = projet.dateLivraison
    ? Math.ceil((new Date(projet.dateLivraison).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const extrasSignes = projet.extras || [];
  const totalExtrasSignes = extrasSignes.reduce((s: number, e: any) => s + Number(e.montant), 0);
  const fournisseurs = (projet.fournisseurs || []).map((pf: any) => pf.fournisseur);

  const nomCompagnie = parametres?.nomCompagnie ?? 'Habitations DG';
  const siteWeb = parametres?.siteWeb ?? 'habitations-dg.com';

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '28px 20px 40px', background: 'var(--bg-canvas)', minHeight: '100vh' }}>
      <div style={{ width: 390, maxWidth: '100%', height: 'min(800px, calc(100vh - 56px))', display: 'flex', flexDirection: 'column', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>

        {/* ── Persistant : en-tête de marque ── */}
        <div style={{ flexShrink: 0, background: 'var(--n-900)', color: '#fff', padding: '16px 18px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/habitationsdg-blanc.svg" alt="Habitations DG" style={{ height: 64 }} />
            <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 'var(--text-2xs)', fontWeight: 600, padding: '3px 9px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}>Espace client</span>
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Votre projet</div>
            <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 2 }}>{projet.adresse}</div>
            <div style={{ fontSize: 12.5, opacity: 0.75, marginTop: 2 }}>{projet.ville}</div>
          </div>
        </div>

        {/* ── Persistant : bloc statut ── */}
        <div style={{ flexShrink: 0, padding: '14px 18px', borderBottom: '1px solid var(--divider)' }}>
          {jr !== null && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: jr <= 14 ? 'var(--danger)' : 'var(--success-text)', fontVariantNumeric: 'tabular-nums' }}>
                {jr > 0 ? `Livraison dans ${jr} jours` : jr === 0 ? "Livraison aujourd'hui" : 'Livré'}
              </span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 7 }}>
            <span style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.018em', fontVariantNumeric: 'tabular-nums', color: 'var(--text-primary)' }}>{avancement}%</span>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>complété · {done}/{sched.length} étapes</span>
          </div>
          <div style={{ height: 6, background: 'var(--n-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${avancement}%`, background: 'var(--task-encours)', borderRadius: 'var(--radius-full)' }} />
          </div>
          {next && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '10px 12px', background: 'var(--info-tint)', borderRadius: 'var(--radius-md)' }}>
              <i className="ti ti-arrow-right" aria-hidden="true" style={{ fontSize: 16, color: 'var(--info)' }} />
              <div style={{ fontSize: 12.5 }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Prochaine étape :</span> <b style={{ fontWeight: 600 }}>{next.nom}</b>
              </div>
            </div>
          )}
        </div>

        {/* ── Corps de l'onglet (défile) ── */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          {onglet === 'cedule' && (
            <div style={{ padding: '14px 18px' }}>
              <div style={sectionTitre}>Étapes de votre construction</div>
              <div style={{ position: 'relative', paddingLeft: 18 }}>
                <div style={{ position: 'absolute', left: 4, top: 6, bottom: 6, width: 2, background: 'var(--divider)' }} />
                {sched.map((t: any, i: number) => {
                  const st = statutOf(t);
                  const c = STATUT[st]?.color ?? 'var(--task-avenir)';
                  return (
                    <div key={t.id ?? i} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '8px 0' }}>
                      <span style={{ position: 'absolute', left: -18, top: '50%', transform: 'translateY(-50%)', width: 10, height: 10, borderRadius: '50%', background: c, border: '2px solid var(--surface)', boxShadow: `0 0 0 1.5px ${c}` }} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: st === 'noneStarted' ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{t.nom}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{formatDateClient(t.dateDebut)} – {formatDateClient(t.dateFin)}</div>
                      </div>
                      <span style={{ fontSize: 10.5, fontWeight: 600, color: c, whiteSpace: 'nowrap' }}>{STATUT[st]?.label ?? 'À venir'}</span>
                    </div>
                  );
                })}
                {sched.length === 0 && (
                  <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', padding: '6px 0' }}>La cédule de votre projet sera bientôt disponible.</div>
                )}
              </div>
            </div>
          )}

          {onglet === 'extras' && (
            <div style={{ padding: '14px 18px' }}>
              <div style={sectionTitre}>Travaux additionnels signés</div>
              {extrasSignes.length === 0 ? (
                <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', padding: '6px 0' }}>Aucun travail additionnel signé.</div>
              ) : (
                <>
                  {extrasSignes.map((e: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '7px 0', fontSize: 12.5 }}>
                      <span style={{ color: 'var(--text-primary)' }}>{e.description}</span>
                      <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--success-text)', whiteSpace: 'nowrap' }}>{formatMontant(Number(e.montant))}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '8px 0 0', marginTop: 4, borderTop: '1px solid var(--divider)', fontSize: 12.5, fontWeight: 600 }}>
                    <span>Total</span>
                    <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--success-text)' }}>{formatMontant(totalExtrasSignes)}</span>
                  </div>
                </>
              )}
            </div>
          )}

          {onglet === 'fournisseurs' && (
            <div style={{ padding: '14px 18px' }}>
              <div style={sectionTitre}>Fournisseurs de votre chantier</div>
              {fournisseurs.length === 0 ? (
                <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', padding: '6px 0' }}>Les fournisseurs seront confirmés sous peu.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {fournisseurs.map((f: any, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                      <span style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--surface-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className="ti ti-tools" aria-hidden="true" style={{ fontSize: 16, color: 'var(--text-secondary)' }} />
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{f.nom}</div>
                        {f.metier ? <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{f.metier}</div> : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Persistant : pied contact ── */}
        <div style={{ flexShrink: 0, padding: '12px 18px', borderTop: '1px solid var(--divider)', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Une question sur votre projet&nbsp;?</div>
          <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 2, color: 'var(--text-primary)' }}>{nomCompagnie}</div>
          <a href={`https://${siteWeb}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--info-text)', textDecoration: 'none' }}>{siteWeb}</a>
        </div>

        {/* ── Bottombar (épinglée) ── */}
        <div style={{ flexShrink: 0, display: 'flex', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
          {ONGLETS.map((o) => {
            const actif = onglet === o.id;
            return (
              <button
                key={o.id}
                onClick={() => setOnglet(o.id)}
                aria-current={actif ? 'page' : undefined}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '9px 4px', background: 'transparent', border: 'none', cursor: 'pointer', color: actif ? 'var(--dg-red)' : 'var(--text-tertiary)' }}
              >
                <i className={`ti ${o.icon}`} aria-hidden="true" style={{ fontSize: 18 }} />
                <span style={{ fontSize: 10.5, fontWeight: actif ? 600 : 500 }}>{o.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
