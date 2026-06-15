/* Écran — Liste des projets : tableau dense, filtres par phase, recherche. */
(function () {
  const NS = window.HabitationsDGDesignSystem_408490;
  const { PhaseBadge, ProgressBar, Badge, Button, FilterChip, Avatar, EmptyState } = NS;

  const CONTRAT = { PRELIMINAIRE: 'Préliminaire', ENTREPRISE: 'Entreprise' };

  function ProjetsList({ onOpenProject, onCreate }) {
    const DGd = window.DG;
    const [phase, setPhase] = React.useState(null);
    const [q, setQ] = React.useState('');
    const [sort, setSort] = React.useState('livraison');

    const counts = {};
    DGd.projets.forEach(p => { counts[p.phase] = (counts[p.phase] || 0) + 1; });

    let rows = DGd.projets.filter(p => (!phase || p.phase === phase) &&
      (!q || (p.client + ' ' + p.adresse + ' ' + p.ville).toLowerCase().includes(q.toLowerCase())));
    rows = [...rows].sort((a, b) => sort === 'livraison' ? a.dateLivraison - b.dateLivraison
      : sort === 'avancement' ? b.avancement - a.avancement
      : sort === 'montant' ? b.montant - a.montant : 0);

    const PHASES = ['SIGNE', 'PREPARATION', 'CHANTIER', 'LIVRAISON', 'TERMINE'];
    const HEAD = [['Projet', 'left'], ['Phase', 'left'], ['Avancement', 'left'], ['Livraison', 'left'], ['Contrat', 'left'], ['Montant', 'right'], ['Vendeur', 'left'], ['', 'right']];

    return (
      <div style={{ padding: '22px 24px 40px', maxWidth: 1280 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18, gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Projets</h1>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>{DGd.projets.length} projets · {DGd.projets.filter(p => ['CHANTIER', 'LIVRAISON'].includes(p.phase)).length} en chantier</p>
          </div>
          <Button variant="primary" icon={<i className="ti ti-plus" />} onClick={onCreate}>Nouveau projet</Button>
        </div>

        {/* Barre filtres + recherche */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 14, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <FilterChip label="Tous" count={DGd.projets.length} active={phase == null} onClick={() => setPhase(null)} />
            {PHASES.map(ph => (
              <FilterChip key={ph} label={DGd.phase(ph).label} dotColor={DGd.phase(ph).bar} count={counts[ph] || 0} active={phase === ph} onClick={() => setPhase(ph)} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <i className="ti ti-search" style={{ position: 'absolute', left: 9, fontSize: 15, color: 'var(--text-tertiary)' }} />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Rechercher un projet, client, ville…"
                style={{ height: 32, width: 250, padding: '0 10px 0 30px', fontSize: 12, border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'var(--font-sans)', background: 'var(--surface)' }} />
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)}
              style={{ height: 32, padding: '0 10px', fontSize: 12, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface)', fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)' }}>
              <option value="livraison">Trier : livraison</option>
              <option value="avancement">Trier : avancement</option>
              <option value="montant">Trier : montant</option>
            </select>
          </div>
        </div>

        {/* Tableau */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--surface)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)' }}>
                {HEAD.map((h, i) => (
                  <th key={i} style={{ textAlign: h[1], padding: '9px 14px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{h[0]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => {
                const jr = DGd.joursRestants(p.dateLivraison);
                return (
                  <tr key={p.id} onClick={() => onOpenProject(p.id)}
                    style={{ borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--divider)', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-subtle)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ fontWeight: 600 }}>{p.adresse}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{p.ville} · {p.client}</div>
                    </td>
                    <td style={{ padding: '11px 14px' }}><PhaseBadge phase={p.phase} /></td>
                    <td style={{ padding: '11px 14px', minWidth: 130 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1 }}><ProgressBar value={p.avancement} phase={p.phase} /></div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums', width: 30, textAlign: 'right' }}>{p.avancement}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '11px 14px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontVariantNumeric: 'tabular-nums' }}>{DGd.dateCourt(p.dateLivraison)} {p.dateLivraison.getFullYear()}</div>
                      <div style={{ fontSize: 11, color: jr <= 14 ? 'var(--danger)' : 'var(--text-tertiary)', fontWeight: jr <= 14 ? 600 : 400, fontVariantNumeric: 'tabular-nums' }}>{jr > 0 ? `${jr} j restants` : 'livré'}</div>
                    </td>
                    <td style={{ padding: '11px 14px' }}><Badge tone={p.contrat === 'ENTREPRISE' ? 'info' : 'outline'}>{CONTRAT[p.contrat]}</Badge></td>
                    <td style={{ padding: '11px 14px', textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{DGd.formatMontant(p.montant, 0)}</td>
                    <td style={{ padding: '11px 14px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                        <Avatar name={p.vendeur} size="sm" />
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{p.vendeur}</span>
                      </span>
                    </td>
                    <td style={{ padding: '11px 14px', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                      <span style={{ display: 'inline-flex', gap: 2 }}>
                        <button title="Ouvrir" onClick={() => onOpenProject(p.id)} style={iconBtn}><i className="ti ti-arrow-right" /></button>
                        <button title="Options" style={iconBtn}><i className="ti ti-dots" /></button>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {rows.length === 0 ? <EmptyState compact icon="search-off" title="Aucun résultat" message="Aucun projet ne correspond à ce filtre ou à cette recherche." /> : null}
        </div>
      </div>
    );
  }

  const iconBtn = { width: 26, height: 26, border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };

  window.ProjetsList = ProjetsList;
})();
