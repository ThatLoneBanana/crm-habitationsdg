'use client'
import { useState, useEffect } from 'react'
import { Clock, Trash2, Edit2 } from 'lucide-react'

interface Employe {
  id: string
  prenom: string
  nom: string
  email?: string
  telephone?: string
  tauxHoraire: number
  metier?: string
  actif: boolean
}

interface User {
  id: string
  email: string
  prenom: string
  nom: string
  role: string
  tauxHoraire: number
  actif: boolean
}

interface FeuilleTemps {
  id: string
  projetId: string
  employeId: string
  date: string
  heures: number
  tauxHoraire: number
  notes?: string
  approuve: boolean
  projet: { id: string; adresse: string; numero: string }
  employe: { id: string; prenom: string; nom: string; tauxHoraire: number }
}

interface LigneGrille {
  id: string
  employeId: string
  projetId: string
  heures: { lun: number | null; mar: number | null; mer: number | null; jeu: number | null; ven: number | null }
  tauxHoraire: number
  notes: string
}

type Onglet = 'consultation' | 'saisie' | 'employes'

const onglets = [
  { id: 'consultation' as const, label: '📋 Consultation' },
  { id: 'saisie' as const, label: '✏️ Saisie' },
  { id: 'employes' as const, label: '👥 Employés' },
]

const formatRole = (role: string) => {
  const roles: { [key: string]: string } = {
    'ADMIN': 'Administrateur',
    'COMPTABILITE': 'Comptabilité',
    'VENDEUR': 'Vendeur',
    'CHARGE_PROJET': 'Chargé de projet',
  }
  return roles[role] || role
}

export default function FeuillesDeTempsPage() {
  const [ongletActif, setOngletActif] = useState<Onglet>('consultation')
  const [employes, setEmployes] = useState<Employe[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [projets, setProjets] = useState<any[]>([])
  const [feuilles, setFeuilles] = useState<FeuilleTemps[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Grille saisie
  const [semaineLundi, setSemaineLundi] = useState<Date>(() => {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(today.setDate(diff))
  })
  const [lignes, setLignes] = useState<LigneGrille[]>([])
  const [unsavedChanges, setUnsavedChanges] = useState(false)

  // Filtres consultation
  const [filtreProjet, setFiltreProjet] = useState('')
  const [filtreEmploye, setFiltreEmploye] = useState('')
  const [filtreSemaine, setFiltreSemaine] = useState('')

  // Onglet employés
  const [tauxEdits, setTauxEdits] = useState<{ [key: string]: number }>({})
  const [heuresmoisMap, setHeuresmoisMap] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    loadAllData()
  }, [])

  useEffect(() => {
    if (ongletActif === 'saisie') loadGrilleSemaine()
  }, [ongletActif, semaineLundi])

  useEffect(() => {
    if (ongletActif === 'employes') calculerHeuresMois()
  }, [ongletActif, feuilles])

  const loadAllData = async () => {
    try {
      const [empRes, userRes, projRes, fRes] = await Promise.all([
        fetch('/api/employes'),
        fetch('/api/users'),
        fetch('/api/projets'),
        fetch('/api/feuilles-de-temps')
      ])
      if (empRes.ok) {
        const data = await empRes.json()
        setEmployes(data.employes || [])
      }
      if (userRes.ok) {
        const data = await userRes.json()
        setUsers(Array.isArray(data) ? data : data.users || [])
      }
      if (projRes.ok) {
        const data = await projRes.json()
        setProjets(data.projets || [])
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
      const params = new URLSearchParams({
        semaine: semaineLundi.toISOString().split('T')[0]
      })
      const res = await fetch(`/api/feuilles-de-temps?${params}`)
      if (res.ok) {
        const data = await res.json()
        const feuillesExistantes = data.feuilles || []
        const lignesMap: { [key: string]: LigneGrille } = {}

        feuillesExistantes.forEach((f: FeuilleTemps) => {
          const key = `${f.employeId}-${f.projetId}`
          if (!lignesMap[key]) {
            lignesMap[key] = {
              id: key,
              employeId: f.employeId,
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

        setLignes(Object.values(lignesMap).length > 0 ? Object.values(lignesMap) : [{ id: '0', employeId: '', projetId: '', heures: { lun: null, mar: null, mer: null, jeu: null, ven: null }, tauxHoraire: 0, notes: '' }])
      }
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  const calculerHeuresMois = () => {
    const maintenant = new Date()
    const debut = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1)
    const map: { [key: string]: number } = {}

    feuilles.forEach(f => {
      const date = new Date(f.date)
      if (date >= debut) {
        const key = f.employe.id
        map[key] = (map[key] || 0) + f.heures
      }
    })

    setHeuresmoisMap(map)
  }

  // === SAISIE ===

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

  const lundiFormaté = semaineLundi.toLocaleDateString('fr-CA', { month: 'short', day: 'numeric' })
  const vendredi = new Date(semaineLundi)
  vendredi.setDate(vendredi.getDate() + 4)
  const vendrediFormaté = vendredi.toLocaleDateString('fr-CA', { month: 'short', day: 'numeric' })
  const annee = semaineLundi.getFullYear()

  const handleAjouterLigne = () => {
    setLignes([...lignes, { id: Date.now().toString(), employeId: '', projetId: '', heures: { lun: null, mar: null, mer: null, jeu: null, ven: null }, tauxHoraire: 0, notes: '' }])
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

  const handleChangerEmploye = (ligneId: string, employeId: string) => {
    setLignes(lignes.map(l => {
      if (l.id === ligneId) {
        const emp = employes.find(e => e.id === employeId)
        return { ...l, employeId, tauxHoraire: emp?.tauxHoraire || 0 }
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
        if (!ligne.employeId || !ligne.projetId) return
        const jours = ['lun', 'mar', 'mer', 'jeu', 'ven']
        jours.forEach((jour, i) => {
          const heures = ligne.heures[jour as keyof typeof ligne.heures]
          if (!heures || heures <= 0) return
          const date = new Date(semaineLundi)
          date.setDate(semaineLundi.getDate() + i)
          entries.push({
            employeId: ligne.employeId,
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
        loadAllData()
      }
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setSaving(false)
    }
  }

  // === CONSULTATION ===

  const feuilles_filtrees = feuilles
    .filter(f => !filtreProjet || f.projetId === filtreProjet)
    .filter(f => !filtreEmploye || f.employeId === filtreEmploye)
    .filter(f => {
      if (!filtreSemaine) return true
      const debut = new Date(filtreSemaine)
      const fin = new Date(debut)
      fin.setDate(fin.getDate() + 7)
      const date = new Date(f.date)
      return date >= debut && date < fin
    })

  const totalHeures = feuilles.reduce((s, f) => s + f.heures, 0)
  const totalMontant = feuilles.reduce((s, f) => s + (f.heures * f.tauxHoraire), 0)

  // === EMPLOYÉS ===

  const handleSauvegarderTaux = async (userId: string) => {
    const taux = tauxEdits[userId]
    if (taux === undefined) return

    try {
      const res = await fetch(`/api/users/${userId}/taux`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tauxHoraire: taux })
      })

      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, tauxHoraire: taux } : u))
        setTauxEdits(prev => {
          const newEdits = { ...prev }
          delete newEdits[userId]
          return newEdits
        })
      }
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  if (loading) return <div style={{ padding: '24px' }}>Chargement...</div>

  return (
    <div style={{ padding: '24px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Clock size={24} color="#ea1c24" />
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Feuilles de temps</h1>
      </div>

      {/* ONGLETS NAVIGATION */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '24px', borderBottom: '2px solid #E5E7EB' }}>
        {onglets.map(tab => (
          <button
            key={tab.id}
            onClick={() => setOngletActif(tab.id)}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: ongletActif === tab.id ? '#ea1c24' : 'transparent',
              color: ongletActif === tab.id ? 'white' : '#6B7280',
              borderBottom: ongletActif === tab.id ? '3px solid #ea1c24' : 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: ongletActif === tab.id ? 600 : 400,
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* === ONGLET CONSULTATION === */}
      {ongletActif === 'consultation' && (
        <div>
          {/* Métriques */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
            <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', background: '#FAFAFA' }}>
              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Total heures</div>
              <div style={{ fontSize: '24px', fontWeight: '600' }}>{totalHeures.toFixed(1)}h</div>
            </div>
            <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', background: '#FAFAFA' }}>
              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Total montant</div>
              <div style={{ fontSize: '24px', fontWeight: '600' }}>${totalMontant.toFixed(2)}</div>
            </div>
          </div>

          {/* Filtres */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
            <select value={filtreProjet} onChange={e => setFiltreProjet(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }}>
              <option value="">Tous les projets</option>
              {projets.map((p: any) => <option key={p.id} value={p.id}>{p.numero} — {p.adresse}</option>)}
            </select>
            <select value={filtreEmploye} onChange={e => setFiltreEmploye(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }}>
              <option value="">Tous les employés</option>
              {employes.map(e => <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
            </select>
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
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Notes</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feuilles_filtrees.map((f, i) => (
                  <tr key={f.id} style={{ borderBottom: i < feuilles_filtrees.length - 1 ? '1px solid #F3F4F6' : 'none', background: i % 2 === 0 ? 'white' : '#F9FAFB' }}>
                    <td style={{ padding: '12px', fontSize: '13px' }}>{new Date(f.date).toLocaleDateString()}</td>
                    <td style={{ padding: '12px', fontSize: '13px' }}>{f.employe.prenom} {f.employe.nom}</td>
                    <td style={{ padding: '12px', fontSize: '13px' }}>{f.projet.numero}</td>
                    <td style={{ padding: '12px', fontSize: '13px', textAlign: 'right' }}>{f.heures.toFixed(1)}</td>
                    <td style={{ padding: '12px', fontSize: '13px', textAlign: 'right' }}>${f.tauxHoraire.toFixed(2)}</td>
                    <td style={{ padding: '12px', fontSize: '13px', textAlign: 'right', fontWeight: 500 }}>${(f.heures * f.tauxHoraire).toFixed(2)}</td>
                    <td style={{ padding: '12px', fontSize: '12px', color: '#6B7280' }}>{f.notes || '—'}</td>
                    <td style={{ padding: '12px', textAlign: 'center', display: 'flex', gap: '4px', justifyContent: 'center' }}>
                      <button style={{ padding: '4px 8px', border: '1px solid #E5E7EB', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>
                        <Edit2 size={14} />
                      </button>
                      <button style={{ padding: '4px 8px', border: '1px solid #E5E7EB', background: 'white', borderRadius: '4px', cursor: 'pointer', color: '#DC2626' }}>
                        <Trash2 size={14} />
                      </button>
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
      )}

      {/* === ONGLET SAISIE === */}
      {ongletActif === 'saisie' && (
        <div>
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
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '11px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB', width: '140px' }}>Employé</th>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '11px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB', width: '180px' }}>Projet</th>
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
                      <td style={{ padding: '8px', width: '140px' }}>
                        <select value={ligne.employeId} onChange={e => handleChangerEmploye(ligne.id, e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #E5E7EB', borderRadius: '4px', fontSize: '12px' }}>
                          <option value="">—</option>
                          {employes.filter(e => e.actif).map(e => <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '8px', width: '180px' }}>
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

          <div style={{ marginBottom: '80px' }}>
            <button onClick={handleAjouterLigne} style={{ padding: '8px 16px', border: '1px dashed #E5E7EB', background: 'white', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#6B7280' }}>
              + Ajouter une ligne
            </button>
          </div>

          {/* Footer sticky */}
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #E5E7EB', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-end' }}>
            {unsavedChanges && (
              <span style={{ padding: '4px 12px', borderRadius: '20px', background: '#FEF3C7', color: '#92400E', fontSize: '12px', fontWeight: 500 }}>
                Modifications non sauvegardées
              </span>
            )}
            <button onClick={() => setUnsavedChanges(false)} style={{ padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
              Annuler
            </button>
            <button onClick={handleSauvegarderSemaine} disabled={saving} style={{ padding: '10px 16px', background: '#ea1c24', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Sauvegarde...' : 'Sauvegarder la semaine'}
            </button>
          </div>

          <div style={{ height: '80px' }} />
        </div>
      )}

      {/* === ONGLET EMPLOYÉS === */}
      {ongletActif === 'employes' && (
        <div>
          <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 150px 120px', alignItems: 'center', padding: '12px 14px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', fontSize: '12px', fontWeight: 500, color: '#6B7280' }}>
              <div>Employé</div>
              <div>Ce mois</div>
              <div>Taux/h</div>
              <div></div>
            </div>

            {users.filter(u => u.actif).map((user, i) => (
              <div key={user.id} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 150px 120px', alignItems: 'center', padding: '12px 14px', borderBottom: '1px solid #F3F4F6', background: i % 2 === 0 ? 'white' : '#F9FAFB' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '13px' }}>{user.prenom} {user.nom}</div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>{formatRole(user.role)}</div>
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280' }}>{heuresmoisMap[user.id] || 0}h</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="number"
                    step="0.01"
                    value={tauxEdits[user.id] !== undefined ? tauxEdits[user.id] : user.tauxHoraire}
                    onChange={e => setTauxEdits(prev => ({ ...prev, [user.id]: parseFloat(e.target.value) }))}
                    style={{ width: '70px', padding: '6px 8px', border: '1px solid #E5E7EB', borderRadius: '4px', fontSize: '12px' }}
                  />
                  <span style={{ fontSize: '11px', color: '#6B7280' }}>$/h</span>
                </div>
                <button
                  onClick={() => handleSauvegarderTaux(user.id)}
                  disabled={tauxEdits[user.id] === undefined}
                  style={{ padding: '6px 12px', background: tauxEdits[user.id] !== undefined ? '#ea1c24' : '#D1D5DB', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: tauxEdits[user.id] !== undefined ? 'pointer' : 'not-allowed', fontWeight: 500 }}
                >
                  Sauvegarder
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
