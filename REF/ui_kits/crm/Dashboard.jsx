/* Écran 1 — Dashboard (la vue de Nicolas le matin) */
(function () {
  const DS = window.HabitationsDGDesignSystem_408490;
  const { MetricCard, Card, CardHeader, PhaseBadge, ProgressBar, Badge } = DS;

  function Row({ children, onClick, last }) {
    const [h, setH] = React.useState(false);
    return (
      <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
        style={{ borderBottom: last ? 'none' : '1px solid var(--divider)', background: h ? 'var(--surface-subtle)' : 'transparent', cursor:'pointer', transition:'background .1s' }}>
        {children}
      </div>
    );
  }

  function Dashboard({ onOpenProject }) {
    const DGd = window.DG;
    const agenda = DGd.semaineAgenda();
    const nbEtapes = agenda.reduce((s,j)=>s+j.etapes.length,0);
    const projets = DGd.projets;

    return (
      <div style={{ padding:'22px 24px 40px', maxWidth:1180 }}>
        {/* En-tête */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:20 }}>
          <div>
            <h1 style={{ fontSize:22, fontWeight:600, letterSpacing:'-0.02em' }}>Bonjour Nicolas <span style={{ fontWeight:400 }}>👋</span></h1>
            <p style={{ fontSize:12, color:'var(--text-secondary)', marginTop:3 }}>{DGd.jourLong(DGd.TODAY)}</p>
          </div>
          <div style={{ fontSize:12, color:'var(--text-tertiary)' }}>
            <span style={{ fontWeight:600, color:'var(--text-primary)' }}>7</span> projets actifs
          </div>
        </div>

        {/* Métriques */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, marginBottom:20 }}>
          <MetricCard icon={<i className="ti ti-building-community" />} label="Projets actifs" value="7" sub="1 livraison ce mois" />
          <MetricCard icon={<i className="ti ti-currency-dollar" />} label="Valeur en chantier" value="2,1 M$" sub="valeur totale active" tone="success" />
          <MetricCard icon={<i className="ti ti-alert-triangle" />} label="Alertes" value="3" sub="1 urgente" tone="danger" />
          <MetricCard icon={<i className="ti ti-receipt" />} label="Extras non signés" value="4 800 $" sub="4 à confirmer" tone="warning" />
          <MetricCard icon={<i className="ti ti-cash" />} label="Paiements attendus" value="187 500 $" sub="à recevoir" tone="info" />
        </div>

        {/* Grid principal */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:20, alignItems:'start' }}>
          {/* Gauche */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* Alertes */}
            <Card padding={false}>
              <CardHeader icon={<i className="ti ti-bell" style={{ color:'var(--dg-red)' }} />} title="Alertes prioritaires"
                action={<Badge tone="danger">3</Badge>} />
              {DGd.alertes.map((a,i)=>(
                <Row key={i} last={i===DGd.alertes.length-1} onClick={()=>onOpenProject(a.projet)}>
                  <div style={{ display:'flex', alignItems:'center', gap:11, padding:'11px 14px' }}>
                    <span style={{ width:8, height:8, borderRadius:'50%', background: a.type==='urgent' ? 'var(--danger)' : 'var(--warning)', flexShrink:0 }} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12.5, fontWeight:500 }}>{a.titre}</div>
                      <div style={{ fontSize:11, color:'var(--text-tertiary)', marginTop:1 }}>{a.sous}</div>
                    </div>
                    <Badge tone={a.type==='urgent' ? 'danger' : 'warning'} pill>{a.badge}</Badge>
                    <i className="ti ti-chevron-right" style={{ fontSize:15, color:'var(--text-disabled)' }} />
                  </div>
                </Row>
              ))}
            </Card>

            {/* Agenda */}
            <Card padding={false}>
              <CardHeader icon={<i className="ti ti-calendar-week" style={{ color:'var(--info)' }} />} title="Agenda de la semaine"
                action={<span style={{ fontSize:11, color:'var(--text-tertiary)' }}>{nbEtapes} étapes</span>} />
              {agenda.map((jour,ji)=>(
                <div key={ji}>
                  <div style={{ display:'flex', justifyContent:'space-between', padding:'6px 14px', background:'var(--surface-subtle)',
                    borderBottom:'1px solid var(--divider)', borderTop: ji>0 ? '1px solid var(--divider)' : 'none',
                    fontSize:11, fontWeight:600, color:'var(--text-secondary)' }}>
                    <span style={{ textTransform:'capitalize' }}>{jour.label}</span>
                    <span style={{ fontWeight:400, color:'var(--text-tertiary)' }}>{jour.etapes.length} étape{jour.etapes.length>1?'s':''}</span>
                  </div>
                  {jour.etapes.map((e,ei)=>(
                    <Row key={ei} last={ei===jour.etapes.length-1} onClick={()=>onOpenProject(projets.find(p=>p.adresse===e.projet)?.id)}>
                      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 14px' }}>
                        <span style={{ width:3, height:30, borderRadius:2, background: DGd.phase(e.phase).bar, flexShrink:0 }} />
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:12.5, fontWeight:500 }}>{e.nom}</div>
                          <div style={{ fontSize:11, color:'var(--text-tertiary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{e.projet} · {e.client}</div>
                        </div>
                        <span style={{ fontSize:10, fontWeight:500, padding:'2px 7px', borderRadius:'var(--radius-full)',
                          background: e.assigneA==='Interne' ? 'var(--n-100)' : 'var(--n-150)', color:'var(--text-secondary)', whiteSpace:'nowrap', flexShrink:0 }}>
                          {e.assigneA}
                        </span>
                      </div>
                    </Row>
                  ))}
                </div>
              ))}
            </Card>
          </div>

          {/* Droite — projets */}
          <Card padding={false}>
            <CardHeader icon={<i className="ti ti-list" />} title="Tous les projets"
              action={<span style={{ fontSize:11, color:'var(--text-tertiary)' }}>{projets.length}</span>} />
            {projets.map((p,i)=>{
              const jr = DGd.joursRestants(p.dateLivraison);
              const next = DGd.prochaineEtape(p);
              return (
                <Row key={p.id} last={i===projets.length-1} onClick={()=>onOpenProject(p.id)}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'11px 14px' }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12.5, fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.client}</div>
                      <div style={{ fontSize:11, color:'var(--text-tertiary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.adresse}</div>
                      {next && p.avancement>0 && p.avancement<100 ? (
                        <div style={{ fontSize:11, color:'var(--text-secondary)', marginTop:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>↳ {next.nom}</div>
                      ) : null}
                      <div style={{ marginTop:6 }}><ProgressBar value={p.avancement} phase={p.phase} /></div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:3 }}>
                      <PhaseBadge phase={p.phase} />
                      <div style={{ fontSize:10, color:'var(--text-tertiary)', fontVariantNumeric:'tabular-nums' }}>{p.avancement}%</div>
                      <div style={{ fontSize:10, fontWeight:500, color: jr<=14 ? 'var(--danger)' : 'var(--success-text)', fontVariantNumeric:'tabular-nums' }}>{jr} j</div>
                    </div>
                  </div>
                </Row>
              );
            })}
          </Card>
        </div>
      </div>
    );
  }

  window.Dashboard = Dashboard;
})();
