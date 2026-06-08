'use client';

import { useMemo } from 'react';

interface Task {
  id: string;
  name: string;
  start: string;
  end: string;
  progress: number;
  assigné: string;
  workingDays: number;
}

interface GanttComponentProps {
  tasks: Task[];
  onTaskUpdate?: (taskId: string, newEnd: string, originalEnd: string) => void;
}

const MOIS = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'aoû', 'sep', 'oct', 'nov', 'déc'];
const MS = 86400000; // millisecondes par jour

function getWorkingDayColumns(minDate: Date, maxDate: Date) {
  const columns: { date: Date; dayOfWeek: number; isMonday: boolean }[] = [];
  let current = new Date(minDate);

  while (current <= maxDate) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      columns.push({
        date: new Date(current),
        dayOfWeek: day,
        isMonday: day === 1,
      });
    }
    current.setDate(current.getDate() + 1);
  }

  return columns;
}

// Convertis en date locale pour éviter le décalage UTC
function toLocalDate(d: Date | string): Date {
  const date = new Date(d)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function getStatut(dateDebut: Date | string, dateFin: Date | string): 'termine' | 'encours' | 'preparation' | 'avenir' {
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const debut = toLocalDate(dateDebut)
  const fin = toLocalDate(dateFin)
  fin.setHours(23, 59, 59, 999)

  const demain = new Date(now)
  demain.setDate(now.getDate() + 1)

  if (fin < now) return 'termine'
  if (debut <= now && fin >= now) return 'encours'
  if (debut.getTime() === demain.getTime()) return 'preparation'
  return 'avenir'
}

const couleurBarre: Record<string, string> = {
  termine: '#639922',
  encours: '#1D9E75',
  preparation: '#378ADD',
  avenir: '#B4B2A9',
}

function getStatusColor(dateDebut: Date, dateFin: Date): string {
  const statut = getStatut(dateDebut, dateFin)
  return couleurBarre[statut]
}

export default function GanttComponent({ tasks }: GanttComponentProps) {
  const { minDate, maxDate, workingDayColumns, taskBars, todayIndex } = useMemo(() => {
    if (tasks.length === 0) {
      return { minDate: null, maxDate: null, workingDayColumns: [], taskBars: [], todayIndex: -1 };
    }

    // Calcul des dates min/max
    const dateStart = new Date(Math.min(...tasks.map(t => new Date(t.start).getTime())));
    const dateEnd = new Date(Math.max(...tasks.map(t => new Date(t.end).getTime())));
    dateStart.setHours(0, 0, 0, 0);
    dateEnd.setHours(0, 0, 0, 0);

    const columns = getWorkingDayColumns(dateStart, dateEnd);

    // Trouver la position d'aujourd'hui
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let todayIndex = -1;
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].date.toDateString() === today.toDateString()) {
        todayIndex = i;
        break;
      }
    }

    // Calcul du total de millisecondes
    const totalMs = dateEnd.getTime() - dateStart.getTime();

    const bars = tasks.map((task) => {
      const debut = new Date(task.start);
      const fin = new Date(task.end);
      debut.setHours(0, 0, 0, 0);
      fin.setHours(0, 0, 0, 0);

      // Position left
      const leftPct = (debut.getTime() - dateStart.getTime()) / totalMs * 100;

      // Largeur basée sur dureeJours en millisecondes
      const dureeMs = task.workingDays * MS;
      const widthPct = Math.max(dureeMs / totalMs * 100, 1.2); // minimum 1.2%

      const color = getStatusColor(debut, fin);

      return {
        ...task,
        leftPct,
        widthPct,
        color,
        debut,
        fin,
      };
    });

    return { minDate: dateStart, maxDate: dateEnd, workingDayColumns: columns, taskBars: bars, todayIndex };
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
        Aucune étape définie
      </div>
    );
  }

  const columnWidth = workingDayColumns.length > 0 ? Math.max(30, 800 / workingDayColumns.length) : 30;

  // Grouper par semaine pour les couleurs
  let weekIndex = 0;
  const columnColors = workingDayColumns.map((col, idx) => {
    if (col.isMonday && idx > 0) weekIndex++;
    return weekIndex % 2 === 0 ? '#ffffff' : '#f5f5f5';
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        {/* En-tête avec mois */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ width: '200px', flexShrink: 0 }}></div>
          <div style={{ display: 'flex', flex: 1 }}>
            {workingDayColumns.length > 0 && (
              <div style={{ display: 'flex', width: '100%' }}>
                {Array.from({ length: workingDayColumns.length }).map((_, idx) => {
                  const col = workingDayColumns[idx];
                  const prevCol = idx > 0 ? workingDayColumns[idx - 1] : null;
                  const showMonth = idx === 0 || (prevCol && prevCol.date.getMonth() !== col.date.getMonth());

                  return (
                    <div
                      key={idx}
                      style={{
                        width: `${columnWidth}px`,
                        borderRight: '1px solid #e5e7eb',
                        padding: '4px',
                        fontSize: '11px',
                        textAlign: 'center',
                        color: '#6b7280',
                        minHeight: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {showMonth && `${MOIS[col.date.getMonth()]}`}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Ligne jours */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
          <div style={{ width: '200px', flexShrink: 0, borderRight: '1px solid #e5e7eb', padding: '8px', fontWeight: '600', fontSize: '12px' }}>
          </div>
          <div style={{ display: 'flex', flex: 1 }}>
            {workingDayColumns.map((col, idx) => (
              <div
                key={idx}
                style={{
                  width: `${columnWidth}px`,
                  borderRight: '1px solid #e5e7eb',
                  padding: '4px',
                  fontSize: '10px',
                  textAlign: 'center',
                  color: '#374151',
                  fontWeight: '500',
                }}
              >
                {col.date.getDate()}
              </div>
            ))}
          </div>
        </div>

        {/* Lignes des étapes */}
        {taskBars.map((task) => (
          <div key={task.id} style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', height: '68px', alignItems: 'center' }}>
            <div
              style={{
                width: '200px',
                flexShrink: 0,
                borderRight: '1px solid #e5e7eb',
                padding: '12px',
                fontSize: '13px',
                backgroundColor: '#f9fafb',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <p style={{ fontWeight: '500', color: '#111827', margin: '0 0 4px 0' }}>
                {task.name}
              </p>
              <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 2px 0' }}>
                {task.workingDays}j ouvr.
              </p>
              {task.assigné && (
                <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>
                  👤 {task.assigné}
                </p>
              )}
            </div>

            <div style={{ position: 'relative', width: '100%', height: '68px', overflow: 'hidden' }}>
              {/* Grille de fond alternée */}
              {workingDayColumns.map((col, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    width: `${columnWidth}px`,
                    height: '100%',
                    left: `${idx * columnWidth}px`,
                    backgroundColor: columnColors[idx],
                    borderRight: '1px solid #e5e7eb',
                  }}
                />
              ))}

              {/* Ligne rouge "aujourd'hui" */}
              {todayIndex >= 0 && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${todayIndex * columnWidth}px`,
                    top: 0,
                    bottom: 0,
                    width: '2px',
                    backgroundColor: '#ef4444',
                    zIndex: 10,
                  }}
                  title="Aujourd'hui"
                />
              )}

              {/* Barre étape */}
              <div
                style={{
                  position: 'absolute',
                  left: `${task.leftPct}%`,
                  width: `${task.widthPct}%`,
                  height: '22px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  borderRadius: '4px',
                  backgroundColor: task.color,
                  zIndex: 1,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
