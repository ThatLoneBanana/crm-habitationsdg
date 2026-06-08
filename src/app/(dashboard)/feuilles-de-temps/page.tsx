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

type Mode = 'employes' | 'saisie' | 'consultation'

export default function FeuillesDeTempsPage() {
  const [mode, setMode] = useState<Mode>('employes')
  const [employes, setEmployes] = useState<Employe[]>([])
  const [projets, setProjets] = useState<any[]>([])
  const [feuilles, setFeuilles] = useState<FeuilleTemps[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Gestion employés
  const [editingEmploye, setEditingEmploye] = useState<Employe | null>(null)
  const [formEmploye, setFormEmploye] = useState({ prenom: '', nom: '', email: '', telephone: '', tauxHoraire: '', metier: '', actif: true })
  const [showFormEmploye, setShowFormEmploye] = useState(false)

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

  useEffect(() => {
    loadAllData()
  }, [])

  useEffect(() => {
    if (mode === 'saisie') loadGrilleSemaine()
  }, [mode, semaineLundi])

  const loadAllData = async () => {
    try {
      const [empRes, projRes, fRes] = await Promise.all([
        fetch('/api/employes'),
        fetch('/api/projets'),
        fetch('/api/feuilles-de-temps')
      ])
      if (empRes.ok) {
        const data = await empRes.json()
        setEmployes(data.employes || [])
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

  // === GESTION EMPLOYÉS ===

  const handleSauvegarderEmploye = async () => {
    if (!formEmploye.prenom || !formEmploye.nom) {
      alert('Nom et prénom requis')
      return
    }

    setSaving(true)
    try {
      const method = editingEmploye ? 'PUT' : 'POST'
      const url = editingEmploye ? `/api/employes/${editingEmploye.id}` : '/api/employes'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formEmploye)
      })

      if (res.ok) {
        setFormEmploye({ prenom: '', nom: '', email: '', telephone: '', tauxHoraire: '', metier: '', actif: true })
        setEditingEmploye(null)
        setShowFormEmploye(false)
        loadAllData()
      }
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleSupprimer = async (id: string) => {
    if (!confirm('Supprimer cet employé?')) return
    try {
      await fetch(`/api/employes/${id}`, { method: 'DELETE' })
      loadAllData()
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  const handleEditer = (emp: Employe) => {
    setEditingEmploye(emp)
    setFormEmploye({
      prenom: emp.prenom,
      nom: emp.nom,
      email: emp.email || '',
      telephone: emp.telephone || '',
      tauxHoraire: emp.tauxHoraire.toString(),
      metier: emp.metier || '',
      actif: emp.actif
    })
    setShowFormEmploye(true)
  }

  // === GRILLE SAISIE ===

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
        setMode('consultation')
        loadAllData()
      }
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ padding: '24px' }}>Chargement...</div>

  const feuilles_filtrees = feuilles
    .filter(f => !filtreProjet || f.projetId === filtreProjet)
    .filter(f => !filtreEmploye || f.employeId === filtreEmploye)

  const totalHeures = feuilles.reduce((s, f) => s + f.heures, 0)
  const totalMontant = feuilles.reduce((s, f) => s + (f.heures * f.tauxHoraire), 0)
  const approuvees = feuilles.filter(f => f.approuve).length

  return (
    <div style={{ padding: '24px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Clock size={24} color="#ea1c24" />
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Feuilles de temps</h1>
      </div>

      {/* ONGLETS NAVIGATION */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>
        {(['employes', 'saisie', 'consultation'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setMode(tab)}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: mode === tab ? '#ea1c24' : 'transparent',
              color: mode === tab ? 'white' : '#6B7280',
              borderRadius: '6px 6px 0 0',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: mode === tab ? 500 : 400,
            }}
          >
            {tab === 'employes' && '👥 Employés'}
            {tab === 'saisie' && '✏️ Saisie'}
            {tab === 'consultation' && '📋 Consultation'}
          </button>
        ))}
      </div>

      {/* === MODE EMPLOYÉS === */}
      {mode === 'employes' && (
        <div>
          <div style={{ marginBottom: '24px' }}>
            <button onClick={() => { setShowFormEmploye(true); setEditingEmploye(null); setFormEmploye({ prenom: '', nom: '', email: '', telephone: '', tauxHoraire: '', metier: '', actif: true }) }} style={{ padding: '10px 16px', background: '#ea1c24', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
              + Ajouter employé
            </button>
          </div>

          {/* Tableau employés */}
          <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#F9FAFB' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Nom</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Métier</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Taux/h</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Statut</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employes.map((emp, i) => (
                  <tr key={emp.id} style={{ borderBottom: i < employes.length - 1 ? '1px solid #F3F4F6' : 'none', background: i % 2 === 0 ? 'white' : '#F9FAFB' }}>
                    <td style={{ padding: '12px', fontSize: '13px', fontWeight: 500 }}>{emp.prenom} {emp.nom}</td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#6B7280' }}>{emp.email || '—'}</td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#6B7280' }}>{emp.metier || '—'}</td>
                    <td style={{ padding: '12px', fontSize: '13px', textAlign: 'right' }}>${emp.tauxHoraire.toFixed(2)}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '3px', background: emp.actif ? '#EAF3DE' : '#F3F4F6', color: emp.actif ? '#3B6D11' : '#6B7280' }}>
                        {emp.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', display: 'flex', gap: '4px', justifyContent: 'center' }}>
                      <button onClick={() => handleEditer(emp)} style={{ padding: '4px 8px', border: '1px solid #E5E7EB', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleSupprimer(emp.id)} style={{ padding: '4px 8px', border: '1px solid #E5E7EB', background: 'white', borderRadius: '4px', cursor: 'pointer', color: '#DC2626' }}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {employes.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>
                Aucun employé
              </div>
            )}
          </div>

          {/* Dialog ajouter/modifier employé */}
          {showFormEmploye && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ background: 'white', borderRadius: '8px', padding: '24px', maxWidth: '500px', width: '90%' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>{editingEmploye ? 'Modifier' : 'Ajouter'} employé</h2>

                <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Prénom</label>
                      <input type="text" value={formEmploye.prenom} onChange={e => setFormEmploye({...formEmploye, prenom: e.target.value})} style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Nom</label>
                      <input type="text" value={formEmploye.nom} onChange={e => setFormEmploye({...formEmploye, nom: e.target.value})} style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Email</label>
                    <input type="email" value={formEmploye.email} onChange={e => setFormEmploye({...formEmploye, email: e.target.value})} style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Téléphone</label>
                    <input type="tel" value={formEmploye.telephone} onChange={e => setFormEmploye({...formEmploye, telephone: e.target.value})} style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Métier</label>
                      <input type="text" value={formEmploye.metier} onChange={e => setFormEmploye({...formEmploye, metier: e.target.value})} placeholder="Menuisier, électricien..." style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Taux/h ($)</label>
                      <input type="number" step="0.01" value={formEmploye.tauxHoraire} onChange={e => setFormEmploye({...formEmploye, tauxHoraire: e.target.value})} style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" checked={formEmploye.actif} onChange={e => setFormEmploye({...formEmploye, actif: e.target.checked})} id="actif" />
                    <label htmlFor="actif" style={{ fontSize: '13px' }}>Actif</label>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setShowFormEmploye(false)} style={{ flex: 1, padding: '10px', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                    Annuler
                  </button>
                  <button onClick={handleSauvegarderEmploye} disabled={saving} style={{ flex: 1, padding: '10px', background: '#ea1c24', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, opacity: saving ? 0.6 : 1 }}>
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* === MODE SAISIE === */}
      {mode === 'saisie' && (
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
            <button onClick={() => { setMode('employes'); setUnsavedChanges(false) }} style={{ padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
              Annuler
            </button>
            <button onClick={handleSauvegarderSemaine} disabled={saving} style={{ padding: '10px 16px', background: '#ea1c24', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Sauvegarde...' : 'Sauvegarder la semaine'}
            </button>
          </div>

          <div style={{ height: '80px' }} />
        </div>
      )}

      {/* === MODE CONSULTATION === */}
      {mode === 'consultation' && (
        <div>
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
              {employes.map(e => <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
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
                    <td style={{ padding: '12px', fontSize: '13px' }}>{f.employe.prenom} {f.employe.nom}</td>
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
      )}
    </div>
  )
}
