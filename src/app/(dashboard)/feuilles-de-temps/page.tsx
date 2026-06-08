'use client'
import { useState, useEffect } from 'react'
import { Clock, Trash2, Edit2, Plus } from 'lucide-react'

interface Employe {
  id: string
  prenom: string
  nom: string
  tauxHoraire: number
  actif: boolean
}

interface Fournisseur {
  id: string
  nom: string
}

interface FeuilleTemps {
  id: string
  employeId: string
  projetId: string
  date: string
  heures: number
  tauxHoraire: number
  notes?: string
  employe: { prenom: string; nom: string }
  projet: { numero: string; adresse: string }
}

interface Depense {
  id: string
  projetId: string
  categorie: string
  montant: number
  dateDepense: string
  facture?: string
  description: string
  projet: { numero: string; adresse: string }
}

interface LigneGrille {
  id: string
  employeId: string
  projetId: string
  heures: { lun: number | null; mar: number | null; mer: number | null; jeu: number | null; ven: number | null }
  tauxHoraire: number
}

type Onglet = 'consultation' | 'saisie' | 'employes'

const onglets = [
  { id: 'consultation' as const, label: '📋 Consultation' },
  { id: 'saisie' as const, label: '✏️ Saisie' },
  { id: 'employes' as const, label: '👥 Employés' },
]

const categories = ['MATERIAUX', 'SOUS_TRAITANT', 'EQUIPEMENT', 'AUTRE']

export default function FeuillesDeTempsPage() {
  const [ongletActif, setOngletActif] = useState<Onglet>('consultation')
  const [employes, setEmployes] = useState<Employe[]>([])
  const [projets, setProjets] = useState<any[]>([])
  const [feuilles, setFeuilles] = useState<FeuilleTemps[]>([])
  const [depenses, setDepenses] = useState<Depense[]>([])
  const [parametres, setParametres] = useState<any>({ maxHeuresParSemaine: 36.5 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [semaineLundi, setSemaineLundi] = useState<Date>(() => {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(today.setDate(diff))
  })
  
  const [lignes, setLignes] = useState<LigneGrille[]>([])
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [filtreProjet, setFiltreProjet] = useState('')
  const [filtreEmploye, setFiltreEmploye] = useState('')
  const [tauxEdits, setTauxEdits] = useState<{ [key: string]: number }>({})
  const [heuresmoisMap, setHeuresmoisMap] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    loadAllData()
  }, [])

  useEffect(() => {
    if (ongletActif === 'saisie') loadGrilleSemaine()
  }, [ongletActif, semaineLundi])

  const loadAllData = async () => {
    try {
      const [empRes, projRes, fRes, paramRes] = await Promise.all([
        fetch('/api/employes'),
        fetch('/api/projets'),
        fetch('/api/feuilles-de-temps'),
        fetch('/api/parametres')
      ])
      if (empRes.ok) setEmployes((await empRes.json()).employes || [])
      if (projRes.ok) setProjets((await projRes.json()).projets || [])
      if (fRes.ok) setFeuilles((await fRes.json()).feuilles || [])
      if (paramRes.ok) setParametres((await paramRes.json()).parametres || { maxHeuresParSemaine: 36.5 })
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadGrilleSemaine = async () => {
    try {
      const params = new URLSearchParams({ semaine: semaineLundi.toISOString().split('T')[0] })
      const res = await fetch(\/api/feuilles-de-temps?\\)
      if (res.ok) {
        const data = await res.json()
        const lignesMap: { [key: string]: LigneGrille } = {}
        
        (data.feuilles || []).forEach((f: FeuilleTemps) => {
          const key = \\-\\
          if (!lignesMap[key]) {
            lignesMap[key] = {
              id: key,
              employeId: f.employeId,
              projetId: f.projetId,
              tauxHoraire: f.tauxHoraire,
              heures: { lun: null, mar: null, mer: null, jeu: null, ven: null }
            }
          }
          const jour = new Date(f.date).getDay()
          const jourKey = ['', 'lun', 'mar', 'mer', 'jeu', 'ven'][jour] as keyof typeof lignesMap[key]['heures']
          if (jourKey) lignesMap[key].heures[jourKey] = f.heures
        })

        setLignes(Object.values(lignesMap))
      }
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

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

  const heuresParEmploye = lignes.reduce((acc, ligne) => {
    const total = Object.values(ligne.heures).reduce((s, h) => s + (h || 0), 0)
    acc[ligne.employeId] = (acc[ligne.employeId] || 0) + total
    return acc
  }, {} as { [key: string]: number })

  const handleChangerHeures = (ligneId: string, jour: string, valeur: string) => {
    setLignes(lignes.map(l => 
      l.id === ligneId 
        ? { ...l, heures: { ...l.heures, [jour]: valeur ? parseFloat(valeur) : null } }
        : l
    ))
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
            notes: '',
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

  const feuilles_filtrees = feuilles
    .filter(f => !filtreProjet || f.projetId === filtreProjet)
    .filter(f => !filtreEmploye || f.employeId === filtreEmploye)

  const totalHeures = feuilles.reduce((s, f) => s + f.heures, 0)
  const totalMontant = feuilles.reduce((s, f) => s + (f.heures * f.tauxHoraire), 0)

  if (loading) return <div style={{ padding: '24px' }}>Chargement...</div>

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Clock size={24} color="#ea1c24" />
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Feuilles de temps</h1>
      </div>

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
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {ongletActif === 'consultation' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
            <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', background: '#FAFAFA' }}>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>Total heures</div>
              <div style={{ fontSize: '24px', fontWeight: '600' }}>{totalHeures.toFixed(1)}h</div>
            </div>
            <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', background: '#FAFAFA' }}>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>Total montant</div>
              <div style={{ fontSize: '24px', fontWeight: '600' }}>\</div>
            </div>
          </div>

          <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#F9FAFB' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Employé</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Heures</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {feuilles_filtrees.slice(0, 20).map((f, i) => (
                  <tr key={f.id} style={{ borderBottom: i < 19 ? '1px solid #F3F4F6' : 'none', background: i % 2 === 0 ? 'white' : '#F9FAFB' }}>
                    <td style={{ padding: '12px', fontSize: '13px' }}>{new Date(f.date).toLocaleDateString()}</td>
                    <td style={{ padding: '12px', fontSize: '13px' }}>{f.employe.prenom} {f.employe.nom}</td>
                    <td style={{ padding: '12px', fontSize: '13px', textAlign: 'right' }}>{f.heures.toFixed(1)}</td>
                    <td style={{ padding: '12px', fontSize: '13px', textAlign: 'right', fontWeight: 500 }}>\</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {ongletActif === 'saisie' && (
        <div style={{ paddingBottom: '100px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <button onClick={semainePrecedente} style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer' }}>←</button>
            <h2 style={{ fontSize: '16px', fontWeight: '600', flex: 1 }}>Semaine du {lundiFormaté} au {vendrediFormaté} {annee}</h2>
            <button onClick={semaineSuivante} style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer' }}>→</button>
            <button onClick={semaineCourante} style={{ padding: '8px 12px', background: '#ea1c24', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Aujourd'hui</button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {Object.entries(heuresParEmploye).map(([employeId, heures]) => {
              const max = parametres?.maxHeuresParSemaine || 36.5
              const depasse = heures > max
              const proche = heures > max * 0.9
              const emp = employes.find(e => e.id === employeId)
              
              return (
                <span key={employeId} style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 500,
                  background: depasse ? '#FEF2F2' : proche ? '#FAEEDA' : '#F0FDF7',
                  color: depasse ? '#EF4444' : proche ? '#854F0B' : '#1D9E75',
                  border: \1px solid \\,
                }}>
                  {emp?.prenom} {emp?.nom} — {heures.toFixed(1)}h / {max}h {depasse && '⚠️'}
                </span>
              )
            })}
          </div>

          <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
              <thead style={{ background: '#F9FAFB' }}>
                <tr>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '11px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Employé</th>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '11px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Projet</th>
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'].map(j => (
                    <th key={j} style={{ padding: '8px', textAlign: 'center', fontSize: '11px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>{j}</th>
                  ))}
                  <th style={{ padding: '8px', textAlign: 'right', fontSize: '11px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {lignes.map((ligne, i) => {
                  const total = totalLigne(ligne)
                  const emp = employes.find(e => e.id === ligne.employeId)
                  const proj = projets.find(p => p.id === ligne.projetId)
                  return (
                    <tr key={ligne.id} style={{ borderBottom: i < lignes.length - 1 ? '1px solid #F3F4F6' : 'none', background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                      <td style={{ padding: '8px', fontSize: '12px' }}>{emp?.prenom} {emp?.nom}</td>
                      <td style={{ padding: '8px', fontSize: '12px' }}>{proj?.numero}</td>
                      {['lun', 'mar', 'mer', 'jeu', 'ven'].map(jour => (
                        <td key={jour} style={{ padding: '4px' }}>
                          <input type="number" step="0.5" value={ligne.heures[jour as keyof typeof ligne.heures] || ''} onChange={e => handleChangerHeures(ligne.id, jour, e.target.value)} style={{ width: '100%', padding: '4px', border: '1px solid #E5E7EB', borderRadius: '3px', fontSize: '11px', textAlign: 'center' }} />
                        </td>
                      ))}
                      <td style={{ padding: '8px', textAlign: 'right', fontWeight: 500, fontSize: '12px' }}>\</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #E5E7EB', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
            <div style={{ fontSize: '12px' }}>
              {unsavedChanges ? (
                <span style={{ color: '#EF9F27', fontWeight: 500 }}>⚠ Modifications non sauvegardées</span>
              ) : (
                <span style={{ color: '#1D9E75' }}>✓ Tout est sauvegardé</span>
              )}
            </div>
            <button onClick={handleSauvegarderSemaine} disabled={saving} style={{ padding: '8px 16px', background: '#ea1c24', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
              {saving ? 'Sauvegarde...' : 'Sauvegarder la semaine'}
            </button>
          </div>
        </div>
      )}

      {ongletActif === 'employes' && <div>Onglet employés</div>}
    </div>
  )
}
