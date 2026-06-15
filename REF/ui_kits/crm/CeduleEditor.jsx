/* Cédule — mode édition. Nudge de dates avec cascade, buffer, assignation,
   visible client, étapes verrouillées (terminées / en cours), détection de conflits. */
(function () {
  const DS = window.HabitationsDGDesignSystem_408490;
  const { Select, Toggle } = DS;

  function cascadeDown(etapes, from) {
    const a = etapes.map(e => ({ ...e }));
    for (let i = from + 1; i < a.length; i++) {
      const prev = a[i-1];
      a[i].dateDebut = window.DG.addJoursOuvrables(prev.dateFin, 1 + (prev.buffer || 0));
      a[i].dateFin = a[i].jours <= 1 ? new Date(a[i].dateDebut) : window.DG.addJoursOuvrables(a[i].dateDebut, a[i].jours - 1);
    }
    return a;
  }
  function detecterConflits(etapes) {
    const c = [];
    for (let i = 0; i < etapes.length - 1; i++) {
      const d1 = new Date(etapes[i].dateFin); d1.setHours(0,0,0,0);
      const d2 = new Date(etapes[i+1].dateDebut); d2.setHours(0,0,0,0);
      if (d1 >= d2) { c.push(i); c.push(i+1); }
    }
    return [...new Set(c)];
  }

  function NudgeGroup({ value, onNudge, disabled, accent }) {
    const btn = (off) => (
      <button key={off} disabled={disabled} onClick={() => onNudge(off)}
        style={{ width:24, height:26, padding:0, border:'1px solid var(--border)', borderRadius:4,
          background: disabled ? 'var(--surface-subtle)' : 'var(--surface)', color: disabled ? 'var(--text-disabled)' : 'var(--text-secondary)',
          fontSize:10, fontWeight:600, cursor: disabled ? 'not-allowed' : 'pointer', fontVariantNumeric:'tabular-nums' }}
        onMouseEnter={e=>{ if(!disabled){ e.currentTarget.style.background='var(--n-100)'; e.currentTarget.style.color='var(--text-primary)'; } }}
        onMouseLeave={e=>{ if(!disabled){ e.currentTarget.style.background='var(--surface)'; e.currentTarget.style.color='var(--text-secondary)'; } }}>
        {off>0?'+':''}{off}
      </button>
    );
    return (
      <div style={{ display:'flex', alignItems:'center', gap:3 }}>
        {[-5,-3,-1].map(btn)}
        <span style={{ width:54, textAlign:'center', fontSize:11, fontWeight:600, fontVariantNumeric:'tabular-nums',
          color: disabled ? 'var(--text-tertiary)' : (accent||'var(--text-primary)'),
          background: disabled ? 'transparent' : 'var(--info-tint)', borderRadius:4, padding:'4px 0' }}>{value}</span>
        {[1,3,5].map(btn)}
      </div>
    );
  }

  function CeduleEditor({ etapesInit, dateLivraison, fournisseurs }) {
    const DGd = window.DG;
    const [etapes, setEtapes] = React.useState(() => etapesInit.map(e => ({ ...e })));
    const conflits = React.useMemo(() => detecterConflits(etapes), [etapes]);

    const totalJours = DGd.joursOuvrableEntre(etapes[0].dateDebut, dateLivraison);
    const totalBuffer = etapes.reduce((s,e)=>s+(e.buffer||0),0);
    const overflow = etapes[etapes.length-1].dateFin > dateLivraison;

    const lockState = (e) => e.statut==='termine' ? 'full' : (e.statut==='encours' ? 'start' : 'none');

    function nudgeDebut(idx, off) {
      setEtapes(prev => {
        const a = prev.map(e=>({ ...e }));
        a[idx].dateDebut = DGd.addJoursOuvrables(a[idx].dateDebut, off);
        a[idx].dateFin = a[idx].jours<=1 ? new Date(a[idx].dateDebut) : DGd.addJoursOuvrables(a[idx].dateDebut, a[idx].jours-1);
        return cascadeDown(a, idx);
      });
    }
    function nudgeFin(idx, off) {
      setEtapes(prev => {
        const a = prev.map(e=>({ ...e }));
        a[idx].dateFin = DGd.addJoursOuvrables(a[idx].dateFin, off);
        a[idx].jours = DGd.joursOuvrableEntre(a[idx].dateDebut, a[idx].dateFin);
        return cascadeDown(a, idx);
      });
    }
    function nudgeBuffer(idx, off) {
      setEtapes(prev => {
        const a = prev.map(e=>({ ...e }));
        a[idx].buffer = Math.max(0, (a[idx].buffer||0)+off);
        return cascadeDown(a, idx);
      });
    }
    function setAssigne(idx, val) { setEtapes(prev => prev.map((e,i)=> i===idx ? { ...e, assigneA:val } : e)); }
    function toggleVisible(idx) { setEtapes(prev => prev.map((e,i)=> i===idx ? { ...e, visibleClient: !e.visibleClient } : e)); }

    const HEAD = ['#','Étape','Jours','Date début','Fin','Buffer','Assigné','Vue client'];

    return (
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {/* Bandeau */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
          <div style={{ background:'var(--success-tint)', border:'1px solid #C7E3D4', borderRadius:'var(--radius-md)', padding:'11px 14px' }}>
            <div style={{ fontSize:11, color:'var(--text-secondary)', marginBottom:3, display:'flex', alignItems:'center', gap:6 }}><i className="ti ti-calendar-event" style={{ color:'var(--success)' }} />Début estimé</div>
            <div style={{ fontSize:15, fontWeight:600, color:'var(--success-text)', fontVariantNumeric:'tabular-nums' }}>{DGd.dateLong(etapes[0].dateDebut)}</div>
          </div>
          <div style={{ background:'var(--accent-tint)', border:'1px solid var(--accent-border)', borderRadius:'var(--radius-md)', padding:'11px 14px' }}>
            <div style={{ fontSize:11, color:'var(--text-secondary)', marginBottom:3, display:'flex', alignItems:'center', gap:6 }}><i className="ti ti-flag" style={{ color:'var(--dg-red)' }} />Date de livraison</div>
            <div style={{ fontSize:15, fontWeight:600, color:'var(--dg-red-700)', fontVariantNumeric:'tabular-nums' }}>{DGd.dateLong(dateLivraison)}</div>
          </div>
          <div style={{ background:'var(--surface-subtle)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'11px 14px' }}>
            <div style={{ fontSize:11, color:'var(--text-secondary)', marginBottom:3, display:'flex', alignItems:'center', gap:6 }}><i className="ti ti-sum" style={{ color:'var(--text-tertiary)' }} />Total</div>
            <div style={{ fontSize:15, fontWeight:600, fontVariantNumeric:'tabular-nums' }}>{totalJours} jours ouvrables{totalBuffer>0?` · ${totalBuffer}j buffer`:''}</div>
          </div>
        </div>

        {/* Alertes */}
        {(conflits.length>0 || overflow) ? (
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {conflits.length>0 ? (
              <div style={{ flex:1, minWidth:240, display:'flex', alignItems:'center', gap:8, background:'var(--danger-tint)', border:'1px solid var(--accent-border)', borderRadius:'var(--radius-md)', padding:'9px 13px', fontSize:12, fontWeight:500, color:'var(--danger-text)' }}>
                <i className="ti ti-alert-triangle" />{Math.ceil(conflits.length/2)} conflit{conflits.length>2?'s':''} de chevauchement détecté{conflits.length>2?'s':''}
              </div>
            ) : null}
            {overflow ? (
              <div style={{ flex:1, minWidth:240, display:'flex', alignItems:'center', gap:8, background:'var(--warning-tint)', border:'1px solid #F2D9A6', borderRadius:'var(--radius-md)', padding:'9px 13px', fontSize:12, fontWeight:500, color:'var(--warning-text)' }}>
                <i className="ti ti-clock-exclamation" />La cédule dépasse la date de livraison
              </div>
            ) : null}
          </div>
        ) : (
          <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--success-tint)', borderRadius:'var(--radius-md)', padding:'9px 13px', fontSize:12, fontWeight:500, color:'var(--success-text)' }}>
            <i className="ti ti-circle-check" />Aucun conflit — la cédule tient dans l'échéancier
          </div>
        )}

        {/* Tableau éditeur */}
        <div style={{ border:'1px solid var(--border)', borderRadius:'var(--radius-md)', overflow:'hidden', background:'var(--surface)' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ borderCollapse:'collapse', fontSize:12, width:'100%', minWidth:1080 }}>
              <thead>
                <tr style={{ background:'var(--surface-subtle)', borderBottom:'1px solid var(--border)' }}>
                  {HEAD.map((h,i)=>(
                    <th key={i} style={{ textAlign: (i===2||i===7)?'center':'left', padding:'8px 12px', fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em', color:'var(--text-tertiary)', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {etapes.map((e,idx)=>{
                  const lock = lockState(e);
                  const isConflict = conflits.includes(idx);
                  const bg = isConflict ? 'var(--danger-tint)' : (lock==='full' ? 'rgba(99,153,34,0.07)' : (idx%2?'var(--surface)':'var(--n-25)'));
                  return (
                    <tr key={idx} style={{ borderBottom:'1px solid var(--divider)', background:bg,
                      borderLeft: isConflict ? '3px solid var(--danger)' : (lock==='full' ? '3px solid var(--task-termine)' : '3px solid transparent') }}>
                      <td style={{ padding:'7px 12px', color:'var(--text-tertiary)', fontVariantNumeric:'tabular-nums' }}>{e.ordre}</td>
                      <td style={{ padding:'7px 12px', fontWeight:500, whiteSpace:'nowrap' }}>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:6, opacity: lock==='full'?0.7:1 }}>
                          {lock!=='none' ? <i className={'ti ti-' + (lock==='full'?'lock':'lock-open')} style={{ fontSize:13, color: lock==='full'?'var(--task-termine)':'var(--task-encours)' }} /> : null}
                          {e.nom}
                        </span>
                      </td>
                      <td style={{ padding:'7px 12px', textAlign:'center', color:'var(--text-secondary)', fontVariantNumeric:'tabular-nums' }}>{e.jours}j</td>
                      <td style={{ padding:'7px 12px' }}>
                        <NudgeGroup value={DGd.dateCourt(e.dateDebut)} disabled={lock==='full'||lock==='start'} onNudge={(o)=>nudgeDebut(idx,o)} accent={'var(--info-text)'} />
                      </td>
                      <td style={{ padding:'7px 12px' }}>
                        <NudgeGroup value={DGd.dateCourt(e.dateFin)} disabled={lock==='full'} onNudge={(o)=>nudgeFin(idx,o)} accent={'var(--info-text)'} />
                      </td>
                      <td style={{ padding:'7px 12px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                          <button disabled={lock==='full'} onClick={()=>nudgeBuffer(idx,-1)} style={{ width:24, height:26, border:'1px solid var(--border)', borderRadius:4, background:'var(--surface)', color:'var(--text-secondary)', fontSize:11, fontWeight:600, cursor: lock==='full'?'not-allowed':'pointer' }}>−</button>
                          <span style={{ width:34, textAlign:'center', fontSize:11, fontWeight:600, fontVariantNumeric:'tabular-nums', borderRadius:4, padding:'4px 0',
                            background: e.buffer>0 ? 'var(--warning-tint)':'var(--n-100)', color: e.buffer>0 ? 'var(--warning-text)':'var(--text-secondary)' }}>{e.buffer||0}j</span>
                          <button disabled={lock==='full'} onClick={()=>nudgeBuffer(idx,1)} style={{ width:24, height:26, border:'1px solid var(--border)', borderRadius:4, background:'var(--surface)', color:'var(--text-secondary)', fontSize:11, fontWeight:600, cursor: lock==='full'?'not-allowed':'pointer' }}>+</button>
                        </div>
                      </td>
                      <td style={{ padding:'7px 12px', minWidth:160 }}>
                        <Select size="sm" value={e.assigneA} onChange={(ev)=>setAssigne(idx,ev.target.value)}
                          options={['Interne', ...fournisseurs]} disabled={lock==='full'} />
                      </td>
                      <td style={{ padding:'7px 12px', textAlign:'center' }}>
                        <Toggle checked={e.visibleClient} onChange={()=>toggleVisible(idx)} disabled={lock==='full'} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  window.CeduleEditor = CeduleEditor;
})();
