/* Cédule — vue Gantt (consultation) + tableau « Détail des étapes ». */
(function () {
  const DS = window.HabitationsDGDesignSystem_408490;
  const { StatusDot, Badge } = DS;

  const STATUT_COLOR = { termine:'var(--task-termine)', encours:'var(--task-encours)', demain:'var(--task-demain)', avenir:'var(--task-avenir)' };
  const STATUT_LABEL = { termine:'Terminé', encours:'En cours', demain:'Demain', avenir:'À venir' };
  const MOIS = ['janv.','févr.','mars','avr.','mai','juin','juill.','août','sept.','oct.','nov.','déc.'];

  function buildColumns(minDate, maxDate) {
    const cols = []; let cur = new Date(minDate); cur.setHours(0,0,0,0);
    const end = new Date(maxDate); end.setHours(0,0,0,0);
    while (cur <= end) { const w = cur.getDay(); if (w!==0 && w!==6) cols.push(new Date(cur)); cur.setDate(cur.getDate()+1); }
    return cols;
  }

  function GanttView({ etapes }) {
    const DGd = window.DG;
    const COLW = 26, ROWH = 38, LABELW = 248;

    const minDate = etapes[0].dateDebut;
    const maxDate = etapes[etapes.length-1].dateFin;
    const cols = React.useMemo(()=>buildColumns(minDate, maxDate), [etapes]);
    const idxOf = (d) => { const t = new Date(d); t.setHours(0,0,0,0); for (let i=0;i<cols.length;i++) if (cols[i].getTime()===t.getTime()) return i; // nearest working day fallback
      for (let i=0;i<cols.length;i++) if (cols[i] >= t) return i; return cols.length-1; };
    const todayIdx = (()=>{ const t=DGd.TODAY; for(let i=0;i<cols.length;i++) if(cols[i].getTime()===t.getTime()) return i; for(let i=0;i<cols.length;i++) if(cols[i]>t) return i-0.5; return -1; })();

    // week tint groups (alternate by ISO week)
    const colTint = cols.map((d) => { const onejan = new Date(d.getFullYear(),0,1); const wk = Math.ceil((((d-onejan)/86400000)+onejan.getDay()+1)/7); return wk%2===0; });
    // month header spans
    const monthSpans = [];
    cols.forEach((d,i)=>{ const last = monthSpans[monthSpans.length-1]; if (last && last.m===d.getMonth()) last.span++; else monthSpans.push({ m:d.getMonth(), y:d.getFullYear(), span:1 }); });

    const gridW = cols.length * COLW;

    return (
      <div style={{ border:'1px solid var(--border)', borderRadius:'var(--radius-md)', overflow:'hidden', background:'var(--surface)' }}>
        <div style={{ overflowX:'auto' }}>
          <div style={{ minWidth: LABELW + gridW }}>
            {/* Header — mois */}
            <div style={{ display:'flex', borderBottom:'1px solid var(--border)', background:'var(--surface-subtle)' }}>
              <div style={{ width:LABELW, flexShrink:0, borderRight:'1px solid var(--border)', padding:'7px 12px', display:'flex', alignItems:'center' }}>
                <span className="dg-eyebrow">Étapes · {etapes.length}</span>
              </div>
              <div style={{ display:'flex' }}>
                {monthSpans.map((ms,i)=>(
                  <div key={i} style={{ width: ms.span*COLW, borderRight:'1px solid var(--border)', padding:'6px 8px', fontSize:11, fontWeight:600, color:'var(--text-secondary)', textTransform:'capitalize', whiteSpace:'nowrap', overflow:'hidden' }}>
                    {MOIS[ms.m]}
                  </div>
                ))}
              </div>
            </div>
            {/* Header — jours */}
            <div style={{ display:'flex', borderBottom:'1px solid var(--border)' }}>
              <div style={{ width:LABELW, flexShrink:0, borderRight:'1px solid var(--border)' }} />
              <div style={{ display:'flex', position:'relative' }}>
                {cols.map((d,i)=>(
                  <div key={i} style={{ width:COLW, borderRight:'1px solid var(--divider)', padding:'3px 0', fontSize:9.5, textAlign:'center',
                    color: d.getTime()===DGd.TODAY.getTime() ? 'var(--dg-red)' : 'var(--text-tertiary)', fontWeight: d.getTime()===DGd.TODAY.getTime()?700:400,
                    background: colTint[i] ? 'var(--n-50)' : 'transparent', fontVariantNumeric:'tabular-nums' }}>
                    {d.getDate()}
                  </div>
                ))}
              </div>
            </div>
            {/* Rows */}
            <div style={{ position:'relative' }}>
              {/* today line spanning all rows */}
              {todayIdx >= 0 ? (
                <div style={{ position:'absolute', top:0, bottom:0, left: LABELW + todayIdx*COLW + COLW/2, width:2, background:'var(--task-today-line)', zIndex:5, pointerEvents:'none' }}>
                  <span style={{ position:'absolute', top:-1, left:-19, fontSize:8, fontWeight:700, color:'#fff', background:'var(--task-today-line)', padding:'1px 4px', borderRadius:3, whiteSpace:'nowrap' }}>auj.</span>
                </div>
              ) : null}
              {etapes.map((e,i)=>{
                const start = idxOf(e.dateDebut);
                const span = Math.max(1, DGd.joursOuvrableEntre(e.dateDebut, e.dateFin));
                return (
                  <div key={i} style={{ display:'flex', height:ROWH, borderBottom: i===etapes.length-1?'none':'1px solid var(--divider)' }}>
                    <div style={{ width:LABELW, flexShrink:0, borderRight:'1px solid var(--border)', padding:'0 12px', display:'flex', flexDirection:'column', justifyContent:'center', background:'var(--surface)' }}>
                      <div style={{ fontSize:12, fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                        <span style={{ color:'var(--text-tertiary)', fontVariantNumeric:'tabular-nums', marginRight:5 }}>{e.ordre}.</span>{e.nom}
                      </div>
                      <div style={{ fontSize:10, color:'var(--text-tertiary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                        {e.jours}j ouvr.{e.assigneA!=='Interne' ? ' · ' + e.assigneA : ''}
                      </div>
                    </div>
                    <div style={{ position:'relative', display:'flex' }}>
                      {cols.map((d,ci)=>(
                        <div key={ci} style={{ width:COLW, borderRight:'1px solid var(--divider)', background: colTint[ci] ? 'var(--n-50)' : 'transparent' }} />
                      ))}
                      <div title={STATUT_LABEL[e.statut]} style={{ position:'absolute', left:start*COLW+2, width: span*COLW-4, height:18, top:(ROWH-18)/2,
                        borderRadius:5, background: STATUT_COLOR[e.statut], boxShadow:'var(--shadow-sm)', display:'flex', alignItems:'center', paddingLeft:6,
                        zIndex:2 }}>
                        {span>=3 ? <span style={{ fontSize:9, fontWeight:600, color:'#fff', whiteSpace:'nowrap', overflow:'hidden' }}>{e.assigneA!=='Interne'?e.assigneA:e.nom}</span> : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Légende */}
        <div style={{ display:'flex', gap:16, alignItems:'center', padding:'9px 14px', borderTop:'1px solid var(--border)', background:'var(--surface-subtle)', flexWrap:'wrap' }}>
          {['termine','encours','demain','avenir'].map(s=>(
            <span key={s} style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:11, color:'var(--text-secondary)' }}>
              <span style={{ width:11, height:11, borderRadius:3, background:STATUT_COLOR[s] }} />{STATUT_LABEL[s]}
            </span>
          ))}
          <span style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:11, color:'var(--text-secondary)' }}>
            <span style={{ width:2, height:13, background:'var(--task-today-line)' }} />Aujourd'hui
          </span>
        </div>
      </div>
    );
  }

  /* Tableau « Détail des étapes » */
  function DetailTable({ etapes }) {
    const DGd = window.DG;
    return (
      <div style={{ border:'1px solid var(--border)', borderRadius:'var(--radius-md)', overflow:'hidden', background:'var(--surface)' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
          <thead>
            <tr style={{ background:'var(--surface-subtle)', borderBottom:'1px solid var(--border)' }}>
              {['N°','Étape','Début','Fin','Durée','Assigné','Visible client',''].map((h,i)=>(
                <th key={i} style={{ textAlign: i>=4&&i<5?'center':(i===6?'center':'left'), padding:'8px 12px', fontSize:10, fontWeight:600,
                  textTransform:'uppercase', letterSpacing:'0.04em', color:'var(--text-tertiary)', whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {etapes.map((e,i)=>(
              <tr key={i} style={{ borderBottom: i===etapes.length-1?'none':'1px solid var(--divider)', background: i%2?'var(--surface)':'var(--n-25)' }}>
                <td style={{ padding:'8px 12px', color:'var(--text-tertiary)', fontVariantNumeric:'tabular-nums' }}>{e.ordre}</td>
                <td style={{ padding:'8px 12px', fontWeight:500 }}>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:7 }}>
                    <StatusDot status={e.statut} pulse={e.statut==='encours'} />{e.nom}
                  </span>
                </td>
                <td style={{ padding:'8px 12px', color:'var(--text-secondary)', fontVariantNumeric:'tabular-nums', whiteSpace:'nowrap' }}>{DGd.dateCourt(e.dateDebut)}</td>
                <td style={{ padding:'8px 12px', color:'var(--text-secondary)', fontVariantNumeric:'tabular-nums', whiteSpace:'nowrap' }}>{DGd.dateCourt(e.dateFin)}</td>
                <td style={{ padding:'8px 12px', textAlign:'center', color:'var(--text-secondary)', fontVariantNumeric:'tabular-nums' }}>{e.jours}j</td>
                <td style={{ padding:'8px 12px' }}>
                  {e.assigneA==='Interne'
                    ? <span style={{ color:'var(--text-tertiary)' }}>Interne</span>
                    : <Badge tone="neutral">{e.assigneA}</Badge>}
                </td>
                <td style={{ padding:'8px 12px', textAlign:'center' }}>
                  <i className={'ti ti-' + (e.visibleClient ? 'eye' : 'eye-off')} style={{ fontSize:15, color: e.visibleClient ? 'var(--success)' : 'var(--text-disabled)' }} />
                </td>
                <td style={{ padding:'8px 12px', textAlign:'center' }}>
                  <i className="ti ti-dots" style={{ fontSize:15, color:'var(--text-disabled)' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  window.GanttView = GanttView;
  window.DetailTable = DetailTable;
})();
