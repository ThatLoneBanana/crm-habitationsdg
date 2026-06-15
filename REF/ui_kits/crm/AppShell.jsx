/* App shell — fixed 200px sidebar mirroring the production layout. */
(function () {
  // [label, icon, screenId, badgeCount]
  const NAV_MAIN = [
    ['Dashboard', 'layout-dashboard', 'dashboard'],
    ['Projets', 'building-community', 'projets', 7],
    ['Carte', 'map-2', 'carte'],
    ['Clients', 'users', 'clients'],
    ['Fournisseurs', 'truck', 'fournisseurs'],
    ['Costing', 'chart-bar', 'costing'],
    ['Feuilles de temps', 'clock', 'feuilles'],
  ];
  // Design-system showcase screens (not part of the real product nav)
  const NAV_DEMO = [
    ['Vue mobile', 'device-mobile', 'mobile'],
    ['Vue client', 'eye-share', 'vueclient'],
    ['États & patterns', 'components', 'etats'],
  ];

  // Which nav item highlights for a given screen
  const SCREEN_TO_NAV = { dashboard:'dashboard', projets:'projets', projet:'projets', create:'projets',
    carte:'carte', clients:'clients', fournisseurs:'fournisseurs', costing:'costing', feuilles:'feuilles',
    parametres:'parametres', mobile:'mobile', vueclient:'vueclient', etats:'etats' };

  function NavItem({ label, icon, active, count, onClick, disabled }) {
    const [hover, setHover] = React.useState(false);
    return (
      <a
        onClick={disabled ? undefined : onClick}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          display:'flex', alignItems:'center', gap:8, padding:'8px 10px', borderRadius:6,
          fontSize:13, fontWeight: active ? 600 : 400,
          color: active ? 'var(--dg-red)' : (disabled ? 'var(--text-disabled)' : 'var(--text-primary)'),
          background: active ? 'var(--dg-red-50)' : (hover && !disabled ? 'var(--n-100)' : 'transparent'),
          cursor: disabled ? 'default' : 'pointer', textDecoration:'none', transition:'background .1s',
        }}
      >
        <i className={'ti ti-' + icon} style={{ fontSize:18, color: active ? 'var(--dg-red)' : 'var(--text-tertiary)' }} />
        <span style={{ flex:1 }}>{label}</span>
        {count ? (
          <span style={{ fontSize:10, fontWeight:600, padding:'1px 6px', borderRadius:10,
            background: active ? 'var(--dg-red)' : 'var(--n-200)', color: active ? '#fff' : 'var(--text-secondary)' }}>{count}</span>
        ) : null}
      </a>
    );
  }

  function AppShell({ active, onNavigate, children }) {
    const navActive = SCREEN_TO_NAV[active] || active;
    return (
      <div style={{ display:'flex', minHeight:'100%', background:'var(--bg-app)' }}>
        {/* Sidebar */}
        <aside style={{ width:200, minWidth:200, background:'var(--surface)', borderRight:'1px solid var(--border)',
          display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh' }}>
          <div style={{ padding:'18px 16px 14px', borderBottom:'1px solid var(--divider)' }}>
            <img src="../../assets/habitationsdg.svg" alt="Habitations DG" style={{ width:130, display:'block', cursor:'pointer' }} onClick={() => onNavigate('dashboard')} />
          </div>
          <nav style={{ flex:1, padding:'12px 8px', display:'flex', flexDirection:'column', gap:2, overflowY:'auto' }}>
            {NAV_MAIN.map(([label, icon, screen, count]) => (
              <NavItem key={label} label={label} icon={icon} count={count}
                active={navActive === screen} onClick={() => onNavigate(screen)} />
            ))}
            <div style={{ fontSize:9.5, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--text-disabled)', padding:'14px 10px 6px' }}>Démos design</div>
            {NAV_DEMO.map(([label, icon, screen]) => (
              <NavItem key={label} label={label} icon={icon}
                active={navActive === screen} onClick={() => onNavigate(screen)} />
            ))}
          </nav>
          <div style={{ padding:8, borderTop:'1px solid var(--divider)' }}>
            <NavItem label="Paramètres" icon="settings" active={navActive === 'parametres'} onClick={() => onNavigate('parametres')} />
          </div>
          <div style={{ padding:'12px', borderTop:'1px solid var(--border)', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ width:32, height:32, borderRadius:'50%', background:'var(--success)', color:'#fff',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:600, flexShrink:0 }}>NS</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>Nicolas</div>
              <div style={{ fontSize:10, color:'var(--text-tertiary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>nicolas.savard@habitationsdg.com</div>
            </div>
            <button title="Se déconnecter" style={{ width:28, height:28, border:'1px solid var(--border)', borderRadius:6,
              background:'var(--surface)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'var(--text-secondary)' }}>
              <i className="ti ti-logout" style={{ fontSize:16 }} />
            </button>
          </div>
        </aside>
        {/* Content */}
        <main style={{ flex:1, minWidth:0, overflow:'auto', height:'100vh' }}>{children}</main>
      </div>
    );
  }

  window.AppShell = AppShell;
})();
