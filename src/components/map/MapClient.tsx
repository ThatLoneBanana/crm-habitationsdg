'use client'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
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

// Ajuste le zoom pour inclure tous les marqueurs visibles (logique préservée)
function AutoFitBounds({ projets }: { projets: any[] }) {
  const map = useMap()
  useEffect(() => {
    const valides = projets.filter((p) => p.latitude && p.longitude)
    if (valides.length === 0) return
    const bounds = L.latLngBounds(valides.map((p) => [p.latitude, p.longitude] as [number, number]))
    map.fitBounds(bounds, { padding: [50, 50] })
  }, [projets, map])
  return null
}

// Icônes SVG par type de projet (conservées — rendu fiable, blanc sur la goutte)
const iconeParType: Record<string, string> = {
  MAISON: '/maison.svg',
  JUMELE: '/jumele.svg',
  MULTILOGEMENT: '/logement.svg',
}

// Couleurs par phase — alignées sur la palette du design system (LIVRAISON = #639922)
const couleurParPhase: Record<string, string> = {
  SIGNE: '#378ADD',
  PREPARATION: '#7F77DD',
  CHANTIER: '#EF9F27',
  LIVRAISON: '#639922',
  TERMINE: '#B4B2A9',
}

// Métadonnées de phase pour badges (tokens) + légende
const PHASES = ['SIGNE', 'PREPARATION', 'CHANTIER', 'LIVRAISON', 'TERMINE'] as const
const PHASE_META: Record<string, { label: string; tint: string; ink: string }> = {
  SIGNE:       { label: 'Signé',       tint: 'var(--phase-signe-tint)',       ink: 'var(--phase-signe-ink)' },
  PREPARATION: { label: 'Préparation', tint: 'var(--phase-preparation-tint)', ink: 'var(--phase-preparation-ink)' },
  CHANTIER:    { label: 'Chantier',    tint: 'var(--phase-chantier-tint)',    ink: 'var(--phase-chantier-ink)' },
  LIVRAISON:   { label: 'Livraison',   tint: 'var(--phase-livraison-tint)',   ink: 'var(--phase-livraison-ink)' },
  TERMINE:     { label: 'Terminé',     tint: 'var(--phase-termine-tint)',     ink: 'var(--phase-termine-ink)' },
}

const TYPES = [
  { type: 'MAISON', label: 'Maison', icone: '/maison.svg' },
  { type: 'JUMELE', label: 'Jumelé', icone: '/jumele.svg' },
  { type: 'MULTILOGEMENT', label: 'Multilogement', icone: '/logement.svg' },
]

// Icône combinant couleur de phase + icône de type (goutte)
const creerIcone = (phase: string, typeProjet: string) => {
  const couleur = couleurParPhase[phase] || '#B4B2A9'
  const iconePath = iconeParType[typeProjet] || '/maison.svg'
  return L.divIcon({
    html: `
      <div style="position:relative;width:34px;height:42px;">
        <div style="position:absolute;left:50%;top:0;transform:translateX(-50%) rotate(-45deg);transform-origin:center;width:30px;height:30px;background:${couleur};border:2px solid #fff;border-radius:50% 50% 50% 0;box-shadow:0 2px 6px rgba(31,29,27,0.3);"></div>
        <img src="${iconePath}" style="position:absolute;left:50%;top:13px;transform:translate(-50%,-50%);width:16px;height:16px;filter:brightness(0) invert(1);" />
      </div>
    `,
    iconSize: [34, 42],
    iconAnchor: [17, 34],
    className: '',
  })
}

function PhaseBadge({ phase }: { phase: string }) {
  const m = PHASE_META[phase]
  if (!m) return null
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 'var(--text-2xs)', fontWeight: 600, lineHeight: 1, whiteSpace: 'nowrap', padding: '3px 8px', borderRadius: 'var(--radius-full)', background: m.tint, color: m.ink }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: couleurParPhase[phase], flex: '0 0 auto' }} />
      {m.label}
    </span>
  )
}

const panel: React.CSSProperties = {
  position: 'absolute', zIndex: 500, background: 'var(--surface)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)',
}
const eyebrow: React.CSSProperties = {
  fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)',
}

export default function MapClient({ projets }: { projets: any[] }) {
  const router = useRouter()
  // Filtres multi-sélection — TERMINE décoché par défaut (comportement préservé)
  const [filtres, setFiltres] = useState<Record<string, boolean>>({
    SIGNE: true, PREPARATION: true, CHANTIER: true, LIVRAISON: true, TERMINE: false,
  })
  const [selected, setSelected] = useState<any>(null)

  const centre: [number, number] = [46.60, -70.95]
  const projetsSurCarte = projets.filter((p) => p.latitude && p.longitude)
  const projetsFiltres = projetsSurCarte.filter((p) => filtres[p.phase as string])

  const toggle = (ph: string) => setFiltres((prev) => ({ ...prev, [ph]: !prev[ph] }))
  const typeLabel = (t: string) => TYPES.find((x) => x.type === t)?.label || t

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      {/* Légende-filtre par phase (haut-gauche) */}
      <div style={{ ...panel, top: 12, left: 12, padding: 12, width: 200 }}>
        <div style={{ ...eyebrow, marginBottom: 9 }}>Filtrer par phase</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {PHASES.map((ph) => {
            const on = filtres[ph]
            const count = projetsSurCarte.filter((p) => p.phase === ph).length
            return (
              <button key={ph} onClick={() => toggle(ph)} style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '6px 9px',
                border: '1px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer',
                fontFamily: 'var(--font-sans)', fontSize: 12, textAlign: 'left',
                background: on ? 'var(--surface-subtle)' : 'var(--surface)',
                color: on ? 'var(--text-primary)' : 'var(--text-tertiary)', opacity: on ? 1 : 0.6,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: couleurParPhase[ph], flex: '0 0 auto' }} />
                <span style={{ flex: 1 }}>{PHASE_META[ph].label}</span>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Badge projets sans coordonnées (conservé) */}
      {projets.length > projetsSurCarte.length && (
        <div style={{ ...panel, top: 12, right: 12, padding: '8px 12px', fontSize: 12, color: 'var(--warning-text)', background: 'var(--warning-tint)', border: 'none' }}>
          {projets.length - projetsSurCarte.length} projet(s) sans coordonnées
          <button onClick={() => fetch('/api/projets/geocoder')} style={{ marginLeft: 8, color: 'var(--warning-text)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}>
            Géocoder
          </button>
        </div>
      )}

      {/* Carte projet sélectionné (bas-droite) */}
      {selected && (
        <div style={{ ...panel, bottom: 14, right: 14, width: 270, boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{selected.adresse}</div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{selected.ville} · {selected.client?.prenom} {selected.client?.nom}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 2 }}><i className="ti ti-x" style={{ fontSize: 15 }} /></button>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 9, flexWrap: 'wrap' }}>
              <PhaseBadge phase={selected.phase} />
              <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 'var(--text-2xs)', fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--radius-full)', background: 'var(--n-100)', color: 'var(--text-secondary)' }}>{typeLabel(selected.typeProjet)}</span>
            </div>
            <button onClick={() => router.push(`/projets/${selected.slug || selected.id}`)} style={{ marginTop: 12, width: '100%', height: 32, border: '1px solid var(--border-strong)', borderRadius: 'var(--radius)', background: 'var(--surface)', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-sans)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--text-primary)' }}>
              Ouvrir le projet <i className="ti ti-arrow-right" style={{ fontSize: 14 }} />
            </button>
          </div>
        </div>
      )}

      {/* Légende type (bas-gauche) */}
      <div style={{ ...panel, bottom: 14, left: 12, padding: '8px 11px', display: 'flex', gap: 14, boxShadow: 'var(--shadow-sm)' }}>
        {TYPES.map((t) => (
          <span key={t.type} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-secondary)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.icone} alt="" style={{ width: 14, height: 14 }} />
            {t.label}
          </span>
        ))}
      </div>

      <MapContainer center={centre} zoom={11} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
        {/* Tuiles claires CartoDB (REF) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <AutoFitBounds projets={projetsFiltres} />
        {projetsFiltres.map((projet) => (
          <Marker
            key={projet.id}
            position={[projet.latitude, projet.longitude]}
            icon={creerIcone(projet.phase, projet.typeProjet)}
            eventHandlers={{ click: () => setSelected(projet) }}
          />
        ))}
      </MapContainer>
    </div>
  )
}
