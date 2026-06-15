/* Écran — Clients & Fournisseurs : vues cartes / liste avec toggle. */
(function () {
  const NS = window.HabitationsDGDesignSystem_408490;
  const { SegmentedControl, Card, CardHeader, Badge, Avatar, PhaseBadge, Button, FilterChip } = NS;

  function ClientsFournisseurs({ onOpenProject, defaultData }) {
    const DGd = window.DG;
    const [data, setData] = React.useState(defaultData || 'clients');
    const [view, setView] = React.useState('cartes');
    React.useEffect(() => { if (defaultData) setData(defaultData); }, [defaultData]);

    const isClients = data === 'clients';
    const items = isClients ? DGd.CLIENTS : DGd.FOURNISSEURS;

    return (
      <div style={{ padding: '22px 24px 40px', maxWidth: 1180 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16, gap: 14, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Carnet d'adresses</h1>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>{DGd.CLIENTS.length} clients · {DGd.FOURNISSEURS.length} fournisseurs</p>
          </div>
          <Button variant="primary" icon={<i className="ti ti-plus" />}>{isClients ? 'Nouveau client' : 'Nouveau fournisseur'}</Button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
          <SegmentedControl value={data} onChange={setData}
            options={[{ value: 'clients', label: 'Clients', icon: 'users' }, { value: 'fournisseurs', label: 'Fournisseurs', icon: 'truck' }]} />
          <SegmentedControl size="sm" value={view} onChange={setView}
            options={[{ value: 'cartes', label: 'Cartes', icon: 'layout-grid' }, { value: 'liste', label: 'Liste', icon: 'list' }]} />
        </div>

        {view === 'cartes' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {isClients
              ? DGd.CLIENTS.map(c => (
                <div key={c.id} onClick={() => onOpenProject && onOpenProject(c.projet)} style={cardSt}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 12 }}>
                    <Avatar name={c.nom} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.nom}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{c.ville}</div>
                    </div>
                    <PhaseBadge phase={c.phase} />
                  </div>
                  <Line icon="map-pin" text={c.adresse} />
                  <Line icon="mail" text={c.courriel} />
                  <Line icon="phone" text={c.tel} />
                </div>
              ))
              : DGd.FOURNISSEURS.map(f => (
                <div key={f.id} style={cardSt}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 12 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--surface-subtle)', border: '1px solid var(--border)', color: 'var(--text-secondary)', flexShrink: 0 }}>
                      <i className="ti ti-tool" style={{ fontSize: 16 }} />
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.nom}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{f.metier}</div>
                    </div>
                    <Badge tone="success">{f.actifs} chantiers</Badge>
                  </div>
                  <Line icon="user" text={f.contact} />
                  <Line icon="phone" text={f.tel} />
                </div>
              ))}
          </div>
        ) : (
          <Card padding={false}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead><tr style={{ background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)' }}>
                {(isClients ? [['Client', 'left'], ['Ville', 'left'], ['Courriel', 'left'], ['Téléphone', 'left'], ['Phase', 'left']] : [['Fournisseur', 'left'], ['Métier', 'left'], ['Contact', 'left'], ['Téléphone', 'left'], ['Chantiers', 'right']]).map((h, i) => (
                  <th key={i} style={{ textAlign: h[1], padding: '9px 14px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{h[0]}</th>
                ))}
              </tr></thead>
              <tbody>
                {isClients
                  ? DGd.CLIENTS.map((c, i) => (
                    <tr key={c.id} onClick={() => onOpenProject && onOpenProject(c.projet)} style={{ borderBottom: i === DGd.CLIENTS.length - 1 ? 'none' : '1px solid var(--divider)', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-subtle)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '10px 14px' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Avatar name={c.nom} size="sm" /><span style={{ fontWeight: 600 }}>{c.nom}</span></span></td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{c.ville}</td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{c.courriel}</td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>{c.tel}</td>
                      <td style={{ padding: '10px 14px' }}><PhaseBadge phase={c.phase} /></td>
                    </tr>
                  ))
                  : DGd.FOURNISSEURS.map((f, i) => (
                    <tr key={f.id} style={{ borderBottom: i === DGd.FOURNISSEURS.length - 1 ? 'none' : '1px solid var(--divider)' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 600 }}>{f.nom}</td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{f.metier}</td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{f.contact}</td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>{f.tel}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right' }}><Badge tone="success">{f.actifs}</Badge></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    );
  }

  function Line({ icon, text }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', padding: '3px 0' }}>
        <i className={'ti ti-' + icon} style={{ fontSize: 14, color: 'var(--text-tertiary)', flexShrink: 0 }} />
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{text}</span>
      </div>
    );
  }
  const cardSt = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 15, cursor: 'pointer', transition: 'border-color var(--dur)' };

  window.ClientsFournisseurs = ClientsFournisseurs;
})();
