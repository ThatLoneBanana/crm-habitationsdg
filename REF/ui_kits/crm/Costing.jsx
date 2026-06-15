/* Écran — Costing : page globale (tous projets) + onglet costing dans la page projet. */
(function () {
  const NS = window.HabitationsDGDesignSystem_408490;
  const { Card, CardHeader, Badge, ProgressBar, PhaseBadge } = NS;

  const SANTE_COLOR = { success: 'var(--success)', warning: 'var(--warning)', danger: 'var(--danger)' };
  const SANTE_TINT = { success: 'var(--success-tint)', warning: 'var(--warning-tint)', danger: 'var(--danger-tint)' };
  const SANTE_LABEL = { success: 'Saine', warning: 'À surveiller', danger: 'Sous pression' };

  function pct(x) { return (x * 100).toFixed(1).replace('.', ',') + ' %'; }

  function BigStat({ label, value, tone, icon, sub }) {
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '15px 17px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>
          <i className={'ti ti-' + icon} style={{ fontSize: 15, color: 'var(--text-tertiary)' }} />{label}
        </div>
        <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.018em', color: tone ? SANTE_COLOR[tone] : 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
        {sub ? <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 3 }}>{sub}</div> : null}
      </div>
    );
  }

  /* ---- Page globale ---- */
  function CostingGlobal({ onOpenProject }) {
    const DGd = window.DG;
    const g = DGd.costingGlobal();
    return (
      <div style={{ padding: '22px 24px 40px', maxWidth: 1280 }}>
        <div style={{ marginBottom: 18 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Costing</h1>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>Santé financière de tous les projets actifs · {g.rows.length} projets</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
          <BigStat icon="trending-up" label="Revenus totaux" value={DGd.formatMontantCourt(g.revenus)} sub="contrats + extras signés" />
          <BigStat icon="trending-down" label="Dépenses" value={DGd.formatMontantCourt(g.depenses)} sub="budget engagé" />
          <BigStat icon="businessplan" label="Profit projeté" value={DGd.formatMontantCourt(g.profit)} tone={g.sante} />
          <BigStat icon="percentage" label="Marge moyenne" value={pct(g.marge)} tone={g.sante} sub={SANTE_LABEL[g.sante]} />
        </div>

        <Card padding={false}>
          <CardHeader icon={<i className="ti ti-chart-bar" />} title="Profitabilité par projet" />
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)' }}>
                {[['Projet', 'left'], ['Phase', 'left'], ['Revenus', 'right'], ['Dépenses', 'right'], ['Profit', 'right'], ['Marge', 'right'], ['Santé', 'left']].map((h, i) => (
                  <th key={i} style={{ textAlign: h[1], padding: '9px 14px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{h[0]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {g.rows.map((r, i) => (
                <tr key={r.id} onClick={() => onOpenProject && onOpenProject(r.id)}
                  style={{ borderBottom: i === g.rows.length - 1 ? 'none' : '1px solid var(--divider)', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-subtle)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ fontWeight: 600 }}>{r.projet}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{r.client}</div>
                  </td>
                  <td style={{ padding: '11px 14px' }}><PhaseBadge phase={r.phase} /></td>
                  <td style={{ padding: '11px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{DGd.formatMontant(r.revenus, 0)}</td>
                  <td style={{ padding: '11px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary)' }}>{DGd.formatMontant(r.depenses, 0)}</td>
                  <td style={{ padding: '11px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: SANTE_COLOR[r.sante] }}>{DGd.formatMontant(r.profit, 0)}</td>
                  <td style={{ padding: '11px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: SANTE_COLOR[r.sante] }}>{pct(r.marge)}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 500, color: SANTE_COLOR[r.sante] }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: SANTE_COLOR[r.sante] }} />{SANTE_LABEL[r.sante]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  }

  /* ---- Onglet costing dans la page projet ---- */
  function CostingTab({ projectId }) {
    const DGd = window.DG;
    const c = DGd.costing(projectId);
    if (!c) return null;
    const maxCat = Math.max(...c.cats.map(x => x.budget));
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Résumé financier */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          <BigStat icon="trending-up" label="Revenus" value={DGd.formatMontant(c.revenus, 0)} sub={`contrat ${DGd.formatMontantCourt(c.revenusContrat)} + extras ${DGd.formatMontantCourt(c.revenusExtras)}`} />
          <BigStat icon="trending-down" label="Dépenses (budget)" value={DGd.formatMontant(c.depensesTotal, 0)} sub={`${DGd.formatMontant(c.depensesReel, 0)} engagé`} />
          <BigStat icon="businessplan" label="Profit projeté" value={DGd.formatMontant(c.profit, 0)} tone={c.sante} />
          <BigStat icon="percentage" label="Marge" value={pct(c.marge)} tone={c.sante} sub={SANTE_LABEL[c.sante]} />
        </div>

        {/* Barre engagé vs budget */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
            <span style={{ fontWeight: 600 }}>Dépenses engagées</span>
            <span style={{ color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>{DGd.formatMontant(c.depensesReel, 0)} / {DGd.formatMontant(c.depensesTotal, 0)} budget</span>
          </div>
          <div style={{ height: 9, background: 'var(--n-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: Math.min(100, c.depensesReel / c.depensesTotal * 100) + '%', background: c.depensesReel > c.depensesTotal ? 'var(--danger)' : 'var(--success)', borderRadius: 'var(--radius-full)' }} />
          </div>
        </Card>

        {/* Dépenses par catégorie + main d'œuvre intégrée */}
        <Card padding={false}>
          <CardHeader icon={<i className="ti ti-list-details" />} title="Dépenses par catégorie"
            action={<span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>budget · engagé · écart</span>} />
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <tbody>
              {c.cats.map((cat, i) => {
                const isMO = /Main/.test(cat.nom);
                return (
                  <tr key={i} style={{ borderBottom: i === c.cats.length - 1 ? 'none' : '1px solid var(--divider)', background: isMO ? 'var(--surface-subtle)' : 'transparent' }}>
                    <td style={{ padding: '9px 14px', width: 30 }}><i className={'ti ti-' + cat.icon} style={{ fontSize: 16, color: isMO ? 'var(--info)' : 'var(--text-tertiary)' }} /></td>
                    <td style={{ padding: '9px 14px', fontWeight: isMO ? 600 : 500, whiteSpace: 'nowrap' }}>
                      {cat.nom}{isMO ? <span style={{ marginLeft: 7 }}><Badge tone="info">feuilles de temps</Badge></span> : null}
                    </td>
                    <td style={{ padding: '9px 14px', width: '34%' }}>
                      <div style={{ height: 6, background: 'var(--n-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: Math.round(cat.budget / maxCat * 100) + '%', background: isMO ? 'var(--info)' : 'var(--n-400)', borderRadius: 'var(--radius-full)' }} />
                      </div>
                    </td>
                    <td style={{ padding: '9px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{DGd.formatMontant(cat.budget, 0)}</td>
                    <td style={{ padding: '9px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, whiteSpace: 'nowrap' }}>{DGd.formatMontant(cat.reel, 0)}</td>
                    <td style={{ padding: '9px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', color: cat.ecart > 0 ? 'var(--danger)' : 'var(--success-text)' }}>{cat.ecart > 0 ? '+' : ''}{DGd.formatMontant(cat.ecart, 0)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid var(--border)', background: 'var(--surface-subtle)' }}>
                <td></td>
                <td style={{ padding: '10px 14px', fontWeight: 700 }}>Total</td>
                <td></td>
                <td style={{ padding: '10px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: 'var(--text-secondary)' }}>{DGd.formatMontant(c.depensesTotal, 0)}</td>
                <td style={{ padding: '10px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>{DGd.formatMontant(c.depensesReel, 0)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </Card>
      </div>
    );
  }

  window.CostingGlobal = CostingGlobal;
  window.CostingTab = CostingTab;
})();
