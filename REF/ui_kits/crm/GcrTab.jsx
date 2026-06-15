/* Onglet GCR (page projet) : checklist administrative, 3 inspections, journal. */
(function () {
  const NS = window.HabitationsDGDesignSystem_408490;
  const { Card, CardHeader, Badge, ProgressBar } = NS;

  const INSP_STATUT = {
    PLANIFIE: { label: 'Planifiée', tone: 'info', icon: 'calendar-check' },
    FAIT: { label: 'Complétée', tone: 'success', icon: 'circle-check' },
    A_VENIR: { label: 'À venir', tone: 'neutral', icon: 'clock' },
  };

  function GcrTab({ projectId }) {
    const DGd = window.DG;
    const g = DGd.gcr(projectId);
    if (!g) return null;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16, alignItems: 'start' }}>
        {/* Colonne gauche */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Checklist */}
          <Card padding={false}>
            <CardHeader icon={<i className="ti ti-clipboard-check" style={{ color: 'var(--success)' }} />} title="Checklist administrative GCR"
              action={<span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>{g.done}/{g.total}</span>} />
            <div style={{ padding: '12px 14px 4px' }}>
              <ProgressBar value={Math.round(g.done / g.total * 100)} color="var(--success)" height={5} />
            </div>
            {g.checklist.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderBottom: i === g.checklist.length - 1 ? 'none' : '1px solid var(--divider)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 19, height: 19, borderRadius: 5, flexShrink: 0, background: c.fait ? 'var(--success)' : 'var(--surface)', border: c.fait ? 'none' : '1.5px solid var(--border-strong)', color: '#fff' }}>
                  {c.fait ? <i className="ti ti-check" style={{ fontSize: 13 }} /> : null}
                </span>
                <span style={{ fontSize: 12.5, fontWeight: 500, color: c.fait ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{c.label}</span>
                {!c.fait ? <span style={{ marginLeft: 'auto' }}><Badge tone="neutral">À faire</Badge></span> : null}
              </div>
            ))}
          </Card>

          {/* Inspections */}
          <Card padding={false}>
            <CardHeader icon={<i className="ti ti-shield-check" style={{ color: 'var(--info)' }} />} title="Inspections" />
            {g.inspections.map((ins, i) => {
              const st = INSP_STATUT[ins.statut];
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: i === g.inspections.length - 1 ? 'none' : '1px solid var(--divider)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 'var(--radius-md)', background: 'var(--surface-subtle)', border: '1px solid var(--border)', color: 'var(--text-tertiary)', flexShrink: 0 }}>
                    <i className={'ti ti-' + st.icon} style={{ fontSize: 17 }} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{ins.nom}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{DGd.dateLong(ins.date)} · {ins.insp}</div>
                  </div>
                  <Badge tone={st.tone} dot={ins.statut !== 'A_VENIR'}>{st.label}</Badge>
                </div>
              );
            })}
          </Card>
        </div>

        {/* Colonne droite — journal */}
        <Card padding={false}>
          <CardHeader icon={<i className="ti ti-history" />} title="Journal d'activité" />
          <div style={{ padding: '4px 0' }}>
            {DGd.JOURNAL.slice(0, 6).map((j, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 14px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: '50%', background: 'var(--surface-subtle)', border: '1px solid var(--border)', color: 'var(--text-tertiary)', flexShrink: 0 }}>
                  <i className={'ti ti-' + j.icon} style={{ fontSize: 14 }} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, lineHeight: 1.45 }}><b style={{ fontWeight: 600 }}>{j.qui}</b> <span style={{ color: 'var(--text-secondary)' }}>{j.action}</span></div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginTop: 1 }}>{j.quand}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  window.GcrTab = GcrTab;
})();
