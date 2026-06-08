'use client'
import { useState, useEffect } from 'react'
import { Clock, Trash2 } from 'lucide-react'

interface Employe { id: string; prenom: string; nom: string; tauxHoraire: number; actif: boolean }
interface User { id: string; prenom: string; nom: string; role: string; tauxHoraire: number; actif: boolean }
interface FeuilleTemps { id: string; employeId: string; projetId: string; date: string; heures: number; tauxHoraire: number; employe: { prenom: string; nom: string }; projet: { numero: string; adresse: string } }
interface Depense { id: string; projetId: string; categorie: string; description: string; montant: number; dateDepense: string; facture?: string; projet: { numero: string; adresse: string } }
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
      const [empRes, userRes, projRes, fRes, depRes, paramRes] = await Promise.all([
        fetch('/api/employes'),
        fetch('/api/users'),
        fetch('/api/projets'),
        fetch('/api/feuilles-de-temps'),
        fetch('/api/depenses'),
        fetch('/api/parametres')
      ])
      if (empRes.ok) setEmployes((await empRes.json()).employes || [])
      if (userRes.ok) {
        const data = await userRes.json()
        setUsers(Array.isArray(data) ? data : data.users || [])
      }
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

        console.log('📊 Feuilles chargées:', data.feuilles?.length || 0)
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
          const jourKey = ['', 'lun', 'mar', 'mer', 'jeu', 'ven'][jour] as keyof typeof lignesMap[key]['heures']
          if (jourKey) lignesMap[key].heures[jourKey] = f.heures
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
                    <td style={{ padding: '12px', fontSize: '13px' }}>{f.projet.numero}</td>
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
                  color: depasse ? '#EF4444' : proche ? '#854F0B' : '#1D9E75',
                  border: `1px solid ${depasse ? '#FCA5A5' : proche ? '#FCD34D' : '#86EFAC'}`,
                }}>
                  {emp?.prenom} {emp?.nom} — {heures.toFixed(1)}h / {max}h {depasse && '⚠️'}
                </span>
              )
            })}
          </div>

          {lignes.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>Aucune saisie pour cette semaine</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Ajoute les heures des employés ci-dessus ou crée des feuilles existantes dans les données</div>
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
                        <td style={{ padding: '8px', textAlign: 'right', fontWeight: 500, fontSize: '12px' }}>${total.toFixed(0)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '2px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>💰 Dépenses fournisseurs</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '16px' }}>
              <input type="text" placeholder="Fournisseur" value={newDepense.fournisseur} onChange={e => setNewDepense({...newDepense, fournisseur: e.target.value})} style={{ padding: '8px', border: '1px solid #E5E7EB', borderRadius: '4px', fontSize: '12px' }} />
              <select value={newDepense.projetId} onChange={e => setNewDepense({...newDepense, projetId: e.target.value})} style={{ padding: '8px', border: '1px solid #E5E7EB', borderRadius: '4px', fontSize: '12px' }}>
                <option value="">Projet</option>
                {projets.map(p => <option key={p.id} value={p.id}>{p.numero}</option>)}
              </select>
              <input type="date" value={newDepense.date} onChange={e => setNewDepense({...newDepense, date: e.target.value})} style={{ padding: '8px', border: '1px solid #E5E7EB', borderRadius: '4px', fontSize: '12px' }} />
              <input type="number" step="0.01" placeholder="Montant" value={newDepense.montant} onChange={e => setNewDepense({...newDepense, montant: e.target.value})} style={{ padding: '8px', border: '1px solid #E5E7EB', borderRadius: '4px', fontSize: '12px' }} />
              <input type="text" placeholder="Facture" value={newDepense.facture} onChange={e => setNewDepense({...newDepense, facture: e.target.value})} style={{ padding: '8px', border: '1px solid #E5E7EB', borderRadius: '4px', fontSize: '12px' }} />
              <select value={newDepense.categorie} onChange={e => setNewDepense({...newDepense, categorie: e.target.value})} style={{ padding: '8px', border: '1px solid #E5E7EB', borderRadius: '4px', fontSize: '12px' }}>
                <option value="MATERIAUX">Matériaux</option>
                <option value="SOUS_TRAITANT">S-Traitant</option>
                <option value="EQUIPEMENT">Équipement</option>
                <option value="AUTRE">Autre</option>
              </select>
              <button onClick={handleAjouterDepense} style={{ padding: '8px', background: '#ea1c24', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}>+ Ajouter</button>
            </div>

            <div style={{ marginTop: '16px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: '#6B7280' }}>30 derniers jours</h4>
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
                        <td style={{ padding: '6px 8px' }}>{d.projet.numero}</td>
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
                <span style={{ color: '#1D9E75' }}>✓ Tout est sauvegardé</span>
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
                  <input type="number" step="0.01" value={tauxEdits[user.id] !== undefined ? tauxEdits[user.id] : user.tauxHoraire} onChange={e => setTauxEdits(prev => ({ ...prev, [user.id]: parseFloat(e.target.value) }))} style={{ width: '70px', padding: '6px 8px', border: '1px solid #E5E7EB', borderRadius: '4px', fontSize: '12px' }} />
                  <span style={{ fontSize: '11px', color: '#6B7280' }}>$/h</span>
                </div>
                <button onClick={() => handleSauvegarderTaux(user.id)} disabled={tauxEdits[user.id] === undefined} style={{ padding: '6px 12px', background: tauxEdits[user.id] !== undefined ? '#ea1c24' : '#D1D5DB', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: tauxEdits[user.id] !== undefined ? 'pointer' : 'not-allowed', fontWeight: 500 }}>
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
