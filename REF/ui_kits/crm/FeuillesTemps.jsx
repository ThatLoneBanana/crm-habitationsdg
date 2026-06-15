/* Écran — Feuilles de temps : Consultation · Saisie (grille hebdo) · Employés. */
(function () {
  const NS = window.HabitationsDGDesignSystem_408490;
  const { SegmentedControl, Badge, Avatar, Card, CardHeader, Button } = NS;
  const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];

  function heuresColor(total, max) {
    if (total > max) return 'var(--danger)';
    if (total >= max - 2) return 'var(--success)';
    if (total === 0) return 'var(--text-disabled)';
    return 'var(--warning)';
  }

  function FeuillesTemps() {
    const DGd = window.DG;
    const [tab, setTab] = React.useState('saisie');
    const rows = DGd.feuillesSemaine();
    const jours = DGd.semaineCourante();
    const totalSemaine = rows.reduce((s, r) => s + r.total, 0);

    return (
      <div style={{ padding: '22px 24px 40px', maxWidth: 1180 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18, gap: 14, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Feuilles de temps</h1>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>Semaine du {DGd.dateCourt(jours[0])} au {DGd.dateCourt(jours[4])} {jours[4].getFullYear()} · {totalSemaine.toLocaleString('fr-CA').replace('.', ',')} h saisies</p>
          </div>
          <SegmentedControl value={tab} onChange={setTab}
            options={[{ value: 'consult', label: 'Consultation', icon: 'table' }, { value: 'saisie', label: 'Saisie', icon: 'edit' }, { value: 'employes', label: 'Employés', icon: 'users' }]} />
        </div>

        {tab === 'saisie' ? (
          <Card padding={false}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button style={navBtn}><i className="ti ti-chevron-left" /></button>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Semaine du {DGd.dateCourt(jours[0])} {jours[0].getFullYear()}</span>
                <button style={navBtn}><i className="ti ti-chevron-right" /></button>
              </div>
              <Button size="sm" variant="primary" icon={<i className="ti ti-device-floppy" />}>Enregistrer</Button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 820, fontSize: 12.5 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ textAlign: 'left', padding: '8px 14px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)' }}>Employé</th>
                    <th style={{ textAlign: 'left', padding: '8px 14px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)' }}>Projet</th>
                    {jours.map((j, i) => (
                      <th key={i} style={{ textAlign: 'center', padding: '8px 6px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', color: 'var(--text-tertiary)', minWidth: 64 }}>
                        {JOURS[i]}<div style={{ fontSize: 9, fontWeight: 400, color: 'var(--text-disabled)' }}>{j.getDate()}</div>
                      </th>
                    ))}
                    <th style={{ textAlign: 'center', padding: '8px 12px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', color: 'var(--text-tertiary)' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, ri) => (
                    <tr key={r.id} style={{ borderBottom: ri === rows.length - 1 ? 'none' : '1px solid var(--divider)' }}>
                      <td style={{ padding: '7px 14px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                          <Avatar name={r.nom} size="sm" />
                          <span><span style={{ fontWeight: 600, display: 'block', whiteSpace: 'nowrap' }}>{r.nom}</span><span style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>{r.role}</span></span>
                        </span>
                      </td>
                      <td style={{ padding: '7px 14px' }}>{r.projet === '—' ? <span style={{ color: 'var(--text-disabled)' }}>—</span> : <Badge tone="neutral">{DGd.projets.find(p => p.id === r.projet)?.adresse.replace(/^\d+\s/, '') || r.projet}</Badge>}</td>
                      {r.heures.map((h, hi) => (
                        <td key={hi} style={{ padding: '5px 6px', textAlign: 'center' }}>
                          <input defaultValue={h === 0 ? '' : h.toString().replace('.', ',')} placeholder="—"
                            style={{ width: 46, height: 28, textAlign: 'center', fontSize: 12.5, fontVariantNumeric: 'tabular-nums', border: '1px solid var(--border)', borderRadius: 6, background: h === 0 ? 'var(--surface-subtle)' : 'var(--surface)', fontFamily: 'var(--font-sans)', color: 'var(--text-primary)' }} />
                        </td>
                      ))}
                      <td style={{ padding: '7px 12px', textAlign: 'center' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: heuresColor(r.total, r.max) }}>
                          {r.depasse ? <i className="ti ti-alert-triangle" style={{ fontSize: 13 }} /> : null}
                          {r.total.toString().replace('.', ',')} h
                        </span>
                        <div style={{ fontSize: 9.5, color: 'var(--text-disabled)', fontVariantNumeric: 'tabular-nums' }}>/ {r.max.toString().replace('.', ',')} max</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', gap: 16, padding: '9px 14px', borderTop: '1px solid var(--border)', background: 'var(--surface-subtle)', fontSize: 11, color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
              <Lg c="var(--success)" t="Semaine complète (≈ 36,5 h)" />
              <Lg c="var(--warning)" t="Sous le maximum" />
              <Lg c="var(--danger)" t="Dépassement > 36,5 h" />
            </div>
          </Card>
        ) : null}

        {tab === 'consult' ? (
          <Card padding={false}>
            <CardHeader icon={<i className="ti ti-table" />} title="Heures de la semaine" action={<span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{rows.length} employés</span>} />
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead><tr style={{ background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)' }}>
                {[['Employé', 'left'], ['Projet', 'left'], ['Heures', 'right'], ['Taux', 'right'], ['Coût main-d\u2019œuvre', 'right'], ['Statut', 'left']].map((h, i) => (
                  <th key={i} style={{ textAlign: h[1], padding: '9px 14px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{h[0]}</th>
                ))}
              </tr></thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--divider)' }}>
                    <td style={{ padding: '10px 14px' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Avatar name={r.nom} size="sm" /><span style={{ fontWeight: 600 }}>{r.nom}</span></span></td>
                    <td style={{ padding: '10px 14px' }}>{r.projet === '—' ? <span style={{ color: 'var(--text-disabled)' }}>—</span> : <Badge tone="neutral">{DGd.projets.find(p => p.id === r.projet)?.adresse.replace(/^\d+\s/, '') || r.projet}</Badge>}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: heuresColor(r.total, r.max) }}>{r.total.toString().replace('.', ',')} h</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary)' }}>{DGd.formatMontant(r.taux)}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{DGd.formatMontant(r.total * r.taux)}</td>
                    <td style={{ padding: '10px 14px' }}>{r.depasse ? <Badge tone="danger" dot>Dépassement</Badge> : r.sousMax ? <Badge tone="warning">Sous max</Badge> : <Badge tone="success" dot>Complète</Badge>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ) : null}

        {tab === 'employes' ? (
          <Card padding={false}>
            <CardHeader icon={<i className="ti ti-users" />} title="Employés" action={<Button size="sm" variant="outline" icon={<i className="ti ti-plus" />}>Ajouter</Button>} />
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead><tr style={{ background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)' }}>
                {[['Employé', 'left'], ['Rôle', 'left'], ['Taux horaire', 'right'], ['Max hebdo', 'right'], ['Statut', 'left']].map((h, i) => (
                  <th key={i} style={{ textAlign: h[1], padding: '9px 14px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{h[0]}</th>
                ))}
              </tr></thead>
              <tbody>
                {DGd.EMPLOYES.map((e, i) => (
                  <tr key={e.id} style={{ borderBottom: i === DGd.EMPLOYES.length - 1 ? 'none' : '1px solid var(--divider)', opacity: e.actif ? 1 : 0.55 }}>
                    <td style={{ padding: '10px 14px' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Avatar name={e.nom} size="sm" /><span style={{ fontWeight: 600 }}>{e.nom}</span></span></td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{e.role}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{DGd.formatMontant(e.taux)}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary)' }}>{e.max.toString().replace('.', ',')} h</td>
                    <td style={{ padding: '10px 14px' }}>{e.actif ? <Badge tone="success" dot>Actif</Badge> : <Badge tone="neutral">Inactif</Badge>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ) : null}
      </div>
    );
  }

  function Lg({ c, t }) { return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 9, height: 9, borderRadius: 2, background: c }} />{t}</span>; }
  const navBtn = { width: 26, height: 26, border: '1px solid var(--border)', borderRadius: 6, background: 'var(--surface)', cursor: 'pointer', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 };

  window.FeuillesTemps = FeuillesTemps;
})();
