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
  const [projets, setProjets] = useState<any[]>([])
  const [employes, setEmployes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [nouvelleDlg, setNouvelleDlg] = useState(false)
  const [saving, setSaving] = useState(false)
  const [filtreProjet, setFiltreProjet] = useState('')
  const [filtreEmploye, setFiltreEmploye] = useState('')
  const [filtreSemaine, setFiltreSemaine] = useState('')
  const [formData, setFormData] = useState({ projetId: '', userId: '', date: '', heures: '', tauxHoraire: '', notes: '' })

  useEffect(() => {
    loadFeuilles()
    loadProjetEtEmployes()
  }, [filtreProjet, filtreEmploye, filtreSemaine])

  const loadProjetEtEmployes = async () => {
    try {
      const [projRes, empRes] = await Promise.all([
        fetch('/api/projets'),
        fetch('/api/users')
      ])
      if (projRes.ok) setProjets(await projRes.json())
      if (empRes.ok) setEmployes(await empRes.json())
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  const handleAjouter = async () => {
    if (!formData.projetId || !formData.userId || !formData.date || !formData.heures || !formData.tauxHoraire) {
      alert('Remplissez tous les champs requis')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/feuilles-de-temps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setNouvelleDlg(false)
        setFormData({ projetId: '', userId: '', date: '', heures: '', tauxHoraire: '', notes: '' })
        loadFeuilles()
      }
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setSaving(false)
    }
  }

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

      {/* Dialog Ajouter */}
      {nouvelleDlg && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', maxWidth: '500px', width: '90%' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Ajouter une feuille de temps</h2>

            <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Projet</label>
                <select
                  value={formData.projetId}
                  onChange={e => setFormData({...formData, projetId: e.target.value})}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }}
                >
                  <option value="">Choisir un projet...</option>
                  {projets.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.numero} — {p.adresse}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Employé</label>
                <select
                  value={formData.userId}
                  onChange={e => setFormData({...formData, userId: e.target.value})}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }}
                >
                  <option value="">Choisir un employé...</option>
                  {employes.map((u: any) => (
                    <option key={u.id} value={u.id}>{u.prenom} {u.nom}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Heures</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.heures}
                    onChange={e => setFormData({...formData, heures: e.target.value})}
                    placeholder="7.5"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Taux/h</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.tauxHoraire}
                    onChange={e => setFormData({...formData, tauxHoraire: e.target.value})}
                    placeholder="50.00"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Notes (optionnel)</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  placeholder="Remarques..."
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px', minHeight: '60px', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setNouvelleDlg(false)} style={{ flex: 1, padding: '10px', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                Annuler
              </button>
              <button onClick={handleAjouter} disabled={saving} style={{ flex: 1, padding: '10px', background: '#ea1c24', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Sauvegarde...' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
