'use client'
import { useState, useEffect } from 'react'
import { Clock, Trash2 } from 'lucide-react'

interface Employe { id: string; prenom: string; nom: string; email?: string; telephone?: string; tauxHoraire: number; actif: boolean }
interface FeuilleTemps { id: string; employeId: string; projetId: string; date: string; heures: number; tauxHoraire: number; employe: { prenom: string; nom: string }; projet: { numero: string; adresse: string; ville?: string } }
interface Depense { id: string; projetId: string; categorie: string; description: string; montant: number; dateDepense: string; facture?: string; projet: { numero: string; adresse: string; ville?: string } }
interface LigneGrille { id: string; employeId: string; projetId: string; heures: { lun: number | null; mar: number | null; mer: number | null; jeu: number | null; ven: number | null }; tauxHoraire: number }
type Onglet = 'consultation' | 'saisie' | 'employes'

const onglets = [
  { id: 'consultation' as const, label: '📋 Consultation' },
  { id: 'saisie' as const, label: '✏️ Saisie' },
  { id: 'employes' as const, label: '👥 Employés' },
]

const categoriesLabels: { [key: string]: string } = {
  'MATERIAUX': 'Matériaux',
  'SOUS_TRAITANT': 'Sous-traitant',
  'EQUIPEMENT': 'Équipement',
  'AUTRE': 'Autre',
}

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
  const [tauxEdits, setTauxEdits] = useState<{ [key: string]: number }>({})
  const [heuresmoisMap, setHeuresmoisMap] = useState<{ [key: string]: number }>({})
  const [newDepense, setNewDepense] = useState({ fournisseur: '', projetId: '', date: new Date().toISOString().split('T')[0], montant: '', facture: '', categorie: 'MATERIAUX', notes: '' })
  const [showAjouterEmploye, setShowAjouterEmploye] = useState(false)
  const [nouvelEmploye, setNouvelEmploye] = useState({ prenom: '', nom: '', email: '', telephone: '', tauxHoraire: 0 })

  useEffect(() => { loadAllData() }, [])

  useEffect(() => {
    if (ongletActif === 'saisie') {
      loadGrilleSemaine()
      loadDerniesDepenses()
    }
  }, [ongletActif, semaineLundi])

  useEffect(() => {
    if (ongletActif === 'employes') calculerHeuresMois()
  }, [ongletActif, feuilles])

  const loadAllData = async () => {
    try {
      const [empRes, projRes, fRes, depRes, paramRes] = await Promise.all([
        fetch('/api/employes'),
        fetch('/api/projets'),
        fetch('/api/feuilles-de-temps'),
        fetch('/api/depenses'),
        fetch('/api/parametres')
      ])
      if (empRes.ok) setEmployes((await empRes.json()).employes || [])
      if (projRes.ok) setProjets((await projRes.json()).projets || [])
      if (fRes.ok) setFeuilles((await fRes.json()).feuilles || [])
      if (depRes.ok) setDepenses((await depRes.json()).depenses || [])
      if (paramRes.ok) setParametres((await paramRes.json()).parametres || { maxHeuresParSemaine: 36.5 })
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadDerniesDepenses = async () => {
    try {
      const res = await fetch('/api/depenses?jours=30')
      if (res.ok) setDepenses((await res.json()).depenses || [])
    } catch (err) {
      console.error('Erreur depenses:', err)
    }
  }

  const loadGrilleSemaine = async () => {
    try {
      const params = new URLSearchParams({ semaine: semaineLundi.toISOString().split('T')[0] })
      const url = `/api/feuilles-de-temps?${params}`
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        const lignesMap: { [key: string]: LigneGrille } = {}

        console.log('📊 Feuilles chargées:', data.feuilles?.length || 0);
        (data.feuilles || []).forEach((f: FeuilleTemps) => {
          const key = `${f.employeId}-${f.projetId}`
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
          const jourKey = ['', 'lun', 'mar', 'mer', 'jeu', 'ven'][jour]
          if (jourKey) {
            // @ts-ignore
            lignesMap[key].heures[jourKey] = f.heures
          }
        })

        const finalLignes = Object.values(lignesMap)
        console.log('✅ Lignes grille:', finalLignes.length)
        setLignes(finalLignes)
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
        const key = f.employeId
        map[key] = (map[key] || 0) + f.heures
      }
    })

    setHeuresmoisMap(map)
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
    const total = Object.values(ligne.heures).reduce((s: number, h: number | null) => s + (h || 0), 0)
    acc[ligne.employeId] = (acc[ligne.employeId] || 0) + total
    return acc
  }, {} as { [key: string]: number })

  const ajouterLigne = () => {
    const newId = Math.random().toString(36).substr(2, 9)
    setLignes(prev => [...prev, {
      id: newId,
      employeId: '',
      projetId: '',
      heures: { lun: null, mar: null, mer: null, jeu: null, ven: null },
      tauxHoraire: 0,
    }])
    setUnsavedChanges(true)
  }

  const onEmployeChange = (ligneId: string, employeId: string) => {
    const emp = employes.find(e => e.id === employeId)
    setLignes(prev => prev.map(l =>
      l.id === ligneId
        ? { ...l, employeId, tauxHoraire: emp?.tauxHoraire || 0 }
        : l
    ))
    setUnsavedChanges(true)
  }

  const handleChangerHeures = (ligneId: string, jour: string, valeur: string) => {
    setLignes(lignes.map(l =>
      l.id === ligneId
        ? { ...l, heures: { ...l.heures, [jour]: valeur ? parseFloat(valeur) : null } }
        : l
    ))
    setUnsavedChanges(true)
  }

  const totalLigne = (l: LigneGrille) =>
    Object.values(l.heures).reduce((s: number, h: number | null) => s + (h || 0), 0) * l.tauxHoraire

  const handleSauvegarderSemaine = async () => {
    setSaving(true)
    try {
      const entries: any[] = []
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

  const handleAjouterDepense = async () => {
    if (!newDepense.fournisseur || !newDepense.projetId || !newDepense.montant) {
      alert('Remplissez tous les champs requis')
      return
    }

    try {
      const res = await fetch(`/api/projets/${newDepense.projetId}/depenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categorie: newDepense.categorie,
          description: newDepense.fournisseur,
          montant: parseFloat(newDepense.montant),
          dateDepense: new Date(newDepense.date),
          facture: newDepense.facture || null,
          notes: newDepense.notes || null,
        })
      })

      if (res.ok) {
        setNewDepense({ fournisseur: '', projetId: '', date: new Date().toISOString().split('T')[0], montant: '', facture: '', categorie: 'MATERIAUX', notes: '' })
        loadDerniesDepenses()
      }
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  const handleSupprimerDepense = async (depenseId: string, projetId: string) => {
    if (!confirm('Supprimer cette dépense?')) return
    try {
      await fetch(`/api/projets/${projetId}/depenses/${depenseId}`, { method: 'DELETE' })
      loadDerniesDepenses()
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  const handleAjouterEmploye = async () => {
    if (!nouvelEmploye.prenom || !nouvelEmploye.nom) return
    setSaving(true)
    try {
      const res = await fetch('/api/employes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nouvelEmploye)
      })
      if (res.ok) {
        setShowAjouterEmploye(false)
        setNouvelEmploye({ prenom: '', nom: '', email: '', telephone: '', tauxHoraire: 0 })
        loadAllData()
      }
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleToggleEmploye = async (employeId: string, actif: boolean) => {
    try {
      const res = await fetch(`/api/employes/${employeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actif: !actif })
      })
      if (res.ok) {
        setEmployes(employes.map(e => e.id === employeId ? { ...e, actif: !actif } : e))
      }
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  const handleSauvegarderTauxEmploye = async (employeId: string) => {
    const taux = tauxEdits[employeId]
    if (taux === undefined) return
    try {
      const res = await fetch(`/api/employes/${employeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tauxHoraire: taux })
      })
      if (res.ok) {
        setEmployes(employes.map(e => e.id === employeId ? { ...e, tauxHoraire: taux } : e))
        setTauxEdits(prev => {
          const newEdits = { ...prev }
          delete newEdits[employeId]
          return newEdits
        })
      }
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  const feuilles_filtrees = feuilles
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
          <button key={tab.id} onClick={() => setOngletActif(tab.id)} style={{ padding: '12px 20px', border: 'none', background: ongletActif === tab.id ? '#ea1c24' : 'transparent', color: ongletActif === tab.id ? 'white' : '#6B7280', borderBottom: ongletActif === tab.id ? '3px solid #ea1c24' : 'none', cursor: 'pointer', fontSize: '14px', fontWeight: ongletActif === tab.id ? 600 : 400 }}>
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
              <div style={{ fontSize: '24px', fontWeight: '600' }}>${totalMontant.toFixed(2)}</div>
            </div>
          </div>

          <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#F9FAFB' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Employé</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Projet</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Heures</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {feuilles_filtrees.slice(0, 20).map((f, i) => (
                  <tr key={f.id} style={{ borderBottom: i < 19 ? '1px solid #F3F4F6' : 'none', background: i % 2 === 0 ? 'white' : '#F9FAFB' }}>
                    <td style={{ padding: '12px', fontSize: '13px' }}>{new Date(f.date).toLocaleDateString()}</td>
                    <td style={{ padding: '12px', fontSize: '13px' }}>{f.employe.prenom} {f.employe.nom}</td>
                    <td style={{ padding: '12px', fontSize: '13px' }}>{f.projet.adresse}{f.projet.ville ? `, ${f.projet.ville}` : ''}</td>
                    <td style={{ padding: '12px', fontSize: '13px', textAlign: 'right' }}>{f.heures.toFixed(1)}</td>
                    <td style={{ padding: '12px', fontSize: '13px', textAlign: 'right', fontWeight: 500 }}>${(f.heures * f.tauxHoraire).toFixed(2)}</td>
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
                  color: depasse ? '#EF4444' : proche ? '#854F0B' : '#DC2626',
                  border: `1px solid ${depasse ? '#FCA5A5' : proche ? '#FCD34D' : '#86EFAC'}`,
                }}>
                  {emp?.prenom} {emp?.nom} — {heures.toFixed(1)}h / {max}h {depasse && '⚠️'}
                </span>
              )
            })}
          </div>

          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600' }}>Saisie hebdomadaire</h3>
            <button onClick={ajouterLigne} style={{ padding: '8px 14px', background: '#DC2626', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>+ Ajouter une ligne</button>
          </div>

          {lignes.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>Aucune saisie pour cette semaine</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Clique sur "+ Ajouter une ligne" pour commencer</div>
            </div>
          ) : (
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
                    <th style={{ padding: '8px', textAlign: 'center', fontSize: '11px', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lignes.map((ligne, i) => {
                    const total = totalLigne(ligne)
                    const emp = employes.find(e => e.id === ligne.employeId)
                    const proj = projets.find(p => p.id === ligne.projetId)
                    return (
                      <tr key={ligne.id} style={{ borderBottom: i < lignes.length - 1 ? '1px solid #F3F4F6' : 'none', background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                        <td style={{ padding: '4px' }}>
                          <select value={ligne.employeId} onChange={e => onEmployeChange(ligne.id, e.target.value)} style={{ width: '100%', padding: '4px 6px', border: '1px solid #E5E7EB', borderRadius: '3px', fontSize: '11px' }}>
                            <option value=''>Choisir...</option>
                            {employes.filter(e => e.actif || e.id === ligne.employeId).map(e => <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: '4px' }}>
                          <select value={ligne.projetId} onChange={e => setLignes(lignes.map(l => l.id === ligne.id ? { ...l, projetId: e.target.value } : l))} style={{ width: '100%', padding: '4px 6px', border: '1px solid #E5E7EB', borderRadius: '3px', fontSize: '11px' }}>
                            <option value=''>Choisir...</option>
                            {projets.map(p => <option key={p.id} value={p.id}>{p.adresse}{p.ville ? `, ${p.ville}` : ''}</option>)}
                          </select>
                        </td>
                        {['lun', 'mar', 'mer', 'jeu', 'ven'].map(jour => (
                          <td key={jour} style={{ padding: '4px' }}>
                            <input type="number" step="0.5" value={ligne.heures[jour as keyof typeof ligne.heures] || ''} onChange={e => handleChangerHeures(ligne.id, jour, e.target.value)} style={{ width: '100%', padding: '4px', border: '1px solid #E5E7EB', borderRadius: '3px', fontSize: '11px', textAlign: 'center' }} />
                          </td>
                        ))}
                        <td style={{ padding: '8px', textAlign: 'right', fontWeight: 500, fontSize: '12px' }}>${total.toFixed(0)}</td>
                        <td style={{ padding: '4px', textAlign: 'center' }}>
                          <button onClick={() => setLignes(lignes.filter(l => l.id !== ligne.id))} style={{ padding: '2px 6px', border: '1px solid #E5E7EB', background: 'white', borderRadius: '3px', cursor: 'pointer', color: '#DC2626', fontSize: '11px' }}>✕</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '2px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>💰 Dépenses fournisseurs</h3>

            <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>+ Nouvelle dépense fournisseur</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 130px 120px 140px 140px', gap: '8px', alignItems: 'end' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#6B7280', display: 'block', marginBottom: '3px', fontWeight: 500 }}>Fournisseur</label>
                  <input type="text" placeholder="Ajouter..." value={newDepense.fournisseur} onChange={e => setNewDepense({...newDepense, fournisseur: e.target.value})} style={{ width: '100%', padding: '7px 8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '12px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#6B7280', display: 'block', marginBottom: '3px', fontWeight: 500 }}>Projet</label>
                  <select value={newDepense.projetId} onChange={e => setNewDepense({...newDepense, projetId: e.target.value})} style={{ width: '100%', padding: '7px 8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '12px' }}>
                    <option value="">Choisir...</option>
                    {projets.map(p => <option key={p.id} value={p.id}>{p.numero}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#6B7280', display: 'block', marginBottom: '3px', fontWeight: 500 }}>Date</label>
                  <input type="date" value={newDepense.date} onChange={e => setNewDepense({...newDepense, date: e.target.value})} style={{ width: '100%', padding: '7px 8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '12px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#6B7280', display: 'block', marginBottom: '3px', fontWeight: 500 }}>Montant ($)</label>
                  <input type="number" step="0.01" placeholder="0.00" value={newDepense.montant} onChange={e => setNewDepense({...newDepense, montant: e.target.value})} style={{ width: '100%', padding: '7px 8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '12px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#6B7280', display: 'block', marginBottom: '3px', fontWeight: 500 }}>N° Facture</label>
                  <input type="text" placeholder="FAC-001" value={newDepense.facture} onChange={e => setNewDepense({...newDepense, facture: e.target.value})} style={{ width: '100%', padding: '7px 8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '12px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#6B7280', display: 'block', marginBottom: '3px', fontWeight: 500 }}>Catégorie</label>
                  <select value={newDepense.categorie} onChange={e => setNewDepense({...newDepense, categorie: e.target.value})} style={{ width: '100%', padding: '7px 8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '12px' }}>
                    <option value="MATERIAUX">Matériaux</option>
                    <option value="SOUS_TRAITANT">Sous-traitant</option>
                    <option value="EQUIPEMENT">Équipement</option>
                    <option value="AUTRE">Autre</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button onClick={handleAjouterDepense} style={{ padding: '8px 20px', background: '#DC2626', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>+ Enregistrer la dépense</button>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px', color: '#374151' }}>Dépenses des 30 derniers jours</h4>
              <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead style={{ background: '#F9FAFB' }}>
                    <tr>
                      <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Date</th>
                      <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Fournisseur</th>
                      <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Projet</th>
                      <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Montant</th>
                      <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Catégorie</th>
                      <th style={{ padding: '6px 8px', textAlign: 'center', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Facture</th>
                      <th style={{ padding: '6px 8px', textAlign: 'center', fontWeight: 500, color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {depenses.slice(0, 10).map((d, i) => (
                      <tr key={d.id} style={{ borderBottom: i < 9 ? '1px solid #F3F4F6' : 'none', background: i % 2 === 0 ? 'white' : '#F9FAFB' }}>
                        <td style={{ padding: '6px 8px' }}>{new Date(d.dateDepense).toLocaleDateString()}</td>
                        <td style={{ padding: '6px 8px' }}>{d.description}</td>
                        <td style={{ padding: '6px 8px' }}>{d.projet.adresse}{d.projet.ville ? `, ${d.projet.ville}` : ''}</td>
                        <td style={{ padding: '6px 8px', textAlign: 'right' }}>${d.montant.toFixed(2)}</td>
                        <td style={{ padding: '6px 8px', fontSize: '11px' }}>{categoriesLabels[d.categorie] || d.categorie}</td>
                        <td style={{ padding: '6px 8px', textAlign: 'center', fontSize: '11px' }}>{d.facture || '—'}</td>
                        <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                          <button onClick={() => handleSupprimerDepense(d.id, d.projetId)} style={{ padding: '2px 6px', border: '1px solid #E5E7EB', background: 'white', borderRadius: '3px', cursor: 'pointer', color: '#DC2626', fontSize: '11px' }}>✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #E5E7EB', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
            <div style={{ fontSize: '12px' }}>
              {unsavedChanges ? (
                <span style={{ color: '#EF9F27', fontWeight: 500 }}>⚠ Modifications non sauvegardées</span>
              ) : (
                <span style={{ color: '#DC2626' }}>✓ Tout est sauvegardé</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setUnsavedChanges(false)} style={{ padding: '8px 16px', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Annuler</button>
              <button onClick={handleSauvegarderSemaine} disabled={saving} style={{ padding: '8px 16px', background: '#ea1c24', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                {saving ? 'Sauvegarde...' : 'Sauvegarder la semaine'}
              </button>
            </div>
          </div>
        </div>
      )}

      {ongletActif === 'employes' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600' }}>Employés ({employes.length})</h2>
            <button onClick={() => setShowAjouterEmploye(true)} style={{ padding: '8px 14px', background: '#DC2626', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>+ Ajouter un employé</button>
          </div>

          <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 100px 120px 120px 80px', alignItems: 'center', padding: '12px 14px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', fontSize: '11px', fontWeight: 600, color: '#6B7280' }}>
              <div>Employé</div>
              <div style={{ textAlign: 'center' }}>Heures</div>
              <div>Taux/h</div>
              <div>Statut</div>
              <div>Actions</div>
            </div>

            {employes.map((emp, i) => (
              <div key={emp.id} style={{ display: 'grid', gridTemplateColumns: '2fr 100px 120px 120px 80px', alignItems: 'center', padding: '12px 14px', borderBottom: '1px solid #F3F4F6', background: i % 2 === 0 ? 'white' : '#F9FAFB', opacity: emp.actif ? 1 : 0.6 }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '13px' }}>{emp.prenom} {emp.nom}</div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>{emp.email}</div>
                </div>
                <div style={{ fontSize: '12px', textAlign: 'center', color: '#6B7280' }}>{heuresmoisMap[emp.id] || 0}h</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input type="number" step="0.01" value={tauxEdits[emp.id] !== undefined ? tauxEdits[emp.id] : emp.tauxHoraire} onChange={e => setTauxEdits(prev => ({ ...prev, [emp.id]: parseFloat(e.target.value) }))} style={{ width: '60px', padding: '4px 6px', border: '1px solid #E5E7EB', borderRadius: '4px', fontSize: '11px' }} />
                  <span style={{ fontSize: '10px', color: '#6B7280' }}>$/h</span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '3px', background: emp.actif ? '#EAF3DE' : '#FCEBEB', color: emp.actif ? '#3B6D11' : '#A32D2D', fontWeight: 500 }}>
                    {emp.actif ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                  {tauxEdits[emp.id] !== undefined && (
                    <button onClick={() => handleSauvegarderTauxEmploye(emp.id)} style={{ padding: '4px 8px', background: '#DC2626', color: 'white', border: 'none', borderRadius: '3px', fontSize: '11px', cursor: 'pointer', fontWeight: 500 }}>
                      Sauvegarder
                    </button>
                  )}
                  <button onClick={() => handleToggleEmploye(emp.id, emp.actif)} style={{ padding: '4px 8px', background: emp.actif ? '#FCEBEB' : '#EAF3DE', color: emp.actif ? '#A32D2D' : '#3B6D11', border: 'none', borderRadius: '3px', fontSize: '11px', cursor: 'pointer', fontWeight: 500 }}>
                    {emp.actif ? 'Désactiver' : 'Activer'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showAjouterEmploye && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
              <div style={{ background: 'white', borderRadius: '8px', padding: '24px', width: '90%', maxWidth: '400px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Ajouter un employé</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <input type="text" placeholder="Prénom" value={nouvelEmploye.prenom} onChange={e => setNouvelEmploye({...nouvelEmploye, prenom: e.target.value})} style={{ padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '12px' }} />
                    <input type="text" placeholder="Nom" value={nouvelEmploye.nom} onChange={e => setNouvelEmploye({...nouvelEmploye, nom: e.target.value})} style={{ padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '12px' }} />
                  </div>
                  <input type="email" placeholder="Email" value={nouvelEmploye.email} onChange={e => setNouvelEmploye({...nouvelEmploye, email: e.target.value})} style={{ padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '12px' }} />
                  <input type="tel" placeholder="Téléphone" value={nouvelEmploye.telephone} onChange={e => setNouvelEmploye({...nouvelEmploye, telephone: e.target.value})} style={{ padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '12px' }} />
                  <input type="number" step="0.01" placeholder="Taux horaire" value={nouvelEmploye.tauxHoraire} onChange={e => setNouvelEmploye({...nouvelEmploye, tauxHoraire: parseFloat(e.target.value)})} style={{ padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '12px' }} />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button onClick={handleAjouterEmploye} disabled={saving || !nouvelEmploye.prenom || !nouvelEmploye.nom} style={{ flex: 1, padding: '10px', background: '#DC2626', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving || !nouvelEmploye.prenom || !nouvelEmploye.nom ? 0.6 : 1 }}>
                      {saving ? 'Ajout...' : 'Ajouter'}
                    </button>
                    <button onClick={() => setShowAjouterEmploye(false)} style={{ flex: 1, padding: '10px', background: '#E5E7EB', color: '#374151', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
