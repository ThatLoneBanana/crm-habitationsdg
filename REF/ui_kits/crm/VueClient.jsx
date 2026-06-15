/* Écran — Vue client publique : mobile-first, lecture seule, étapes visibles client. */
(function () {
  const NS = window.HabitationsDGDesignSystem_408490;
  const { PhaseBadge, ProgressBar, StatusDot, Badge } = NS;

  function PhoneFrame({ children }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '28px 20px 40px', background: 'var(--bg-canvas)', minHeight: '100%' }}>
        <div style={{ width: 390, maxWidth: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', alignSelf: 'flex-start' }}>
          {children}
        </div>
      </div>
    );
  }

  function VueClient() {
    const DGd = window.DG;
    const p = DGd.projets.find(x => x.id === 'p1');
    const sched = DGd.buildSchedule(p.dateLivraison).filter(e => e.visibleClient);
    const jr = DGd.joursRestants(p.dateLivraison);
    const done = sched.filter(e => e.statut === 'termine').length;
    const next = sched.find(e => e.statut === 'encours') || sched.find(e => e.statut === 'demain') || sched.find(e => e.statut === 'avenir');

    const STATUT_LABEL = { termine: 'Terminé', encours: 'En cours', demain: 'Bientôt', avenir: 'À venir' };

    return (
      <PhoneFrame>
        {/* En-tête marque */}
        <div style={{ background: 'var(--n-900)', color: '#fff', padding: '16px 18px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <img src="../../assets/habitationsdg-icon.svg" alt="DG" style={{ height: 26 }} />
            <Badge tone="outline" pill>Espace client</Badge>
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Votre projet</div>
            <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 2 }}>{p.adresse}</div>
            <div style={{ fontSize: 12.5, opacity: 0.75, marginTop: 2 }}>{p.ville}</div>
          </div>
        </div>

        {/* Statut */}
        <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--divider)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <PhaseBadge phase={p.phase} />
            <span style={{ fontSize: 12, fontWeight: 600, color: jr <= 14 ? 'var(--danger)' : 'var(--success-text)', fontVariantNumeric: 'tabular-nums' }}>Livraison dans {jr} jours</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 7 }}>
            <span style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.018em', fontVariantNumeric: 'tabular-nums' }}>{p.avancement}%</span>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>complété · {done}/{sched.length} étapes visibles</span>
          </div>
          <ProgressBar value={p.avancement} phase={p.phase} height={6} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, padding: '10px 12px', background: 'var(--info-tint)', borderRadius: 'var(--radius-md)' }}>
            <i className="ti ti-arrow-right" style={{ fontSize: 16, color: 'var(--info)' }} />
            <div style={{ fontSize: 12.5 }}><span style={{ color: 'var(--text-tertiary)' }}>Prochaine étape :</span> <b style={{ fontWeight: 600 }}>{next ? next.nom : '—'}</b></div>
          </div>
        </div>

        {/* Étapes visibles */}
        <div style={{ padding: '14px 18px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', marginBottom: 10 }}>Étapes de votre construction</div>
          <div style={{ position: 'relative', paddingLeft: 18 }}>
            <div style={{ position: 'absolute', left: 4, top: 6, bottom: 6, width: 2, background: 'var(--divider)' }} />
            {sched.map((e, i) => {
              const c = { termine: 'var(--task-termine)', encours: 'var(--task-encours)', demain: 'var(--task-demain)', avenir: 'var(--task-avenir)' }[e.statut];
              return (
                <div key={i} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '8px 0' }}>
                  <span style={{ position: 'absolute', left: -18, top: '50%', transform: 'translateY(-50%)', width: 10, height: 10, borderRadius: '50%', background: c, border: '2px solid var(--surface)', boxShadow: '0 0 0 1.5px ' + c }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: e.statut === 'avenir' ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{e.nom}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{DGd.dateCourt(e.dateDebut)} – {DGd.dateCourt(e.dateFin)}</div>
                  </div>
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: c, whiteSpace: 'nowrap' }}>{STATUT_LABEL[e.statut]}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ padding: '12px 18px 18px', borderTop: '1px solid var(--divider)', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Une question sur votre projet&nbsp;?</div>
          <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 2 }}>Mélanie Vachon · 418 555-0182</div>
        </div>
      </PhoneFrame>
    );
  }

  window.VueClient = VueClient;
})();
