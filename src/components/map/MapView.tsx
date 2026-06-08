'use client'
import dynamic from 'next/dynamic'

const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Chargement de la carte...
    </div>
  )
})

export default function MapView({ projets }: { projets: any[] }) {
  return <MapClient projets={projets} />
}
