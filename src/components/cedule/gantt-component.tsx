'use client';

import { useMemo } from 'react';

interface Task {
  id: string;
  ordre: number;
  nom: string;
  assigneA: string;
  jours: number;
  start: string; // ISO yyyy-mm-dd
  end: string;
}

const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juill.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const COLW = 26;
const ROWH = 38;
const LABELW = 248;

type Statut = 'termine' | 'encours' | 'demain' | 'avenir';
const STATUT_COLOR: Record<Statut, string> = {
  termine: 'var(--task-termine)',
  encours: 'var(--task-encours)',
  demain: 'var(--task-demain)',
  avenir: 'var(--task-avenir)',
};
const STATUT_LABEL: Record<Statut, string> = {
  termine: 'Terminé',
  encours: 'En cours',
  demain: 'Demain',
  avenir: 'À venir',
};

function toLocalDate(d: Date | string): Date {
  const date = new Date(d);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// LOGIQUE DE STATUT INCHANGÉE — mêmes règles que getStatut/task-status.ts.
// (fin passée = terminé ; aujourd'hui dans la barre = en cours ; débute demain ;
//  sinon à venir). On ne touche qu'à l'AFFICHAGE (tokens), pas au calcul.
function getStatut(dateDebut: Date | string, dateFin: Date | string): Statut {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const debut = toLocalDate(dateDebut);
  const fin = toLocalDate(dateFin);
  fin.setHours(23, 59, 59, 999);
  const demain = new Date(now);
  demain.setDate(now.getDate() + 1);

  if (fin < now) return 'termine';
  if (debut <= now && fin >= now) return 'encours';
  if (debut.getTime() === demain.getTime()) return 'demain';
  return 'avenir';
}

function buildColumns(minDate: Date, maxDate: Date): Date[] {
  const cols: Date[] = [];
  let cur = new Date(minDate);
  cur.setHours(0, 0, 0, 0);
  const end = new Date(maxDate);
  end.setHours(0, 0, 0, 0);
  while (cur <= end) {
    const w = cur.getDay();
    if (w !== 0 && w !== 6) cols.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return cols;
}

export default function GanttComponent({ tasks }: { tasks: Task[] }) {
  const data = useMemo(() => {
    if (tasks.length === 0) return null;

    const minDate = new Date(Math.min(...tasks.map(t => toLocalDate(t.start).getTime())));
    const maxDate = new Date(Math.max(...tasks.map(t => toLocalDate(t.end).getTime())));
    const cols = buildColumns(minDate, maxDate);

    const idxOf = (d: Date | string) => {
      const t = toLocalDate(d).getTime();
      for (let i = 0; i < cols.length; i++) if (cols[i].getTime() === t) return i;
      for (let i = 0; i < cols.length; i++) if (cols[i].getTime() >= t) return i;
      return cols.length - 1;
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let todayIdx = -1;
    for (let i = 0; i < cols.length; i++) {
      if (cols[i].getTime() === today.getTime()) { todayIdx = i; break; }
    }
    if (todayIdx === -1) {
      for (let i = 0; i < cols.length; i++) {
        if (cols[i].getTime() > today.getTime()) { todayIdx = i - 0.5; break; }
      }
    }

    // Teintes de semaine alternées (parité de numéro de semaine).
    const colTint = cols.map(d => {
      const onejan = new Date(d.getFullYear(), 0, 1);
      const wk = Math.ceil((((d.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
      return wk % 2 === 0;
    });

    // Regroupement des mois pour l'en-tête.
    const monthSpans: { m: number; span: number }[] = [];
    cols.forEach(d => {
      const last = monthSpans[monthSpans.length - 1];
      if (last && last.m === d.getMonth()) last.span++;
      else monthSpans.push({ m: d.getMonth(), span: 1 });
    });

    return { cols, idxOf, todayIdx, colTint, monthSpans };
  }, [tasks]);

  if (!data) {
    return (
      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface-subtle)', padding: 32, textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>
        Aucune étape définie
      </div>
    );
  }

  const { cols, idxOf, todayIdx, colTint, monthSpans } = data;
  const gridW = cols.length * COLW;

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--surface)' }}>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: LABELW + gridW }}>
          {/* En-tête — mois */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--surface-subtle)' }}>
            <div style={{ width: LABELW, flexShrink: 0, borderRight: '1px solid var(--border)', padding: '7px 12px', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)' }}>Étapes · {tasks.length}</span>
            </div>
            <div style={{ display: 'flex' }}>
              {monthSpans.map((ms, i) => (
                <div key={i} style={{ width: ms.span * COLW, borderRight: '1px solid var(--border)', padding: '6px 8px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'capitalize', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  {MOIS[ms.m]}
                </div>
              ))}
            </div>
          </div>

          {/* En-tête — jours */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: LABELW, flexShrink: 0, borderRight: '1px solid var(--border)' }} />
            <div style={{ display: 'flex', position: 'relative' }}>
              {cols.map((d, i) => {
                const estAuj = todayIdx === i;
                return (
                  <div key={i} style={{ width: COLW, borderRight: '1px solid var(--divider)', padding: '3px 0', fontSize: 9.5, textAlign: 'center', color: estAuj ? 'var(--dg-red)' : 'var(--text-tertiary)', fontWeight: estAuj ? 700 : 400, background: colTint[i] ? 'var(--n-50)' : 'transparent', fontVariantNumeric: 'tabular-nums' }}>
                    {d.getDate()}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lignes */}
          <div style={{ position: 'relative' }}>
            {/* Ligne « aujourd'hui » traversant toutes les lignes */}
            {todayIdx >= 0 ? (
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: LABELW + todayIdx * COLW + COLW / 2, width: 2, background: 'var(--task-today-line)', zIndex: 5, pointerEvents: 'none' }}>
                <span style={{ position: 'absolute', top: -1, left: -19, fontSize: 8, fontWeight: 700, color: '#fff', background: 'var(--task-today-line)', padding: '1px 4px', borderRadius: 3, whiteSpace: 'nowrap' }}>auj.</span>
              </div>
            ) : null}

            {tasks.map((e, i) => {
              const statut = getStatut(e.start, e.end);
              const start = idxOf(e.start);
              const span = Math.max(1, idxOf(e.end) - start + 1);
              const surBarre = e.assigneA && e.assigneA !== 'Interne' ? e.assigneA : e.nom;
              return (
                <div key={e.id} style={{ display: 'flex', height: ROWH, borderBottom: i === tasks.length - 1 ? 'none' : '1px solid var(--divider)' }}>
                  {/* Colonne de labels */}
                  <div style={{ width: LABELW, flexShrink: 0, borderRight: '1px solid var(--border)', padding: '0 12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--surface)' }}>
                    <div style={{ fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <span style={{ color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums', marginRight: 5 }}>{e.ordre}.</span>{e.nom}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {e.jours}j ouvr.{e.assigneA && e.assigneA !== 'Interne' ? ' · ' + e.assigneA : ''}
                    </div>
                  </div>

                  {/* Zone des barres */}
                  <div style={{ position: 'relative', display: 'flex' }}>
                    {cols.map((d, ci) => (
                      <div key={ci} style={{ width: COLW, borderRight: '1px solid var(--divider)', background: colTint[ci] ? 'var(--n-50)' : 'transparent' }} />
                    ))}
                    <div title={STATUT_LABEL[statut]} style={{ position: 'absolute', left: start * COLW + 2, width: span * COLW - 4, height: 18, top: (ROWH - 18) / 2, borderRadius: 5, background: STATUT_COLOR[statut], boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', paddingLeft: 6, zIndex: 2 }}>
                      {span >= 3 ? <span style={{ fontSize: 9, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden' }}>{surBarre}</span> : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Légende */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '9px 14px', borderTop: '1px solid var(--border)', background: 'var(--surface-subtle)', flexWrap: 'wrap' }}>
        {(['termine', 'encours', 'demain', 'avenir'] as Statut[]).map(s => (
          <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
            <span style={{ width: 11, height: 11, borderRadius: 3, background: STATUT_COLOR[s] }} />{STATUT_LABEL[s]}
          </span>
        ))}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
          <span style={{ width: 2, height: 13, background: 'var(--task-today-line)' }} />Aujourd'hui
        </span>
      </div>
    </div>
  );
}
