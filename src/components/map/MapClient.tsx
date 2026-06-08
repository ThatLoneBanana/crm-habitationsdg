'use client'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useRouter } from 'next/navigation'

// Fix icône Leaflet avec Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
})

// Composant qui ajuste le zoom automatiquement pour inclure tous les marqueurs
function AutoFitBounds({ projets }: { projets: any[] }) {
  const map = useMap()

  useEffect(() => {
    const valides = projets.filter(p => p.latitude && p.longitude)
    if (valides.length === 0) return

    const bounds = L.latLngBounds(
      valides.map(p => [p.latitude, p.longitude] as [number, number])
    )
    map.fitBounds(bounds, { padding: [50, 50] })
  }, [projets, map])

  return null
}

// Icônes SVG par type de projet
const iconeParType: Record<string, string> = {
  'MAISON': '/maison.svg',
  'JUMELE': '/jumele.svg',
  'MULTILOGEMENT': '/logement.svg',
}

// Couleurs par phase
const couleurParPhase: Record<string, string> = {
  SIGNE: '#378ADD',
  PREPARATION: '#7F77DD',
  CHANTIER: '#EF9F27',
  LIVRAISON: '#1D9E75',
  TERMINE: '#B4B2A9',
}

// Icônes combinant couleur de phase + icône de type
const creerIcone = (phase: string, typeProjet: string) => {
  const couleur = couleurParPhase[phase] || '#B4B2A9'
  const iconePath = iconeParType[typeProjet] || '/maison.svg'

  return L.divIcon({
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: ${couleur};
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <img
          src="${iconePath}"
          style="
            width: 20px;
            height: 20px;
            transform: rotate(45deg);
            filter: brightness(0) invert(1);
          "
        />
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -44],
    className: '',
  })
}

export default function MapClient({ projets }: { projets: any[] }) {
  const router = useRouter()
  const [filtres, setFiltres] = useState({
    SIGNE: true,
    PREPARATION: true,
    CHANTIER: true,
    LIVRAISON: true,
    TERMINE: false,
  })

  // Centre sur la région Chaudière-Appalaches (Scott, Saint-Gervais, Saint-Anselme, Saint-Apollinaire)
  const centre: [number, number] = [46.60, -70.95]
  const zoomDefaut = 11

  const projetsSurCarte = projets.filter(p => p.latitude && p.longitude)
  const projetsFiltres = projetsSurCarte.filter(p => filtres[p.phase as keyof typeof filtres])

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>

      {/* Légende interactive */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: '24px',
        zIndex: 1000,
        background: 'white',
        borderRadius: '8px',
        padding: '12px 16px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        fontSize: '12px',
        minWidth: '160px',
        fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{ fontWeight: 600, fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
          Afficher
        </div>

        {/* Section Types */}
        <div style={{ fontWeight: 600, fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', marginTop: '4px' }}>
          Types
        </div>
        {[
          { type: 'MAISON', label: 'Maison', icone: '/maison.svg' },
          { type: 'JUMELE', label: 'Jumelé', icone: '/jumele.svg' },
          { type: 'MULTILOGEMENT', label: 'Multilogement', icone: '/logement.svg' },
        ].map(item => (
          <div key={item.type} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
            <img src={item.icone} style={{ width: '16px', height: '16px' }} />
            <span style={{ fontSize: '12px', color: '#374151' }}>{item.label}</span>
            <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#9CA3AF' }}>
              {projetsSurCarte.filter(p => p.typeProjet === item.type).length}
            </span>
          </div>
        ))}

        <div style={{ borderTop: '1px solid #F3F4F6', margin: '10px 0' }} />

        {/* Section Phases */}
        {[
          { phase: 'SIGNE', label: 'Signé', couleur: '#378ADD' },
          { phase: 'PREPARATION', label: 'Préparation', couleur: '#7F77DD' },
          { phase: 'CHANTIER', label: 'Chantier', couleur: '#EF9F27' },
          { phase: 'LIVRAISON', label: 'Livraison', couleur: '#1D9E75' },
          { phase: 'TERMINE', label: 'Terminé', couleur: '#B4B2A9' },
        ].map(item => (
          <label
            key={item.phase}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '6px',
              cursor: 'pointer',
              opacity: filtres[item.phase as keyof typeof filtres] ? 1 : 0.45,
            }}
          >
            <input
              type='checkbox'
              checked={filtres[item.phase as keyof typeof filtres]}
              onChange={() => setFiltres(prev => ({
                ...prev,
                [item.phase]: !prev[item.phase as keyof typeof filtres]
              }))}
              style={{ display: 'none' }}
            />
            {/* Checkbox custom */}
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '4px',
              border: `2px solid ${item.couleur}`,
              background: filtres[item.phase as keyof typeof filtres] ? item.couleur : 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {filtres[item.phase as keyof typeof filtres] && (
                <svg width='10' height='8' viewBox='0 0 10 8' fill='none'>
                  <path d='M1 4L3.5 6.5L9 1' stroke='white' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
                </svg>
              )}
            </div>
            <span style={{ fontSize: '12px', color: '#374151', userSelect: 'none' }}>{item.label}</span>
            {/* Count des projets par phase */}
            <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#9CA3AF' }}>
              {projetsSurCarte.filter(p => p.phase === item.phase).length}
            </span>
          </label>
        ))}

        {/* Séparateur + total visible */}
        <div style={{ borderTop: '1px solid #F3F4F6', marginTop: '8px', paddingTop: '8px', fontSize: '11px', color: '#6B7280', display: 'flex', justifyContent: 'space-between' }}>
          <span>Visibles</span>
          <span style={{ fontWeight: 500 }}>{projetsFiltres.length} / {projetsSurCarte.length}</span>
        </div>
      </div>

      {/* Badge projets sans coordonnées */}
      {projets.length > projetsSurCarte.length && (
        <div style={{
          position: 'absolute', top: '16px', right: '16px',
          zIndex: 1000, background: '#FAEEDA',
          borderRadius: '8px', padding: '8px 12px',
          fontSize: '12px', color: '#854F0B',
          fontFamily: 'Inter, sans-serif'
        }}>
          ⚠ {projets.length - projetsSurCarte.length} projet(s) sans coordonnées
          <button onClick={() => fetch('/api/projets/geocoder')} style={{ marginLeft: '8px', color: '#854F0B', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}>
            Géocoder maintenant
          </button>
        </div>
      )}

      <MapContainer
        center={centre}
        zoom={zoomDefaut}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <AutoFitBounds projets={projetsFiltres} />

        {projetsFiltres.map(projet => (
          <Marker
            key={projet.id}
            position={[projet.latitude, projet.longitude]}
            icon={creerIcone(projet.phase, projet.typeProjet)}
          >
            <Popup maxWidth={280}>
              <div style={{ fontFamily: 'Inter, sans-serif', padding: '4px' }}>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                  {projet.client.prenom} {projet.client.nom}
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                  📍 {projet.adresse}, {projet.ville}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '11px', padding: '2px 8px',
                    borderRadius: '20px', background: '#EAF3DE', color: '#3B6D11'
                  }}>
                    {projet.phase}
                  </span>
                  <span style={{ fontSize: '11px', color: '#666' }}>
                    {projet.avancement || 0}% complété
                  </span>
                </div>
                <div style={{ fontSize: '12px', marginBottom: '12px' }}>
                  🗓 Livraison : {new Date(projet.dateLivraison).toLocaleDateString('fr-CA', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <button
                  onClick={() => router.push(`/projets/${projet.slug || projet.id}`)}
                  style={{
                    width: '100%', padding: '8px',
                    background: '#1D9E75', color: 'white',
                    border: 'none', borderRadius: '6px',
                    cursor: 'pointer', fontSize: '12px', fontWeight: 500
                  }}
                >
                  Ouvrir le projet →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
