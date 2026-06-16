'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatMontant, formatMontantCourt } from '@/lib/utils'
import { BigStat, SANTE_COLOR, SANTE_LABEL, santeFromMarge, formatPct } from '@/components/costing/BigStat'

interface ProjetCosting {
  id: string
  numero: string
  adresse: string
  ville: string
  montantTotal: number
  depensesMateriaux: number
  depensesSousTraitant: number
  depensesMainOeuvre: number
  depensesTotal: number
}

const TH: React.CSSProperties = {
  padding: '9px 14px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
  letterSpacing: '0.04em', color: 'var(--text-tertiary)', whiteSpace: 'nowrap',
}

export default function CostingPage() {
  const router = useRouter()
  const [projets, setProjets] = useState<ProjetCosting[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjets()
  }, [])

  const loadProjets = async () => {
    try {
      const res = await fetch('/api/costing')
      if (res.ok) {
        const data = await res.json()
        setProjets(data.projets || [])
      }
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div style={{ padding: '24px', color: 'var(--text-secondary)' }}>Chargement…</div>

  // Calculs inchangés (revenus = contrat ; dépenses = total engagé)
  const totalContrat = projets.reduce((s, p) => s + (p.montantTotal || 0), 0)
  const totalDepenses = projets.reduce((s, p) => s + p.depensesTotal, 0)
  const profitBrut = totalContrat - totalDepenses
  const marge = totalContrat > 0 ? (profitBrut / totalContrat * 100) : 0
  const santeGlobale = santeFromMarge(marge)

  return (
    <div style={{ padding: '22px 24px 40px' }}>
      {/* En-tête */}
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Costing</h1>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>Santé financière de tous les projets actifs · {projets.length} projets</p>
      </div>

      {/* 4 BigStats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        <BigStat icon="trending-up" label="Revenus totaux" value={formatMontantCourt(totalContrat)} sub="contrats signés" />
        <BigStat icon="trending-down" label="Dépenses" value={formatMontantCourt(totalDepenses)} sub="budget engagé" />
        <BigStat icon="businessplan" label="Profit projeté" value={formatMontantCourt(profitBrut)} tone={santeGlobale} />
        <BigStat icon="percentage" label="Marge moyenne" value={formatPct(marge)} tone={santeGlobale} sub={SANTE_LABEL[santeGlobale]} />
      </div>

      {/* Profitabilité par projet */}
      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 14px', background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>
          <i className="ti ti-chart-bar" aria-hidden="true" style={{ fontSize: 15, color: 'var(--text-secondary)' }} />
          Profitabilité par projet
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)' }}>
              {[['Projet', 'left'], ['Revenus', 'right'], ['Dépenses', 'right'], ['Profit', 'right'], ['Marge', 'right'], ['Santé', 'left']].map((h, i) => (
                <th key={i} style={{ ...TH, textAlign: h[1] as 'left' | 'right' }}>{h[0]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projets.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-tertiary)' }}>Aucun projet</td></tr>
            ) : (
              projets.map((p, i) => {
                const revenus = p.montantTotal || 0
                const profit = revenus - p.depensesTotal
                const margePct = revenus > 0 ? (profit / revenus * 100) : 0
                const sante = santeFromMarge(margePct)
                return (
                  <tr key={p.id} onClick={() => router.push(`/projets/${p.id}`)}
                    style={{ borderBottom: i === projets.length - 1 ? 'none' : '1px solid var(--divider)', cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-subtle)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.adresse}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{p.ville}</div>
                    </td>
                    <td style={{ padding: '11px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--text-primary)' }}>{formatMontant(revenus, 0)}</td>
                    <td style={{ padding: '11px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary)' }}>{formatMontant(p.depensesTotal, 0)}</td>
                    <td style={{ padding: '11px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: SANTE_COLOR[sante] }}>{formatMontant(profit, 0)}</td>
                    <td style={{ padding: '11px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: SANTE_COLOR[sante] }}>{formatPct(margePct)}</td>
                    <td style={{ padding: '11px 14px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 500, color: SANTE_COLOR[sante] }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: SANTE_COLOR[sante] }} />{SANTE_LABEL[sante]}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
