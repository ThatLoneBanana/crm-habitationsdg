'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { formatMontant, formatDate } from '@/lib/utils';
import { ProjetWithRelations } from '@/types';
import { ProjetsGantt } from '@/components/projets/ProjetsGantt';
import { ProjetIdentite } from '@/components/projets/ProjetIdentite';

/* — Primitives DG (tokens uniquement, aucune couleur hardcodée) —
   Alignées sur le design system (cf. DashboardClient) et la maquette
   REF/ui_kits/crm/ProjetsList.jsx. Présentation seulement. */

const PHASES: Record<string, { label: string; tint: string; ink: string; bar: string }> = {
  SIGNE:       { label: 'Signé',       tint: 'var(--phase-signe-tint)',       ink: 'var(--phase-signe-ink)',       bar: 'var(--phase-signe-bar)' },
  PREPARATION: { label: 'Préparation', tint: 'var(--phase-preparation-tint)', ink: 'var(--phase-preparation-ink)', bar: 'var(--phase-preparation-bar)' },
  CHANTIER:    { label: 'Chantier',    tint: 'var(--phase-chantier-tint)',    ink: 'var(--phase-chantier-ink)',    bar: 'var(--phase-chantier-bar)' },
  LIVRAISON:   { label: 'Livraison',   tint: 'var(--phase-livraison-tint)',   ink: 'var(--phase-livraison-ink)',   bar: 'var(--phase-livraison-bar)' },
  TERMINE:     { label: 'Terminé',     tint: 'var(--phase-termine-tint)',     ink: 'var(--phase-termine-ink)',     bar: 'var(--phase-termine-bar)' },
};
const PHASE_ORDER = ['SIGNE', 'PREPARATION', 'CHANTIER', 'LIVRAISON', 'TERMINE'];
function phaseConfig(phase: string | null | undefined) {
  return PHASES[phase ?? 'SIGNE'] ?? PHASES.SIGNE;
}

function PhaseBadge({ phase }: { phase: string | null | undefined }) {
  const p = phaseConfig(phase);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 'var(--text-2xs)', fontWeight: 600, lineHeight: 1, letterSpacing: '.01em', whiteSpace: 'nowrap', padding: '3px 8px', borderRadius: 'var(--radius-full)', background: p.tint, color: p.ink }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: p.bar, flex: '0 0 auto' }} />
      {p.label}
    </span>
  );
}

function ProgressBar({ value, phase }: { value: number; phase: string | null | undefined }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div style={{ height: 3, background: 'var(--n-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: phaseConfig(phase).bar, borderRadius: 'var(--radius-full)' }} />
    </div>
  );
}

function ContratBadge({ type }: { type: string | null | undefined }) {
  const entreprise = type === 'ENTREPRISE';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', fontSize: 'var(--text-2xs)', fontWeight: 600, lineHeight: 1,
      whiteSpace: 'nowrap', padding: '3px 8px', borderRadius: 'var(--radius-full)',
      background: entreprise ? 'var(--info-tint)' : 'transparent',
      color: entreprise ? 'var(--info-text)' : 'var(--text-secondary)',
      border: entreprise ? 'none' : '1px solid var(--border)',
    }}>
      {entreprise ? 'Entreprise' : 'Préliminaire'}
    </span>
  );
}

function FilterChip({ label, count, active, dotColor, onClick }: { label: string; count: number; active: boolean; dotColor?: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 11px',
        fontSize: 12, fontFamily: 'var(--font-sans)', cursor: 'pointer',
        border: `1px solid ${active ? 'var(--text-tertiary)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-full)',
        background: active ? 'var(--surface-subtle)' : 'var(--surface)',
        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
        fontWeight: active ? 600 : 500,
      }}
    >
      {dotColor ? <span style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor, flex: '0 0 auto' }} /> : null}
      {label}
      <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{count}</span>
    </button>
  );
}

function Avatar({ name, assigned }: { name: string; assigned: boolean }) {
  const initials = assigned
    ? (name.trim().split(/\s+/).slice(0, 2).map((s) => s.charAt(0).toUpperCase()).join('') || '–')
    : '–';
  return (
    <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--n-200)', color: 'var(--text-secondary)', fontSize: 10, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
      {initials}
    </span>
  );
}

function SegmentedControl<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string; icon: string }[] }) {
  return (
    <div style={{ display: 'inline-flex', padding: 3, gap: 2, background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, height: 26, padding: '0 10px', fontSize: 12, fontWeight: 600,
            border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: 'var(--font-sans)',
            background: active ? 'var(--surface)' : 'transparent', color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
            boxShadow: active ? 'var(--shadow-sm)' : 'none',
          }}>
            <i className={`ti ti-${o.icon}`} aria-hidden="true" style={{ fontSize: 14 }} />{o.label}
          </button>
        );
      })}
    </div>
  );
}

function EmptyState({ icon, title, message }: { icon: string; title: string; message: string }) {
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
      <i className={`ti ti-${icon}`} aria-hidden="true" style={{ fontSize: 30, color: 'var(--text-disabled)' }} />
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 10 }}>{title}</div>
      <div style={{ fontSize: 12, marginTop: 3 }}>{message}</div>
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  width: 26, height: 26, border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer',
  color: 'var(--text-tertiary)', fontSize: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
};

const TH: React.CSSProperties = {
  padding: '9px 14px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
  letterSpacing: '0.04em', color: 'var(--text-tertiary)', whiteSpace: 'nowrap',
};
const HEAD: [string, 'left' | 'right'][] = [
  ['Projet', 'left'], ['Phase', 'left'], ['Avancement', 'left'], ['Livraison', 'left'],
  ['Contrat', 'left'], ['Montant', 'right'], ['Vendeur', 'left'], ['', 'right'],
];

// Jours restants — logique de données préservée (calcul inchangé).
function joursRestants(dateLivraison: Date | string | null): number | null {
  if (!dateLivraison) return null;
  const now = new Date();
  const date = typeof dateLivraison === 'string' ? new Date(dateLivraison) : dateLivraison;
  return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function ProjetListPage() {
  const router = useRouter();
  const [projets, setProjets] = useState<ProjetWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // État de présentation — filtre/recherche/tri/vue en mémoire, AUCUN appel API supplémentaire.
  const [phase, setPhase] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'livraison' | 'avancement' | 'montant'>('livraison');
  const [vue, setVue] = useState<'liste' | 'gantt'>('liste');

  // Fetch unique de tous les projets (logique de données inchangée : même endpoint,
  // mêmes calculs serveur d'avancement et de phase).
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/projets');
        if (!res.ok) throw new Error('Erreur lors du chargement');
        const data = await res.json();
        setProjets(data.projets || []);
      } catch (err: any) {
        console.error('Erreur:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    projets.forEach((p) => { c[p.phase] = (c[p.phase] || 0) + 1; });
    return c;
  }, [projets]);

  const enChantier = useMemo(
    () => projets.filter((p) => ['CHANTIER', 'LIVRAISON'].includes(p.phase as string)).length,
    [projets]
  );

  // Filtre commun aux deux vues (phase + recherche).
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return projets.filter((p) => {
      if (phase && p.phase !== phase) return false;
      if (!term) return true;
      const hay = `${p.client?.prenom ?? ''} ${p.client?.nom ?? ''} ${p.adresse ?? ''} ${p.ville ?? ''}`.toLowerCase();
      return hay.includes(term);
    });
  }, [projets, phase, q]);

  // Liste : tri configurable. (Le Gantt trie toujours par livraison, en interne.)
  const rows = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sort === 'avancement') return ((b as any).avancement ?? 0) - ((a as any).avancement ?? 0);
      if (sort === 'montant') return Number(b.montantTotal ?? 0) - Number(a.montantTotal ?? 0);
      // livraison (défaut) : échéance la plus proche d'abord
      const da = a.dateLivraison ? new Date(a.dateLivraison).getTime() : Infinity;
      const db = b.dateLivraison ? new Date(b.dateLivraison).getTime() : Infinity;
      return da - db;
    });
  }, [filtered, sort]);

  // Suppression — mutation câblée préservée (DELETE + confirmation).
  const handleDelete = async (p: ProjetWithRelations, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le projet ${p.adresse}?`)) return;
    const res = await fetch(`/api/projets/${p.id}`, { method: 'DELETE' });
    if (res.ok) {
      location.reload();
    } else {
      const d = await res.json().catch(() => ({}));
      alert(d.error || 'Erreur lors de la suppression');
    }
  };

  return (
    <div style={{ padding: '22px 24px 40px' }}>
      {/* En-tête */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Projets</h1>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>
            {projets.length} projets · {enChantier} en chantier
          </p>
        </div>
        <Link href="/projets/nouveau">
          <Button className="gap-2">
            <i className="ti ti-plus" aria-hidden="true" />
            Nouveau projet
          </Button>
        </Link>
      </div>

      {/* Barre filtres + recherche + tri */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <FilterChip label="Tous" count={projets.length} active={phase == null} onClick={() => setPhase(null)} />
          {PHASE_ORDER.map((ph) => (
            <FilterChip key={ph} label={PHASES[ph].label} dotColor={PHASES[ph].bar} count={counts[ph] || 0} active={phase === ph} onClick={() => setPhase(ph)} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <i className="ti ti-search" aria-hidden="true" style={{ position: 'absolute', left: 9, fontSize: 15, color: 'var(--text-tertiary)' }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un projet, client, ville…"
              style={{ height: 32, width: 250, padding: '0 10px 0 30px', fontSize: 12, border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'var(--font-sans)', background: 'var(--surface)', color: 'var(--text-primary)' }}
            />
          </div>
          {vue === 'liste' && (
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as 'livraison' | 'avancement' | 'montant')}
              style={{ height: 32, padding: '0 10px', fontSize: 12, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface)', fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <option value="livraison">Trier : livraison</option>
              <option value="avancement">Trier : avancement</option>
              <option value="montant">Trier : montant</option>
            </select>
          )}
          <SegmentedControl<'liste' | 'gantt'>
            value={vue}
            onChange={setVue}
            options={[{ value: 'liste', label: 'Liste', icon: 'list' }, { value: 'gantt', label: 'Gantt', icon: 'timeline' }]}
          />
        </div>
      </div>

      {/* Vue : Liste (tableau) ou Gantt macro multi-projets */}
      {error ? (
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--surface)' }}>
          <EmptyState icon="alert-triangle" title="Erreur de chargement" message={error} />
        </div>
      ) : loading ? (
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)', padding: '48px 24px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>Chargement…</div>
      ) : vue === 'gantt' ? (
        <ProjetsGantt projets={filtered} onOpen={(slug) => router.push(`/projets/${slug}`)} />
      ) : (
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--surface)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)' }}>
                  {HEAD.map((h, i) => (
                    <th key={i} style={{ ...TH, textAlign: h[1] }}>{h[0]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((p, i) => {
                  const jr = joursRestants(p.dateLivraison);
                  const assigned = !!p.vendeur;
                  const vendeurNom = assigned ? `${p.vendeur!.prenom} ${p.vendeur!.nom}` : 'Non assigné';
                  const avancement = (p as any).avancement ?? 0;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => router.push(`/projets/${p.slug}`)}
                      style={{ borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--divider)', cursor: 'pointer' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-subtle)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* Projet */}
                      <td style={{ padding: '11px 14px' }}>
                        <ProjetIdentite adresse={p.adresse} ville={p.ville} client={`${p.client.prenom} ${p.client.nom}`} />
                      </td>
                      {/* Phase */}
                      <td style={{ padding: '11px 14px' }}><PhaseBadge phase={p.phase} /></td>
                      {/* Avancement */}
                      <td style={{ padding: '11px 14px', minWidth: 130 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1 }}><ProgressBar value={avancement} phase={p.phase} /></div>
                          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums', width: 30, textAlign: 'right' }}>{avancement}%</span>
                        </div>
                      </td>
                      {/* Livraison */}
                      <td style={{ padding: '11px 14px', whiteSpace: 'nowrap' }}>
                        <div style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--text-primary)' }}>{formatDate(p.dateLivraison)}</div>
                        {jr !== null && (
                          <div style={{ fontSize: 11, color: jr <= 14 ? 'var(--danger)' : 'var(--text-tertiary)', fontWeight: jr <= 14 ? 600 : 400, fontVariantNumeric: 'tabular-nums' }}>
                            {jr > 0 ? `${jr} j restants` : jr === 0 ? "aujourd'hui" : 'livré'}
                          </div>
                        )}
                      </td>
                      {/* Contrat */}
                      <td style={{ padding: '11px 14px' }}><ContratBadge type={p.typeContrat} /></td>
                      {/* Montant */}
                      <td style={{ padding: '11px 14px', textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
                        {formatMontant(Number(p.montantTotal), 0)}
                      </td>
                      {/* Vendeur */}
                      <td style={{ padding: '11px 14px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                          <Avatar name={vendeurNom} assigned={assigned} />
                          <span style={{ fontSize: 12, color: assigned ? 'var(--text-secondary)' : 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{vendeurNom}</span>
                        </span>
                      </td>
                      {/* Actions */}
                      <td style={{ padding: '11px 14px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <span style={{ display: 'inline-flex', gap: 2 }}>
                          <button title="Ouvrir" onClick={() => router.push(`/projets/${p.slug}`)} style={iconBtn}>
                            <i className="ti ti-arrow-right" aria-hidden="true" />
                          </button>
                          <button
                            title="Supprimer"
                            onClick={(e) => handleDelete(p, e)}
                            style={iconBtn}
                            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
                          >
                            <i className="ti ti-trash" aria-hidden="true" />
                          </button>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {rows.length === 0 && (
              <EmptyState
                icon="search-off"
                title={projets.length === 0 ? 'Aucun projet' : 'Aucun résultat'}
                message={projets.length === 0 ? "Aucun projet n'a encore été créé." : 'Aucun projet ne correspond à ce filtre ou à cette recherche.'}
              />
            )}
        </div>
      )}
    </div>
  );
}
