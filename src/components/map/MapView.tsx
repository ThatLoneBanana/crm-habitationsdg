'use client'
import dynamic from 'next/dynamic'

const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'var(--surface-subtle)', color: 'var(--text-tertiary)' }}>
      <i className="ti ti-map-pin" aria-hidden="true" style={{ fontSize: 28, color: 'var(--text-disabled)' }} />
      <span style={{ fontSize: 13 }}>Chargement de la carte…</span>
    </div>
  )
})

export default function MapView({ projets }: { projets: any[] }) {
  return <MapClient projets={projets} />
}
