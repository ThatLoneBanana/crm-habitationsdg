/* Écran 2 + 3 — Page projet (en-tête, vue d'ensemble, onglets) avec l'onglet
   Cédule en vedette (consultation / édition). */
(function () {
  const DS = window.HabitationsDGDesignSystem_408490;
  const { Tabs, PhaseBadge, Badge, Button, ProgressBar } = DS;

  const FOURNISSEURS = ['Plomberie Côté','Gypse Beauce','Élec. Vachon','Peinture Martin','Céramique Plus','Cuisines Beauce','Ventil. Express'];
  const CONTRAT = { PRELIMINAIRE:'Préliminaire', ENTREPRISE:'Entreprise' };

  function Stat({ label, value, sub, color }) {
    return (
      <div style={{ padding:'2px 0' }}>
        <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em', color:'var(--text-tertiary)' }}>{label}</div>
        <div style={{ fontSize:14, fontWeight:600, marginTop:3, color: color||'var(--text-primary)', fontVariantNumeric:'tabular-nums' }}>{value}</div>
        {sub ? <div style={{ fontSize:11, color:'var(--text-tertiary)', marginTop:1 }}>{sub}</div> : null}
      </div>
    );
  }

  function CeduleTab({ project, schedule }) {
    const [mode, setMode] = React.useState('consult');
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
          <div style={{ display:'inline-flex', padding:3, background:'var(--n-100)', borderRadius:'var(--radius-md)', gap:2 }}>
            {[['consult','Consultation','eye'],['edit','Édition','pencil']].map(([m,label,icon])=>(
              <button key={m} onClick={()=>setMode(m)}
                style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 12px', borderRadius:6, border:'none', cursor:'pointer',
                  fontSize:12, fontWeight:600, fontFamily:'var(--font-sans)',
                  background: mode===m ? 'var(--surface)' : 'transparent', color: mode===m ? 'var(--text-primary)' : 'var(--text-secondary)',
                  boxShadow: mode===m ? 'var(--shadow-sm)' : 'none' }}>
                <i className={'ti ti-'+icon} style={{ fontSize:14 }} />{label}
              </button>
            ))}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {mode==='edit'
              ? <><Button variant="ghost" size="md" icon={<i className="ti ti-refresh" />}>Réinitialiser</Button><Button variant="primary" size="md" icon={<i className="ti ti-device-floppy" />}>Enregistrer</Button></>
              : <Button variant="outline" size="md" icon={<i className="ti ti-printer" />}>Imprimer la cédule</Button>}
          </div>
        </div>
        {mode==='consult'
          ? <>
              <window.GanttView etapes={schedule} />
              <div style={{ fontSize:13, fontWeight:600, margin:'2px 0 -4px' }}>Détail des étapes</div>
              <window.DetailTable etapes={schedule} />
            </>
          : <window.CeduleEditor etapesInit={schedule} dateLivraison={project.dateLivraison} fournisseurs={FOURNISSEURS} />}
      </div>
    );
  }

  function ExtrasTab() {
    const rows = [
      ['Céramique format 24x24', 1200, 'SIGNE', '15 avr. 2026'],
      ['Escalier bois franc', 2400, 'SIGNE', '20 avr. 2026'],
      ['Luminaires DEL — cuisine', 680, 'EN_ATTENTE', null],
    ];
    return (
      <div style={{ border:'1px solid var(--border)', borderRadius:'var(--radius-md)', overflow:'hidden', background:'var(--surface)' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12.5 }}>
          <thead><tr style={{ background:'var(--surface-subtle)', borderBottom:'1px solid var(--border)' }}>
            {['Description','Montant','Statut','Signé le'].map((h,i)=>(<th key={i} style={{ textAlign:i===1?'right':'left', padding:'9px 14px', fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em', color:'var(--text-tertiary)' }}>{h}</th>))}
          </tr></thead>
          <tbody>{rows.map((r,i)=>(
            <tr key={i} style={{ borderBottom: i===rows.length-1?'none':'1px solid var(--divider)' }}>
              <td style={{ padding:'10px 14px', fontWeight:500 }}>{r[0]}</td>
              <td style={{ padding:'10px 14px', textAlign:'right', fontVariantNumeric:'tabular-nums', fontWeight:500 }}>{window.DG.formatMontant(r[1])}</td>
              <td style={{ padding:'10px 14px' }}>{r[2]==='SIGNE'?<Badge tone="success" dot>Signé</Badge>:<Badge tone="warning">En attente</Badge>}</td>
              <td style={{ padding:'10px 14px', color:'var(--text-secondary)', fontVariantNumeric:'tabular-nums' }}>{r[3]||'—'}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    );
  }

  function PaiementsTab() {
    const rows = [
      ['Acompte', 15000, true, '20 sept. 2025'],
      ['Solde final', 472500, false, '4 juin 2026'],
    ];
    return (
      <div style={{ border:'1px solid var(--border)', borderRadius:'var(--radius-md)', overflow:'hidden', background:'var(--surface)' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12.5 }}>
          <thead><tr style={{ background:'var(--surface-subtle)', borderBottom:'1px solid var(--border)' }}>
            {['Description','Montant','Statut','Date'].map((h,i)=>(<th key={i} style={{ textAlign:i===1?'right':'left', padding:'9px 14px', fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em', color:'var(--text-tertiary)' }}>{h}</th>))}
          </tr></thead>
          <tbody>{rows.map((r,i)=>(
            <tr key={i} style={{ borderBottom: i===rows.length-1?'none':'1px solid var(--divider)' }}>
              <td style={{ padding:'10px 14px', fontWeight:500 }}>{r[0]}</td>
              <td style={{ padding:'10px 14px', textAlign:'right', fontVariantNumeric:'tabular-nums', fontWeight:500, color: r[2]?'var(--success-text)':'var(--text-primary)' }}>{window.DG.formatMontant(r[1])}</td>
              <td style={{ padding:'10px 14px' }}>{r[2]?<Badge tone="success" dot>Reçu</Badge>:<Badge tone="warning">Attendu</Badge>}</td>
              <td style={{ padding:'10px 14px', color:'var(--text-secondary)', fontVariantNumeric:'tabular-nums' }}>{r[3]}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    );
  }

  function EmptyTab({ icon, title, note }) {
    return (
      <div style={{ border:'1px solid var(--border)', borderRadius:'var(--radius-md)', background:'var(--surface)', padding:'48px 24px', textAlign:'center', color:'var(--text-tertiary)' }}>
        <i className={'ti ti-'+icon} style={{ fontSize:30, color:'var(--text-disabled)' }} />
        <div style={{ fontSize:14, fontWeight:600, color:'var(--text-secondary)', marginTop:10 }}>{title}</div>
        <div style={{ fontSize:12, marginTop:3 }}>{note}</div>
      </div>
    );
  }

  function ProjectPage({ projectId, onBack }) {
    const DGd = window.DG;
    const project = DGd.projets.find(p=>p.id===projectId) || DGd.projets[0];
    const schedule = React.useMemo(()=>DGd.buildSchedule(project.dateLivraison), [project.id]);
    const [tab, setTab] = React.useState('Cédule');
    const next = schedule.find(e=>e.statut==='encours') || schedule.find(e=>e.statut==='demain') || schedule.find(e=>e.statut==='avenir');
    const jr = DGd.joursRestants(project.dateLivraison);

    const tabs = ['Cédule', { id:'Extras', label:'Extras', count:3 }, { id:'Paiements', label:'Paiements', count:2 }, 'GCR', 'Costing', 'Documents'];

    return (
      <div style={{ padding:'18px 24px 40px', maxWidth:1240 }}>
        {/* breadcrumb */}
        <button onClick={onBack} style={{ display:'inline-flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:'var(--text-tertiary)', fontSize:12, padding:0, marginBottom:12 }}>
          <i className="ti ti-chevron-left" style={{ fontSize:14 }} />Tous les projets
        </button>

        {/* En-tête projet */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:20, flexWrap:'wrap' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <h1 style={{ fontSize:26, fontWeight:600, letterSpacing:'-0.02em' }}>{project.adresse}</h1>
              <PhaseBadge phase={project.phase} />
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:5, fontSize:13, color:'var(--text-secondary)' }}>
              <span>{project.ville}</span><span style={{ color:'var(--text-disabled)' }}>·</span>
              <i className="ti ti-user" style={{ fontSize:14 }} /><span>{project.client}</span><span style={{ color:'var(--text-disabled)' }}>·</span>
              <Badge tone="outline">{CONTRAT[project.contrat]}</Badge>
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <Button variant="outline" size="md" icon={<i className="ti ti-pencil" />}>Modifier</Button>
            <Button variant="outline" size="md" icon={<i className="ti ti-eye" />}>Vue client</Button>
            <Button variant="outline" size="md" icon={<i className="ti ti-printer" />}>Imprimer</Button>
            <Button variant="primary" size="md" icon={<i className="ti ti-send" />}>Envoyer la cédule</Button>
          </div>
        </div>

        {/* Vue d'ensemble */}
        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr 1fr', gap:1, background:'var(--border)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', overflow:'hidden', margin:'18px 0 4px' }}>
          <div style={{ background:'var(--surface)', padding:'14px 16px' }}>
            <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em', color:'var(--text-tertiary)' }}>Avancement global</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:8, marginTop:5 }}>
              <span style={{ fontSize:22, fontWeight:600, fontVariantNumeric:'tabular-nums' }}>{project.avancement}%</span>
              <span style={{ fontSize:11, color:'var(--text-tertiary)' }}>{schedule.filter(e=>e.statut==='termine').length}/{schedule.length} étapes</span>
            </div>
            <div style={{ marginTop:8 }}><ProgressBar value={project.avancement} phase={project.phase} height={5} /></div>
          </div>
          <div style={{ background:'var(--surface)', padding:'14px 16px' }}><Stat label="Montant du contrat" value={DGd.formatMontant(project.montant,0)} /></div>
          <div style={{ background:'var(--surface)', padding:'14px 16px' }}><Stat label="Livraison" value={DGd.dateLong(project.dateLivraison)} sub={`${jr} jours restants`} color={jr<=14?'var(--danger)':undefined} /></div>
          <div style={{ background:'var(--surface)', padding:'14px 16px' }}><Stat label="Prochaine étape" value={next?next.nom:'—'} sub={next?`${next.assigneA} · ${DGd.dateCourt(next.dateDebut)}`:''} /></div>
        </div>

        {/* Alerte projet */}
        {jr<=14 ? (
          <div style={{ display:'flex', alignItems:'center', gap:9, background:'var(--danger-tint)', border:'1px solid var(--accent-border)', borderRadius:'var(--radius-md)', padding:'10px 14px', margin:'12px 0 0', fontSize:12.5, color:'var(--danger-text)' }}>
            <i className="ti ti-alert-triangle" style={{ fontSize:16 }} />
            <span style={{ fontWeight:600 }}>Livraison imminente</span> — remise des clés dans {jr} jours. Solde final de {DGd.formatMontant(472500,0)} attendu.
          </div>
        ) : next ? (
          <div style={{ display:'flex', alignItems:'center', gap:9, background:'var(--info-tint)', border:'1px solid #C7DBF2', borderRadius:'var(--radius-md)', padding:'10px 14px', margin:'12px 0 0', fontSize:12.5, color:'var(--info-text)' }}>
            <i className="ti ti-info-circle" style={{ fontSize:16 }} />
            <span style={{ fontWeight:600 }}>{next.nom}</span> en cours — {next.assigneA} · à coordonner d'ici le {DGd.dateCourt(next.dateDebut)}.
          </div>
        ) : null}

        {/* Onglets */}
        <div style={{ marginTop:18, marginBottom:18 }}>
          <Tabs value={tab} onChange={setTab} tabs={tabs} />
        </div>

        {/* Contenu */}
        {tab==='Cédule' ? <CeduleTab project={project} schedule={schedule} /> : null}
        {tab==='Extras' ? <ExtrasTab /> : null}
        {tab==='Paiements' ? <PaiementsTab /> : null}
        {tab==='GCR' ? <window.GcrTab projectId={project.id} /> : null}
        {tab==='Costing' ? <window.CostingTab projectId={project.id} /> : null}
        {tab==='Documents' ? <EmptyTab icon="folder" title="Documents" note="Contrat, plans, devis et photos de chantier." /> : null}
      </div>
    );
  }

  window.ProjectPage = ProjectPage;
})();
