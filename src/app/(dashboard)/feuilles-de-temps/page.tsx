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
  user: { id: string; prenom: string; nom: string; tauxHoraire: number }
}

interface LigneGrille {
  id: string
  userId: string
  projetId: string
  heures: { lun: number | null; mar: number | null; mer: number | null; jeu: number | null; ven: number | null }
  tauxHoraire: number
  notes: string
}

export default function FeuillesDeTempsPage() {
  const [modeSaisie, setModeSaisie] = useState(false)
  const [feuilles, setFeuilles] = useState<FeuilleTemps[]>([])
  const [projets, setProjets] = useState<any[]>([])
  const [employes, setEmployes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [unsavedChanges, setUnsavedChanges] = useState(false)

  // Filtres consultation
  const [filtreProjet, setFiltreProjet] = useState('')
  const [filtreEmploye, setFiltreEmploye] = useState('')

  // Grille saisie
  const [semaineLundi, setSemaineLundi] = useState<Date>(() => {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(today.setDate(diff))
  })
  const [lignes, setLignes] = useState<LigneGrille[]>([])

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (modeSaisie) loadGrilleSemaine()
  }, [modeSaisie, semaineLundi])

  const loadData = async () => {
    try {
      const [projRes, empRes, fRes] = await Promise.all([
        fetch('/api/projets'),
        fetch('/api/users'),
        fetch('/api/feuilles-de-temps')
      ])
      if (projRes.ok) {
        const data = await projRes.json()
        setProjets(data.projets || [])
      }
      if (empRes.ok) {
        const data = await empRes.json()
        setEmployes(Array.isArray(data) ? data : data.users || [])
      }
      if (fRes.ok) {
        const data = await fRes.json()
        setFeuilles(data.feuilles || [])
      }
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadGrilleSemaine = async () => {
    try {
      const week = Math.ceil((semaineLundi.getDate() + new Date(semaineLundi.getFullYear(), semaineLundi.getMonth(), 1).getDay()) / 7)
      const params = new URLSearchParams({
        semaine: semaineLundi.toISOString().split('T')[0]
      })
      const res = await fetch(`/api/feuilles-de-temps?${params}`)
      if (res.ok) {
        const data = await res.json()
        const feuillesExistantes = data.feuilles || []

        // Reconstruit les lignes à partir des feuilles existantes
        const lignesMap: { [key: string]: LigneGrille } = {}
        feuillesExistantes.forEach((f: FeuilleTemps) => {
          const key = `${f.userId}-${f.projetId}`
          if (!lignesMap[key]) {
            lignesMap[key] = {
              id: key,
              userId: f.userId,
              projetId: f.projetId,
              tauxHoraire: f.tauxHoraire,
              heures: { lun: null, mar: null, mer: null, jeu: null, ven: null },
              notes: f.notes || '',
            }
          }
          const jour = new Date(f.date).getDay()
          const jourKey = ['', 'lun', 'mar', 'mer', 'jeu', 'ven'][jour] as keyof typeof lignesMap[key]['heures']
          if (jourKey) lignesMap[key].heures[jourKey] = f.heures
        })

        setLignes(Object.values(lignesMap).length > 0 ? Object.values(lignesMap) : [{ id: '0', userId: '', projetId: '', heures: { lun: null, mar: null, mer: null, jeu: null, ven: null }, tauxHoraire: 0, notes: '' }])
      }
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  const totalHeures = feuilles.reduce((s, f) => s + f.heures, 0)
  const totalMontant = feuilles.reduce((s, f) => s + (f.heures * f.tauxHoraire), 0)
  const approuvees = feuilles.filter(f => f.approuve).length

  const feuilles_filtrees = feuilles
    .filter(f => !filtreProjet || f.projetId === filtreProjet)
    .filter(f => !filtreEmploye || f.userId === filtreEmploye)

  // Navigation semaine
  const lundiFormaté = semaineLundi.toLocaleDateString('fr-CA', { month: 'short', day: 'numeric' })
  const vendredi = new Date(semaineLundi)
  vendredi.setDate(vendredi.getDate() + 4)
  const vendrediFormaté = vendredi.toLocaleDateString('fr-CA', { month: 'short', day: 'numeric' })
  const annee = semaineLundi.getFullYear()

  const semainePrecedente = () => {
    const prev = new Date(semaineLundi)
    prev.setDate(prev.getDate() - 7)
    setSemaineLundi(prev)
  }

  const semaineSuivante = () => {
    const next = new Date(semaineLundi)
    next.setDate(next.getDate() + 7)
    setSemaineLundi(next)
  }

  const semaineCourante = () => {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1)
    const lundi = new Date(today)
    lundi.setDate(diff)
    lundi.setHours(0, 0, 0, 0)
    setSemaineLundi(lundi)
  }

  const handleAjouterLigne = () => {
    setLignes([...lignes, { id: Date.now().toString(), userId: '', projetId: '', heures: { lun: null, mar: null, mer: null, jeu: null, ven: null }, tauxHoraire: 0, notes: '' }])
    setUnsavedChanges(true)
  }

  const handleChangerHeures = (ligneId: string, jour: 'lun' | 'mar' | 'mer' | 'jeu' | 'ven', valeur: string) => {
    setLignes(lignes.map(l => {
      if (l.id === ligneId) {
        return { ...l, heures: { ...l.heures, [jour]: valeur ? parseFloat(valeur) : null } }
      }
      return l
    }))
    setUnsavedChanges(true)
  }

  const handleChangerEmploye = (ligneId: string, userId: string) => {
    setLignes(lignes.map(l => {
      if (l.id === ligneId) {
        const emp = employes.find((e: any) => e.id === userId)
        return { ...l, userId, tauxHoraire: emp?.tauxHoraire || 0 }
      }
      return l
    }))
    setUnsavedChanges(true)
  }

  const totalLigne = (l: LigneGrille) =>
    Object.values(l.heures).reduce((s, h) => s + (h || 0), 0) * l.tauxHoraire

  const totalGrille = lignes.reduce((s, l) => s + totalLigne(l), 0)

  const handleSauvegarderSemaine = async () => {
    setSaving(true)
    try {
      const entries = []
      lignes.forEach(ligne => {
        if (!ligne.userId || !ligne.projetId) return
        const jours = ['lun', 'mar', 'mer', 'jeu', 'ven']
        jours.forEach((jour, i) => {
          const heures = ligne.heures[jour as keyof typeof ligne.heures]
          if (!heures || heures <= 0) return
          const date = new Date(semaineLundi)
          date.setDate(semaineLundi.getDate() + i)
          entries.push({
            userId: ligne.userId,
            projetId: ligne.projetId,
            date: date.toISOString(),
            heures,
            tauxHoraire: ligne.tauxHoraire,
            notes: ligne.notes,
          })
        })
      })

      const res = await fetch('/api/feuilles-de-temps/semaine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ semaine: semaineLundi.toISOString(), entries })
      })

      if (res.ok) {
        setUnsavedChanges(false)
        setModeSaisie(false)
        loadData()
      }
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ padding: '24px' }}>Chargement...</div>

  // MODE SAISIE
  if (modeSaisie) {
    return (
      <div style={{ padding: '24px' }}>
        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <button onClick={semainePrecedente} style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer' }}>←</button>
          <h2 style={{ fontSize: '18px', fontWeight: '600', flex: 1 }}>Semaine du {lundiFormaté} au {vendrediFormaté} {annee}</h2>
          <button onClick={semaineSuivante} style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer' }}>→</button>
          <button onClick={semaineCourante} style={{ padding: '8px 12px', background: '#ea1c24', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Aujourd'hui</button>
        </div>

        {/* Grille */}
        <div style={{ overflowX: 'auto', marginBottom: '80px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1200px' }}>
            <thead style={{ background: '#F9FAFB' }}>
              <tr>
                <th style={{ padding: '8px', textAlign: 'left', fontSize: '11px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB', width: '160px' }}>Employé</th>
                <th style={{ padding: '8px', textAlign: 'left', fontSize: '11px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB', width: '200px' }}>Projet</th>
                <th style={{ padding: '8px', textAlign: 'center', fontSize: '11px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB', width: '65px' }}>Lun {semaineLundi.getDate()}</th>
                <th style={{ padding: '8px', textAlign: 'center', fontSize: '11px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB', width: '65px' }}>Mar {semaineLundi.getDate() + 1}</th>
                <th style={{ padding: '8px', textAlign: 'center', fontSize: '11px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB', width: '65px' }}>Mer {semaineLundi.getDate() + 2}</th>
                <th style={{ padding: '8px', textAlign: 'center', fontSize: '11px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB', width: '65px' }}>Jeu {semaineLundi.getDate() + 3}</th>
                <th style={{ padding: '8px', textAlign: 'center', fontSize: '11px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB', width: '65px' }}>Ven {semaineLundi.getDate() + 4}</th>
                <th style={{ padding: '8px', textAlign: 'center', fontSize: '11px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB', width: '75px' }}>Taux/h</th>
                <th style={{ padding: '8px', textAlign: 'right', fontSize: '11px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB', width: '90px' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {lignes.map((ligne, i) => {
                const total = totalLigne(ligne)
                return (
                  <tr key={ligne.id} style={{ borderBottom: i < lignes.length - 1 ? '1px solid #F3F4F6' : 'none', background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                    <td style={{ padding: '8px', width: '160px' }}>
                      <select value={ligne.userId} onChange={e => handleChangerEmploye(ligne.id, e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #E5E7EB', borderRadius: '4px', fontSize: '12px' }}>
                        <option value="">—</option>
                        {employes.map((e: any) => <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '8px', width: '200px' }}>
                      <select value={ligne.projetId} onChange={e => setLignes(lignes.map(l => l.id === ligne.id ? {...l, projetId: e.target.value} : l))} style={{ width: '100%', padding: '6px', border: '1px solid #E5E7EB', borderRadius: '4px', fontSize: '12px' }}>
                        <option value="">—</option>
                        {projets.map((p: any) => <option key={p.id} value={p.id}>{p.numero} — {p.adresse}</option>)}
                      </select>
                    </td>
                    {['lun', 'mar', 'mer', 'jeu', 'ven'].map(jour => (
                      <td key={jour} style={{ padding: '8px', width: '65px' }}>
                        <input type="number" step="0.5" value={ligne.heures[jour as keyof typeof ligne.heures] || ''} onChange={e => handleChangerHeures(ligne.id, jour as any, e.target.value)} placeholder="-" style={{ width: '100%', padding: '6px', border: '1px solid #E5E7EB', borderRadius: '4px', fontSize: '12px', textAlign: 'center', background: '#F3F7FB' }} />
                      </td>
                    ))}
                    <td style={{ padding: '8px', width: '75px' }}>
                      <input type="number" step="0.01" value={ligne.tauxHoraire || ''} readOnly style={{ width: '100%', padding: '6px', border: '1px solid #E5E7EB', borderRadius: '4px', fontSize: '12px', textAlign: 'center', background: '#F9FAFB' }} />
                    </td>
                    <td style={{ padding: '8px', width: '90px', textAlign: 'right', fontWeight: 500, color: total > 0 ? '#3B6D11' : '#6B7280', background: total > 0 ? '#F0FDE8' : 'transparent' }}>
                      ${total.toFixed(2)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Bouton Ajouter Ligne */}
        <div style={{ marginBottom: '80px' }}>
          <button onClick={handleAjouterLigne} style={{ padding: '8px 16px', border: '1px dashed #E5E7EB', background: 'white', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#6B7280' }}>
            + Ajouter une ligne
          </button>
        </div>

        {/* Pied page sticky */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #E5E7EB', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-end' }}>
          {unsavedChanges && (
            <span style={{ padding: '4px 12px', borderRadius: '20px', background: '#FEF3C7', color: '#92400E', fontSize: '12px', fontWeight: 500 }}>
              Modifications non sauvegardées
            </span>
          )}
          <button onClick={() => { setModeSaisie(false); setUnsavedChanges(false) }} style={{ padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
            Annuler
          </button>
          <button onClick={handleSauvegarderSemaine} disabled={saving} style={{ padding: '10px 16px', background: '#ea1c24', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Sauvegarde...' : 'Sauvegarder la semaine'}
          </button>
        </div>

        <div style={{ height: '80px' }} />
      </div>
    )
  }

  // MODE CONSULTATION
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={24} color="#ea1c24" />
          <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Feuilles de temps</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setModeSaisie(true)} style={{ padding: '10px 16px', background: '#ea1c24', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
            Saisie de la semaine
          </button>
          <button style={{ padding: '10px 16px', border: '1px solid #E5E7EB', background: 'white', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
            Export CSV
          </button>
        </div>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
        <select value={filtreProjet} onChange={e => setFiltreProjet(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }}>
          <option value="">Tous les projets</option>
          {projets.map((p: any) => <option key={p.id} value={p.id}>{p.numero} — {p.adresse}</option>)}
        </select>
        <select value={filtreEmploye} onChange={e => setFiltreEmploye(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }}>
          <option value="">Tous les employés</option>
          {employes.map((e: any) => <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
        </select>
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
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Notes</th>
              <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Approuvé</th>
            </tr>
          </thead>
          <tbody>
            {feuilles_filtrees.map((f, i) => (
              <tr key={f.id} style={{ borderBottom: i < feuilles_filtrees.length - 1 ? '1px solid #F3F4F6' : 'none', background: i % 2 === 0 ? 'white' : '#F9FAFB' }}>
                <td style={{ padding: '12px', fontSize: '13px' }}>{new Date(f.date).toLocaleDateString()}</td>
                <td style={{ padding: '12px', fontSize: '13px' }}>{f.user.prenom} {f.user.nom}</td>
                <td style={{ padding: '12px', fontSize: '13px' }}>{f.projet.numero}</td>
                <td style={{ padding: '12px', fontSize: '13px', textAlign: 'right' }}>{f.heures.toFixed(1)}</td>
                <td style={{ padding: '12px', fontSize: '13px', textAlign: 'right' }}>${f.tauxHoraire.toFixed(2)}</td>
                <td style={{ padding: '12px', fontSize: '13px', textAlign: 'right', fontWeight: 500 }}>${(f.heures * f.tauxHoraire).toFixed(2)}</td>
                <td style={{ padding: '12px', fontSize: '12px', color: '#6B7280' }}>{f.notes || '—'}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <input type="checkbox" checked={f.approuve} style={{ cursor: 'pointer' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {feuilles_filtrees.length === 0 && (
          <div style={{ padding: '24px', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>
            Aucune feuille de temps
          </div>
        )}
      </div>
    </div>
  )
}
