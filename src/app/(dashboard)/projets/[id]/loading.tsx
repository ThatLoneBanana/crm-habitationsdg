// Skeleton de streaming de la fiche projet (remplace le « Chargement... »
// bloquant). Calque le layout : en-tête + bande d'aperçu + onglets + zone cédule.
const block = (w: number | string, h: number, r = 6): React.CSSProperties => ({
  width: w, height: h, borderRadius: r, background: 'var(--n-100)',
});

export default function Loading() {
  return (
    <div className="p-8 space-y-8 animate-pulse">
      {/* En-tête */}
      <div>
        <div style={block(120, 12)} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, marginTop: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={block(320, 28)} />
            <div style={block(240, 14)} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[0, 1, 2, 3].map((i) => <div key={i} style={block(96, 34)} />)}
          </div>
        </div>

        {/* Bande d'aperçu — 4 cellules */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginTop: 18 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ background: 'var(--surface)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={block(90, 10)} />
              <div style={block(72, 20)} />
            </div>
          ))}
        </div>
      </div>

      {/* Onglets */}
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4, marginBottom: 18 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={block('100%', 34)} />)}
        </div>
        {/* Zone cédule */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => <div key={i} style={block('100%', 38)} />)}
        </div>
      </div>
    </div>
  );
}
