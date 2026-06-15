/* Écran — Carte : vue Leaflet, marqueurs par phase, légende-filtre interactive. */
(function () {
  const NS = window.HabitationsDGDesignSystem_408490;
  const { FilterChip, PhaseBadge, Card, Badge } = NS;
  const TYPE_LABEL = { MAISON: 'Maison', JUMELE: 'Jumelé', LOGEMENT: 'Logement' };
  const TYPE_ICON = { MAISON: 'home', JUMELE: 'home-2', LOGEMENT: 'building' };

  function markerHtml(phaseColor, typeIcon) {
    return `<div style="position:relative;width:30px;height:38px;">
      <div style="position:absolute;left:50%;top:0;transform:translateX(-50%);width:30px;height:30px;border-radius:50% 50% 50% 0;transform-origin:center;rotate:-45deg;background:${phaseColor};border:2px solid #fff;box-shadow:0 2px 5px rgba(31,29,27,.3);"></div>
      <div style="position:absolute;left:50%;top:14px;transform:translate(-50%,-50%);color:#fff;font-size:13px;display:flex;"><i class="ti ti-${typeIcon}"></i></div>
    </div>`;
  }

  function Carte({ onOpenProject }) {
    const DGd = window.DG;
    const mapRef = React.useRef(null);
    const mapObj = React.useRef(null);
    const layer = React.useRef(null);
    const [phase, setPhase] = React.useState(null);
    const [selected, setSelected] = React.useState(null);

    const counts = {};
    DGd.projets.forEach(p => { counts[p.phase] = (counts[p.phase] || 0) + 1; });
    const PHASES = ['SIGNE', 'PREPARATION', 'CHANTIER', 'LIVRAISON', 'TERMINE'];

    React.useEffect(() => {
      if (!window.L || mapObj.current) return;
      const map = window.L.map(mapRef.current, { scrollWheelZoom: true, attributionControl: false, zoomControl: false }).setView([46.62, -70.86], 9);
      window.L.control.zoom({ position: 'topright' }).addTo(map);
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);
      mapObj.current = map;
      layer.current = window.L.layerGroup().addTo(map);
      drawMarkers();
      setTimeout(() => map.invalidateSize(), 200);
    }, []);

    function drawMarkers() {
      if (!layer.current) return;
      layer.current.clearLayers();
      DGd.projets.filter(p => !phase || p.phase === phase).forEach(p => {
        const ph = DGd.phase(p.phase);
        const icon = window.L.divIcon({ html: markerHtml(ph.bar, TYPE_ICON[p.type]), className: 'dg-marker', iconSize: [30, 38], iconAnchor: [15, 32] });
        const m = window.L.marker([p.lat, p.lng], { icon }).addTo(layer.current);
        m.on('click', () => setSelected(p.id));
      });
    }
    React.useEffect(() => { drawMarkers(); }, [phase]);

    const sel = selected ? DGd.projets.find(p => p.id === selected) : null;

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '18px 24px 14px' }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Carte des chantiers</h1>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>{DGd.projets.length} projets en Chaudière-Appalaches</p>
        </div>
        <div style={{ position: 'relative', flex: 1, minHeight: 480, margin: '0 24px 24px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <div ref={mapRef} style={{ position: 'absolute', inset: 0, background: 'var(--n-100)' }} />

          {/* Légende-filtre */}
          <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 500, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', padding: 12, width: 200 }}>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', marginBottom: 9 }}>Filtrer par phase</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <FilterChip label="Tous les projets" count={DGd.projets.length} active={phase == null} onClick={() => setPhase(null)} />
              {PHASES.map(ph => counts[ph] ? (
                <FilterChip key={ph} label={DGd.phase(ph).label} dotColor={DGd.phase(ph).bar} count={counts[ph]} active={phase === ph} onClick={() => setPhase(phase === ph ? null : ph)} />
              ) : null)}
            </div>
          </div>

          {/* Carte projet sélectionné */}
          {sel ? (
            <div style={{ position: 'absolute', bottom: 14, right: 14, zIndex: 500, width: 270, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
              <div style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{sel.adresse}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{sel.ville} · {sel.client}</div>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 2 }}><i className="ti ti-x" style={{ fontSize: 15 }} /></button>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 9 }}>
                  <PhaseBadge phase={sel.phase} />
                  <Badge tone="neutral">{TYPE_LABEL[sel.type]}</Badge>
                </div>
                <button onClick={() => onOpenProject && onOpenProject(sel.id)} style={{ marginTop: 12, width: '100%', height: 30, border: '1px solid var(--border-strong)', borderRadius: 'var(--radius)', background: 'var(--surface)', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-sans)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--text-primary)' }}>
                  Ouvrir le projet <i className="ti ti-arrow-right" style={{ fontSize: 14 }} />
                </button>
              </div>
            </div>
          ) : null}

          {/* Légende type */}
          <div style={{ position: 'absolute', bottom: 14, left: 12, zIndex: 500, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: '8px 11px', display: 'flex', gap: 14 }}>
            {Object.keys(TYPE_LABEL).map(t => (
              <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-secondary)' }}>
                <i className={'ti ti-' + TYPE_ICON[t]} style={{ fontSize: 14, color: 'var(--text-tertiary)' }} />{TYPE_LABEL[t]}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  window.Carte = Carte;
})();
