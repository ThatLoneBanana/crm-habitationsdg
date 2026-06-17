'use client';

import { useEffect, useMemo, useRef } from 'react';
import { formatDate } from '@/lib/utils';

/* Gantt « macro » multi-projets pour /projets — une barre par projet.
   Ajout original (hors maquettes REF), tokens DG uniquement.
   Positionnement par dates (px/jour), colonnes hebdomadaires, ligne
   « aujourd'hui ». Conçu pour rester fluide jusqu'à ~42 projets (barres en
   position absolue, aucun rendu par cellule). */

const PHASE_BAR: Record<string, string> = {
  SIGNE: 'var(--phase-signe-bar)',
  PREPARATION: 'var(--phase-preparation-bar)',
  CHANTIER: 'var(--phase-chantier-bar)',
  LIVRAISON: 'var(--phase-livraison-bar)',
  TERMINE: 'var(--phase-termine-bar)',
};

const LEFT_W = 248;
const ROW_H = 34;
const HEADER_H = 38;
const WEEK_W = 30;
const BAR_H = 15;
const DAY = 86400000;

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function mondayOnOrBefore(d: Date): Date {
  const x = startOfDay(d);
  const day = x.getDay(); // 0=dim..6=sam
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  return x;
}

export function ProjetsGantt({ projets, onOpen }: { projets: any[]; onOpen: (slug: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const model = useMemo(() => {
    if (!projets || projets.length === 0) return null;

    const items = projets.map((p) => {
      const taches = (p.taches || []).filter((t: any) => t?.dateDebut);
      const debuts = taches.map((t: any) => new Date(t.dateDebut).getTime());
      const fins = taches.map((t: any) => new Date(t.dateFin).getTime());
      const liv = p.dateLivraison ? new Date(p.dateLivraison).getTime() : null;
      const debut = debuts.length ? Math.min(...debuts) : (liv ?? Date.now());
      const finBrut = liv ?? (fins.length ? Math.max(...fins) : debut);
      return { ...p, _debut: debut, _fin: Math.max(finBrut, debut) };
    }).sort((a, b) => {
      const da = a.dateLivraison ? new Date(a.dateLivraison).getTime() : Infinity;
      const db = b.dateLivraison ? new Date(b.dateLivraison).getTime() : Infinity;
      return da - db;
    });

    const minStart = Math.min(...items.map((i) => i._debut));
    const maxEnd = Math.max(...items.map((i) => i._fin));
    const rangeStart = mondayOnOrBefore(new Date(minStart - 3 * DAY)).getTime();
    const rangeEndMon = mondayOnOrBefore(new Date(maxEnd + 10 * DAY)).getTime();
    const numWeeks = Math.max(1, Math.round((rangeEndMon - rangeStart) / (7 * DAY)) + 1);
    const pxPerDay = WEEK_W / 7;
    const totalW = numWeeks * WEEK_W;

    const weeks = Array.from({ length: numWeeks }, (_, i) => rangeStart + i * 7 * DAY);

    // Regroupe les semaines par mois pour le bandeau supérieur.
    const months: { key: string; label: string; left: number; width: number }[] = [];
    weeks.forEach((wk, i) => {
      const d = new Date(wk);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const label = d.toLocaleDateString('fr-CA', { month: 'long', year: '2-digit' });
      const last = months[months.length - 1];
      if (last && last.key === key) last.width += WEEK_W;
      else months.push({ key, label, left: i * WEEK_W, width: WEEK_W });
    });

    const x = (t: number) => ((t - rangeStart) / DAY) * pxPerDay;
    const todayMs = startOfDay(new Date()).getTime();
    const todayLeft = todayMs >= rangeStart && todayMs <= rangeStart + numWeeks * 7 * DAY ? x(todayMs) : null;

    return { items, rangeStart, numWeeks, pxPerDay, totalW, weeks, months, x, todayLeft };
  }, [projets]);

  // Molette verticale → défilement horizontal (sur la zone Gantt).
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0 && el.scrollWidth > el.clientWidth) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [model]);

  // Centrage initial sur aujourd'hui.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !model || model.todayLeft == null) return;
    el.scrollLeft = Math.max(0, model.todayLeft - (el.clientWidth - LEFT_W) / 2);
  }, [model]);

  const recentrerAujourdhui = () => {
    const el = scrollRef.current;
    if (!el || !model || model.todayLeft == null) return;
    el.scrollTo({ left: Math.max(0, model.todayLeft - (el.clientWidth - LEFT_W) / 2), behavior: 'smooth' });
  };

  if (!model) {
    return (
      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)', padding: '48px 24px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
        <i className="ti ti-timeline" aria-hidden="true" style={{ fontSize: 30, color: 'var(--text-disabled)' }} />
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 10 }}>Aucun projet à afficher</div>
        <div style={{ fontSize: 12, marginTop: 3 }}>Aucun projet ne correspond à ce filtre.</div>
      </div>
    );
  }

  const { items, totalW, months, weeks, x, todayLeft } = model;
  const rowsH = items.length * ROW_H;

  return (
    <div>
      {/* Barre d'action légère */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button onClick={recentrerAujourdhui} disabled={todayLeft == null}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 11px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)', cursor: todayLeft == null ? 'default' : 'pointer', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-sans)', opacity: todayLeft == null ? 0.5 : 1 }}>
          <i className="ti ti-calendar-event" aria-hidden="true" />Aujourd'hui
        </button>
      </div>

      <style>{`
        .dg-gantt-scroll::-webkit-scrollbar { height: 13px; }
        .dg-gantt-scroll::-webkit-scrollbar-track { background: var(--surface-subtle); border-radius: 7px; }
        .dg-gantt-scroll::-webkit-scrollbar-thumb { background: var(--n-300); border-radius: 7px; border: 3px solid var(--surface-subtle); }
        .dg-gantt-scroll::-webkit-scrollbar-thumb:hover { background: var(--n-400); }
        .dg-gantt-scroll { scrollbar-color: var(--n-300) var(--surface-subtle); scrollbar-width: auto; }
      `}</style>

      <div ref={scrollRef} className="dg-gantt-scroll" style={{ overflowX: 'scroll', overflowY: 'hidden', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', width: LEFT_W + totalW, position: 'relative' }}>
          {/* Colonne de labels (figée) */}
          <div style={{ position: 'sticky', left: 0, zIndex: 3, width: LEFT_W, flex: '0 0 auto', background: 'var(--surface)', borderRight: '1px solid var(--border)', boxShadow: '2px 0 4px rgba(31,29,27,0.05)' }}>
            <div style={{ height: HEADER_H, borderBottom: '1px solid var(--border)', background: 'var(--surface-subtle)', display: 'flex', alignItems: 'flex-end', padding: '0 14px 7px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)' }}>Projet</div>
            {items.map((p, i) => (
              <div key={p.id} onClick={() => onOpen(p.slug)} title={`${p.adresse} — ${(p as any).avancement ?? 0}%`}
                style={{ height: ROW_H, padding: '0 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderBottom: i === items.length - 1 ? 'none' : '1px solid var(--divider)', cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-subtle)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.adresse}</div>
                <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.ville} · {p.client?.prenom} {p.client?.nom}</div>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div style={{ width: totalW, position: 'relative' }}>
            {/* En-tête mois + semaines */}
            <div style={{ height: HEADER_H, position: 'relative', borderBottom: '1px solid var(--border)', background: 'var(--surface-subtle)' }}>
              {months.map((m, i) => (
                <div key={i} style={{ position: 'absolute', left: m.left, top: 0, width: m.width, height: 18, borderLeft: '1px solid var(--border)', fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', padding: '3px 0 0 5px', whiteSpace: 'nowrap', overflow: 'hidden' }}>{m.label}</div>
              ))}
              {weeks.map((wk, i) => {
                const d = new Date(wk);
                return (
                  <div key={i} style={{ position: 'absolute', left: i * WEEK_W, top: 18, width: WEEK_W, height: HEADER_H - 18, borderLeft: '1px solid var(--divider)', background: d.getMonth() % 2 === 0 ? 'transparent' : 'var(--n-100)', fontSize: 8.5, color: 'var(--text-tertiary)', textAlign: 'center', paddingTop: 3, fontVariantNumeric: 'tabular-nums' }}>{d.getDate()}</div>
                );
              })}
            </div>

            {/* Corps : bandes de mois, quadrillage hebdo, barres, ligne auj. */}
            <div style={{ position: 'relative', height: rowsH }}>
              {months.map((m, i) => (i % 2 === 1 ? <div key={i} style={{ position: 'absolute', left: m.left, top: 0, width: m.width, bottom: 0, background: 'var(--surface-subtle)', opacity: 0.45 }} /> : null))}
              {weeks.map((wk, i) => <div key={i} style={{ position: 'absolute', left: i * WEEK_W, top: 0, bottom: 0, width: 1, background: 'var(--divider)', opacity: 0.5 }} />)}

              {items.map((p, i) => {
                const left = x(p._debut);
                const width = Math.max(6, x(p._fin) - x(p._debut));
                const av = (p as any).avancement ?? 0;
                const barColor = PHASE_BAR[p.phase] ?? PHASE_BAR.SIGNE;
                return (
                  <div key={p.id} style={{ position: 'absolute', top: i * ROW_H, left: 0, right: 0, height: ROW_H, borderBottom: i === items.length - 1 ? 'none' : '1px solid var(--divider)' }}>
                    <div onClick={() => onOpen(p.slug)} title={`${p.adresse} — ${av}% · livraison ${formatDate(p.dateLivraison)}`}
                      style={{ position: 'absolute', left, top: (ROW_H - BAR_H) / 2, width, height: BAR_H, background: barColor, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                      {width > 32 ? <span style={{ fontSize: 9.5, fontWeight: 700, color: '#fff', padding: '0 5px', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{av}%</span> : null}
                    </div>
                  </div>
                );
              })}

              {todayLeft != null && (
                <div style={{ position: 'absolute', left: todayLeft, top: 0, bottom: 0, width: 2, background: 'var(--task-today-line)', zIndex: 2 }}>
                  <span style={{ position: 'absolute', top: 0, left: -13, transform: 'translateY(-100%)', fontSize: 8.5, fontWeight: 700, color: '#fff', background: 'var(--task-today-line)', padding: '1px 4px', borderRadius: 3, whiteSpace: 'nowrap' }}>auj.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
