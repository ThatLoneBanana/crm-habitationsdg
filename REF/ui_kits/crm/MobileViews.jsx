/* Écran — Vue mobile : dashboard + page projet adaptés (Nicolas dans son camion). */
(function () {
  const NS = window.HabitationsDGDesignSystem_408490;
  const { MetricCard, PhaseBadge, ProgressBar, Badge, StatusDot, SegmentedControl } = NS;

  function Phone({ children, title }) {
    return (
      <div style={{ width: 380, maxWidth: '100%', flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', marginBottom: 10, textAlign: 'center' }}>{title}</div>
        <div style={{ width: '100%', height: 720, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </div>
    );
  }

  // Mobile top bar with hamburger (collapsed sidebar)
  function TopBar({ title }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <button style={{ width: 32, height: 32, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: 18 }}><i className="ti ti-menu-2" /></button>
        <img src="../../assets/habitationsdg-icon.svg" alt="DG" style={{ height: 22 }} />
        <span style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{title}</span>
        <button style={{ width: 32, height: 32, border: 'none', background: 'transparent', color: 'var(--text-secondary)', fontSize: 19, position: 'relative' }}>
          <i className="ti ti-bell" /><span style={{ position: 'absolute', top: 4, right: 5, width: 7, height: 7, borderRadius: '50%', background: 'var(--danger)', border: '1.5px solid var(--surface)' }} /></button>
      </div>
    );
  }
  // Bottom tab bar
  function BottomBar({ active }) {
    const items = [['Accueil', 'home'], ['Projets', 'building-community'], ['Carte', 'map-2'], ['Plus', 'dots']];
    return (
      <div style={{ display: 'flex', borderTop: '1px solid var(--border)', flexShrink: 0, background: 'var(--surface)' }}>
        {items.map(([l, ic], i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '8px 0', color: i === active ? 'var(--dg-red)' : 'var(--text-tertiary)' }}>
            <i className={'ti ti-' + ic} style={{ fontSize: 20 }} />
            <span style={{ fontSize: 9.5, fontWeight: i === active ? 600 : 500 }}>{l}</span>
          </div>
        ))}
      </div>
    );
  }

  function MobileViews() {
    const DGd = window.DG;
    const pj = DGd.projets.find(p => p.id === 'p7');
    const sched = DGd.buildSchedule(pj.dateLivraison);
    const jr = DGd.joursRestants(pj.dateLivraison);
    const next = DGd.prochaineEtape(pj);
    const [ptab, setPtab] = React.useState('apercu');

    return (
      <div style={{ padding: '22px 24px 40px' }}>
        <div style={{ marginBottom: 18 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Vue mobile</h1>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>Nicolas consulte sur son téléphone dans son camion — sidebar repliée en barre du bas, métriques empilées, Gantt remplacé par une liste d'étapes scrollable.</p>
        </div>

        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Dashboard mobile */}
          <Phone title="Dashboard">
            <TopBar title="Bonjour Nicolas" />
            <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 10 }}>{DGd.jourLong(DGd.TODAY)}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <MetricCard icon={<i className="ti ti-building-community" />} label="Projets actifs" value="7" />
                <MetricCard icon={<i className="ti ti-alert-triangle" />} label="Alertes" value="3" sub="1 urgente" tone="danger" />
                <MetricCard icon={<i className="ti ti-currency-dollar" />} label="En chantier" value="2,1 M$" tone="success" />
                <MetricCard icon={<i className="ti ti-cash" />} label="À recevoir" value="187 k$" tone="info" />
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', margin: '4px 0 8px' }}>Alertes prioritaires</div>
              <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                {DGd.alertes.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderBottom: i === DGd.alertes.length - 1 ? 'none' : '1px solid var(--divider)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: a.type === 'urgent' ? 'var(--danger)' : 'var(--warning)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 500 }}>{a.titre}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.sous}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', margin: '16px 0 8px' }}>Projets</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {DGd.projets.slice(0, 4).map(p => (
                  <div key={p.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.client}</div>
                        <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>{p.adresse}</div>
                      </div>
                      <PhaseBadge phase={p.phase} />
                    </div>
                    <div style={{ marginTop: 8 }}><ProgressBar value={p.avancement} phase={p.phase} /></div>
                  </div>
                ))}
              </div>
            </div>
            <BottomBar active={0} />
          </Phone>

          {/* Page projet mobile */}
          <Phone title="Page projet">
            <TopBar title="Projet" />
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <div style={{ padding: '14px 14px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>{pj.adresse}</h2>
                  <PhaseBadge phase={pj.phase} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>{pj.ville} · {pj.client}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', margin: '14px 0' }}>
                  <div style={{ background: 'var(--surface)', padding: '10px 12px' }}><div style={mLbl}>Avancement</div><div style={{ fontSize: 18, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{pj.avancement}%</div></div>
                  <div style={{ background: 'var(--surface)', padding: '10px 12px' }}><div style={mLbl}>Livraison</div><div style={{ fontSize: 13, fontWeight: 600, color: jr <= 14 ? 'var(--danger)' : 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{jr} j</div></div>
                </div>
              </div>
              <div style={{ padding: '0 14px' }}>
                <div style={{ borderBottom: '1px solid var(--border)', display: 'flex', gap: 2, overflowX: 'auto' }}>
                  {[['apercu', 'Aperçu'], ['cedule', 'Cédule'], ['extras', 'Extras'], ['paiements', 'Paiements']].map(([id, l]) => (
                    <button key={id} onClick={() => setPtab(id)} style={{ padding: '8px 10px', fontSize: 12.5, fontWeight: ptab === id ? 600 : 500, color: ptab === id ? 'var(--text-primary)' : 'var(--text-secondary)', background: 'none', border: 'none', borderBottom: ptab === id ? '2px solid var(--accent)' : '2px solid transparent', marginBottom: -1, whiteSpace: 'nowrap', cursor: 'pointer' }}>{l}</button>
                  ))}
                </div>
              </div>
              <div style={{ padding: 14 }}>
                {ptab === 'cedule' || ptab === 'apercu' ? (
                  <>
                    {ptab === 'apercu' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', marginBottom: 12, background: 'var(--info-tint)', borderRadius: 'var(--radius-md)', fontSize: 12 }}>
                        <i className="ti ti-arrow-right" style={{ color: 'var(--info)' }} /><span><span style={{ color: 'var(--text-tertiary)' }}>Prochaine :</span> <b>{next.nom}</b></span>
                      </div>
                    ) : null}
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', marginBottom: 8 }}>Étapes {ptab === 'apercu' ? 'récentes' : '(liste)'}</div>
                    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                      {sched.filter(e => e.statut !== 'avenir' || e.ordre <= 32).slice(26, 34).map((e, i, arr) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderBottom: i === arr.length - 1 ? 'none' : '1px solid var(--divider)' }}>
                          <StatusDot status={e.statut} pulse={e.statut === 'encours'} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12.5, fontWeight: 500 }}>{e.ordre}. {e.nom}</div>
                            <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{DGd.dateCourt(e.dateDebut)} – {DGd.dateCourt(e.dateFin)} · {e.assigneA}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'center', marginTop: 10 }}>Le Gantt complet est disponible sur ordinateur</div>
                  </>
                ) : (
                  <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', textAlign: 'center', padding: '30px 0' }}>Contenu « {ptab} »</div>
                )}
              </div>
            </div>
            <BottomBar active={1} />
          </Phone>
        </div>
      </div>
    );
  }

  const mLbl = { fontSize: 9.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', marginBottom: 3 };

  window.MobileViews = MobileViews;
})();
