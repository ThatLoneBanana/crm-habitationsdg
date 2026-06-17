'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatMontant, formatMontantCourt } from '@/lib/utils'
import { ProjetIdentite } from '@/components/projets/ProjetIdentite'
import { NotesPanel } from '@/components/notes/notes-panel'

const PHASES: Record<string, { label: string; tint: string; ink: string; bar: string }> = {
  SIGNE:       { label: 'Signé',       tint: 'var(--phase-signe-tint)',       ink: 'var(--phase-signe-ink)',       bar: 'var(--phase-signe-bar)' },
  PREPARATION: { label: 'Préparation', tint: 'var(--phase-preparation-tint)', ink: 'var(--phase-preparation-ink)', bar: 'var(--phase-preparation-bar)' },
  CHANTIER:    { label: 'Chantier',    tint: 'var(--phase-chantier-tint)',    ink: 'var(--phase-chantier-ink)',    bar: 'var(--phase-chantier-bar)' },
  LIVRAISON:   { label: 'Livraison',   tint: 'var(--phase-livraison-tint)',   ink: 'var(--phase-livraison-ink)',   bar: 'var(--phase-livraison-bar)' },
  TERMINE:     { label: 'Terminé',     tint: 'var(--phase-termine-tint)',     ink: 'var(--phase-termine-ink)',     bar: 'var(--phase-termine-bar)' },
}
function phaseConfig(phase: string | null | undefined) {
  return PHASES[phase ?? 'SIGNE'] ?? PHASES.SIGNE
}

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'
const TONE_TEXT: Record<Tone, string> = {
  neutral: 'var(--text-primary)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger:  'var(--danger)',
  info:    'var(--info)',
}
const BADGE_TONE: Record<Tone, { bg: string; color: string }> = {
  neutral: { bg: 'var(--n-100)',       color: 'var(--text-secondary)' },
  success: { bg: 'var(--success-tint)', color: 'var(--success-text)' },
  warning: { bg: 'var(--warning-tint)', color: 'var(--warning-text)' },
  danger:  { bg: 'var(--danger-tint)',  color: 'var(--danger-text)' },
  info:    { bg: 'var(--info-tint)',    color: 'var(--info-text)' },
}

/* — Primitives DG (tokens uniquement, aucune couleur hardcodée) — */

function MetricCard({ icon, label, value, sub, tone = 'neutral' }: { icon: string; label: string; value: React.ReactNode; sub?: string; tone?: Tone }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '13px 15px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
        <i className={`ti ${icon}`} aria-hidden="true" style={{ fontSize: 14, color: 'var(--text-tertiary)' }}></i>
        {label}
      </div>
      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, lineHeight: 'var(--lh-tight)', letterSpacing: 'var(--ls-tight)', color: TONE_TEXT[tone], fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
      {sub ? <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 3 }}>{sub}</div> : null}
    </div>
  )
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', ...style }}>
      {children}
    </div>
  )
}

function CardHeader({ icon, iconColor, title, action }: { icon: string; iconColor?: string; title: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 14px', background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>
        <i className={`ti ${icon}`} aria-hidden="true" style={{ fontSize: 15, color: iconColor ?? 'var(--text-secondary)' }}></i>
        {title}
      </span>
      {action ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>{action}</span> : null}
    </div>
  )
}

function Badge({ tone = 'neutral', pill = false, children }: { tone?: Tone; pill?: boolean; children: React.ReactNode }) {
  const skin = BADGE_TONE[tone]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-2xs)', fontWeight: 600, lineHeight: 1, letterSpacing: '.01em', whiteSpace: 'nowrap', padding: '3px 7px', borderRadius: pill ? 'var(--radius-full)' : 'var(--radius)', background: skin.bg, color: skin.color }}>
      {children}
    </span>
  )
}

function PhaseBadge({ phase }: { phase: string | null | undefined }) {
  const p = phaseConfig(phase)
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 'var(--text-2xs)', fontWeight: 600, lineHeight: 1, letterSpacing: '.01em', whiteSpace: 'nowrap', padding: '3px 8px', borderRadius: 'var(--radius-full)', background: p.tint, color: p.ink }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: p.bar, flex: '0 0 auto' }}></span>
      {p.label}
    </span>
  )
}

function ProgressBar({ value, phase }: { value: number; phase: string | null | undefined }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div style={{ height: 3, background: 'var(--n-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: phaseConfig(phase).bar, borderRadius: 'var(--radius-full)', transition: 'width var(--dur-slow) var(--ease-out)' }} />
    </div>
  )
}

function Row({ children, onClick, last }: { children: React.ReactNode; onClick?: () => void; last?: boolean }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ borderBottom: last ? 'none' : '1px solid var(--divider)', background: hover ? 'var(--surface-subtle)' : 'transparent', cursor: onClick ? 'pointer' : 'default', transition: 'background var(--dur-fast)' }}
    >
      {children}
    </div>
  )
}

export default function DashboardClient({
  projetsActifs, livraisonsCeMois, montantTotal,
  alertes, agendaSemaine, projets,
  extrasNonSignes, montantExtrasNonSignes,
  paiementsAttendus, montantPaiementsAttendus,
  prenomUser, notes, projetsPourTag
}: any) {
  const router = useRouter()
  const now = new Date()
  const joursLabels = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi']
  const moisLabels = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']

  const nbEtapes = agendaSemaine.reduce((s: number, j: any) => s + j.etapes.length, 0)

  const metrics: { icon: string; label: string; value: React.ReactNode; sub: string; tone: Tone }[] = [
    { icon: 'ti-building-community', label: 'Projets actifs',     value: projetsActifs,                  sub: `${livraisonsCeMois} livraison(s) ce mois`,              tone: 'neutral' },
    { icon: 'ti-currency-dollar',    label: 'En chantier',        value: formatMontantCourt(montantTotal), sub: 'valeur totale active',                                     tone: 'success' },
    { icon: 'ti-receipt',            label: 'Extras non signés',  value: extrasNonSignes,                  sub: `${formatMontant(montantExtrasNonSignes, 0)} à confirmer`,   tone: extrasNonSignes > 0 ? 'warning' : 'neutral' },
    { icon: 'ti-cash',               label: 'Paiements attendus', value: paiementsAttendus,                sub: `${formatMontant(montantPaiementsAttendus, 0)} à recevoir`,  tone: paiementsAttendus > 0 ? 'info' : 'neutral' },
  ]

  return (
    <div style={{ padding: '22px 24px 40px' }}>
      {/* En-tête */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>
            Bonjour {prenomUser} <span style={{ fontWeight: 400 }}>👋</span>
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>
            {joursLabels[now.getDay()]} {now.getDate()} {moisLabels[now.getMonth()]} {now.getFullYear()}
          </p>
        </div>
      </div>

      {/* Grille EXTERNE (CSS-lift) : région principale (flexible) | colonne Notes
          (320px, pleine hauteur). Mobile (< md) → une colonne, colonne Notes masquée. */}
      <div className="grid-cols-1 md:grid-cols-[minmax(0,1fr)_320px]" style={{ display: 'grid', gap: 20 }}>

        {/* RÉGION PRINCIPALE — KPI + grille interne */}
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Métriques (CSS-lift : 2 col mobile → 4 col desktop) */}
          <div className="grid-cols-2 md:grid-cols-4" style={{ display: 'grid', gap: 10 }}>
            {metrics.map((m, i) => (
              <MetricCard key={i} icon={m.icon} label={m.label} value={m.value} sub={m.sub} tone={m.tone} />
            ))}
          </div>

          {/* Grille INTERNE (CSS-lift) : alertes + agenda (1fr) | Tous les projets (340px) */}
          <div className="grid-cols-1 md:grid-cols-[1fr_340px]" style={{ display: 'grid', gap: 20, alignItems: 'start' }}>

        {/* COLONNE GAUCHE — Alertes + Agenda */}
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Alertes */}
          {alertes.length > 0 && (
            <Card>
              <CardHeader icon="ti-bell" iconColor="var(--dg-red)" title="Alertes prioritaires" action={<Badge tone="danger">{alertes.length}</Badge>} />
              {alertes.map((a: any, i: number) => (
                <Row key={i} last={i === alertes.length - 1} onClick={() => router.push(`/projets/${a.projetId}`)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 14px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: a.type === 'urgent' ? 'var(--danger)' : 'var(--warning)', flexShrink: 0 }}></span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.titre}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>{a.sous}</div>
                    </div>
                    <Badge tone={a.type === 'urgent' ? 'danger' : 'warning'} pill>{a.badge}</Badge>
                    <i className="ti ti-chevron-right" aria-hidden="true" style={{ fontSize: 15, color: 'var(--text-disabled)' }}></i>
                  </div>
                </Row>
              ))}
            </Card>
          )}

          {/* Agenda */}
          <Card>
            <CardHeader icon="ti-calendar-week" iconColor="var(--dg-red)" title="Agenda de la semaine" action={<span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{nbEtapes} étapes</span>} />
            {agendaSemaine.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 12 }}>
                Aucune étape planifiée cette semaine
              </div>
            ) : agendaSemaine.map((jour: any, ji: number) => (
              <div key={ji}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '6px 14px', background: 'var(--surface-subtle)', borderBottom: '1px solid var(--divider)', borderTop: ji > 0 ? '1px solid var(--divider)' : 'none', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  <span>{jour.label}</span>
                </div>
                {jour.etapes.map((e: any, ei: number) => {
                  const estInterne = !e.assigneA || e.assigneA === 'Interne'
                  const fournisseurLabel = estInterne ? 'Habitations DG' : e.assigneA
                  return (
                  <Row key={ei} last={ei === jour.etapes.length - 1} onClick={() => router.push(`/projets/${e.projetSlug}`)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px' }}>
                      <span style={{ width: 3, height: 30, borderRadius: 2, background: phaseConfig(e.phase).bar, flexShrink: 0 }}></span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 500 }}>{e.nom}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.projet} · {e.client}</div>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 7px', borderRadius: 'var(--radius-full)', background: estInterne ? 'var(--n-100)' : 'var(--n-150)', color: 'var(--text-secondary)', whiteSpace: 'nowrap', flexShrink: 0 }}>{fournisseurLabel}</span>
                    </div>
                  </Row>
                  )
                })}
              </div>
            ))}
          </Card>
        </div>

        {/* COLONNE — Tous les projets (340px) */}
        <Card>
          <CardHeader icon="ti-list" title="Tous les projets" action={<span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{projets.length}</span>} />
          {projets.map((p: any, i: number) => (
            <Row key={i} last={i === projets.length - 1} onClick={() => router.push(`/projets/${p.slug || p.id}`)}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 14px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <ProjetIdentite adresse={p.adresse} ville={p.ville} client={`${p.client.prenom} ${p.client.nom}`} />
                  {p.prochaineEtape && (
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>↳ {p.prochaineEtape.nom}</div>
                  )}
                  <div style={{ marginTop: 6 }}><ProgressBar value={p.avancement} phase={p.phase} /></div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                  <PhaseBadge phase={p.phase} />
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{p.avancement}%</div>
                  {p.joursRestants !== null && (
                    <div style={{ fontSize: 10, fontWeight: 500, color: p.joursRestants <= 14 ? 'var(--danger)' : 'var(--success-text)', fontVariantNumeric: 'tabular-nums' }}>{p.joursRestants} j</div>
                  )}
                </div>
              </div>
            </Row>
          ))}
        </Card>

          </div>
          {/* fin grille interne */}

        </div>
        {/* fin région principale */}

        {/* COLONNE NOTES — extrême droite, pleine hauteur (desktop seulement ;
            sur mobile, Notes = destination /notes du bottombar). */}
        <div className="hidden md:block">
          <NotesPanel notesInitiales={notes || []} projets={projetsPourTag || []} />
        </div>

      </div>
    </div>
  )
}
