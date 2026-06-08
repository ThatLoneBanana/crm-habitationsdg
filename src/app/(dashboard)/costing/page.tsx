'use client'
import { useState, useEffect } from 'react'
import { TrendingUp } from 'lucide-react'

interface ProjetCosting {
  id: string
  numero: string
  adresse: string
  montantTotal: number
  depensesMateriaux: number
  depensesSousTraitant: number
  depensesMainOeuvre: number
  depensesTotal: number
}

export default function CostingPage() {
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

  if (loading) return <div style={{ padding: '24px' }}>Chargement...</div>

  const totalContrat = projets.reduce((s, p) => s + (p.montantTotal || 0), 0)
  const totalDepenses = projets.reduce((s, p) => s + p.depensesTotal, 0)
  const profitBrut = totalContrat - totalDepenses
  const marge = totalContrat > 0 ? (profitBrut / totalContrat * 100) : 0

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <TrendingUp size={24} color="#ea1c24" />
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Costing</h1>
      </div>

      {/* Résumé Global */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', background: '#FAFAFA' }}>
          <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Total contrats</div>
          <div style={{ fontSize: '20px', fontWeight: '600' }}>${totalContrat.toFixed(0)}</div>
        </div>
        <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', background: '#FAFAFA' }}>
          <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Total dépenses</div>
          <div style={{ fontSize: '20px', fontWeight: '600' }}>${totalDepenses.toFixed(0)}</div>
        </div>
        <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', background: '#FAFAFA' }}>
          <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Profit brut</div>
          <div style={{ fontSize: '20px', fontWeight: '600', color: profitBrut >= 0 ? '#3B6D11' : '#DC2626' }}>
            ${profitBrut.toFixed(0)}
          </div>
        </div>
        <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', background: '#FAFAFA' }}>
          <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Marge</div>
          <div style={{ fontSize: '20px', fontWeight: '600', color: marge > 20 ? '#3B6D11' : marge > 10 ? '#D97706' : '#DC2626' }}>
            {marge.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Tableau Projets */}
      <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#F9FAFB' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Projet</th>
              <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Contrat</th>
              <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Matériaux</th>
              <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>S-Traitants</th>
              <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>M-Oeuvre</th>
              <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Profit</th>
              <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Marge %</th>
            </tr>
          </thead>
          <tbody>
            {projets.map((p, i) => {
              const profit = (p.montantTotal || 0) - p.depensesTotal
              const margin = (p.montantTotal || 0) > 0 ? (profit / (p.montantTotal || 1) * 100) : 0
              const marginColor = margin > 20 ? '#3B6D11' : margin > 10 ? '#D97706' : '#DC2626'

              return (
                <tr key={p.id} style={{ borderBottom: i < projets.length - 1 ? '1px solid #F3F4F6' : 'none', background: i % 2 === 0 ? 'white' : '#F9FAFB' }}>
                  <td style={{ padding: '12px', fontSize: '13px', fontWeight: 500 }}>{p.numero} — {p.adresse}</td>
                  <td style={{ padding: '12px', fontSize: '13px', textAlign: 'right' }}>${(p.montantTotal || 0).toFixed(0)}</td>
                  <td style={{ padding: '12px', fontSize: '13px', textAlign: 'right' }}>${p.depensesMateriaux.toFixed(0)}</td>
                  <td style={{ padding: '12px', fontSize: '13px', textAlign: 'right' }}>${p.depensesSousTraitant.toFixed(0)}</td>
                  <td style={{ padding: '12px', fontSize: '13px', textAlign: 'right' }}>${p.depensesMainOeuvre.toFixed(0)}</td>
                  <td style={{ padding: '12px', fontSize: '13px', textAlign: 'right', fontWeight: 500, color: profit >= 0 ? '#3B6D11' : '#DC2626' }}>
                    ${profit.toFixed(0)}
                  </td>
                  <td style={{ padding: '12px', fontSize: '13px', textAlign: 'right', fontWeight: 500, color: marginColor }}>
                    {margin.toFixed(1)}%
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
