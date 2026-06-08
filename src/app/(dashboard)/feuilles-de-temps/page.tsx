'use client'
import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

interface FeuilleTemps {
  id: string
  projetId: string
  userId: string
  date: string
  heures: number
  tauxHoraire: number
  notes?: string
  approuve: boolean
  projet: { id: string; adresse: string; numero: string }
  user: { id: string; prenom: string; nom: string }
}

export default function FeuillesDeTempsPage() {
  const [feuilles, setFeuilles] = useState<FeuilleTemps[]>([])
  const [loading, setLoading] = useState(true)
  const [nouvelleDlg, setNouvelleDlg] = useState(false)
  const [filtreProjet, setFiltreProjet] = useState('')
  const [filtreEmploye, setFiltreEmploye] = useState('')
  const [filtreSemaine, setFiltreSemaine] = useState('')

  useEffect(() => {
    loadFeuilles()
  }, [filtreProjet, filtreEmploye, filtreSemaine])

  const loadFeuilles = async () => {
    try {
      const params = new URLSearchParams()
      if (filtreProjet) params.append('projetId', filtreProjet)
      if (filtreEmploye) params.append('userId', filtreEmploye)
      if (filtreSemaine) params.append('semaine', filtreSemaine)

      const res = await fetch(`/api/feuilles-de-temps?${params}`)
      if (res.ok) {
        const data = await res.json()
        setFeuilles(data.feuilles || [])
      }
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setLoading(false)
    }
  }

  const totalHeures = feuilles.reduce((s, f) => s + f.heures, 0)
  const totalMontant = feuilles.reduce((s, f) => s + (f.heures * f.tauxHoraire), 0)
  const approuvees = feuilles.filter(f => f.approuve).length

  if (loading) return <div style={{ padding: '24px' }}>Chargement...</div>

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Clock size={24} color="#ea1c24" />
          <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Feuilles de temps</h1>
        </div>
        <button onClick={() => setNouvelleDlg(true)} style={{ padding: '10px 16px', background: '#ea1c24', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
          + Ajouter
        </button>
      </div>

      {/* Résumé */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
        <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', background: '#FAFAFA' }}>
          <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Total heures</div>
          <div style={{ fontSize: '24px', fontWeight: '600' }}>{totalHeures.toFixed(1)}h</div>
        </div>
        <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', background: '#FAFAFA' }}>
          <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Total montant</div>
          <div style={{ fontSize: '24px', fontWeight: '600' }}>${totalMontant.toFixed(2)}</div>
        </div>
        <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', background: '#FAFAFA' }}>
          <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Approuvées</div>
          <div style={{ fontSize: '24px', fontWeight: '600' }}>{approuvees}/{feuilles.length}</div>
        </div>
      </div>

      {/* Filtres */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Filtrer par projet..."
          value={filtreProjet}
          onChange={e => setFiltreProjet(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }}
        />
        <input
          type="text"
          placeholder="Filtrer par employé..."
          value={filtreEmploye}
          onChange={e => setFiltreEmploye(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }}
        />
        <input
          type="week"
          value={filtreSemaine}
          onChange={e => setFiltreSemaine(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }}
        />
      </div>

      {/* Tableau */}
      <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#F9FAFB' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Employé</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Projet</th>
              <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Heures</th>
              <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Taux/h</th>
              <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Total</th>
              <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Approuvée</th>
            </tr>
          </thead>
          <tbody>
            {feuilles.map((f, i) => (
              <tr key={f.id} style={{ borderBottom: i < feuilles.length - 1 ? '1px solid #F3F4F6' : 'none', background: i % 2 === 0 ? 'white' : '#F9FAFB' }}>
                <td style={{ padding: '12px', fontSize: '13px' }}>{new Date(f.date).toLocaleDateString()}</td>
                <td style={{ padding: '12px', fontSize: '13px' }}>{f.user.prenom} {f.user.nom}</td>
                <td style={{ padding: '12px', fontSize: '13px' }}>{f.projet.numero}</td>
                <td style={{ padding: '12px', fontSize: '13px', textAlign: 'right' }}>{f.heures.toFixed(1)}</td>
                <td style={{ padding: '12px', fontSize: '13px', textAlign: 'right' }}>${f.tauxHoraire.toFixed(2)}</td>
                <td style={{ padding: '12px', fontSize: '13px', textAlign: 'right', fontWeight: 500 }}>${(f.heures * f.tauxHoraire).toFixed(2)}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '3px', background: f.approuve ? '#EAF3DE' : '#F3F4F6', color: f.approuve ? '#3B6D11' : '#6B7280' }}>
                    {f.approuve ? '✓' : '—'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {feuilles.length === 0 && (
          <div style={{ padding: '24px', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>
            Aucune feuille de temps
          </div>
        )}
      </div>
    </div>
  )
}
