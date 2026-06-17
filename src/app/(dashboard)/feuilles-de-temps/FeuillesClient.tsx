'use client'
import { useState, useEffect } from 'react'
import { formatMontant, formatDate } from '@/lib/utils'

interface Employe { id: string; prenom: string; nom: string; email?: string; telephone?: string; metier?: string; tauxHoraire: number; actif: boolean }
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

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven']

// Couleur du total d'heures (vert ≈ complet, orange sous le max, rouge dépassement, gris zéro)
function heuresColor(total: number, max: number) {
  if (total > max) return 'var(--danger)'
  if (total >= max - 2) return 'var(--success)'
  if (total === 0) return 'var(--text-disabled)'
  return 'var(--warning)'
}

function Avatar({ name }: { name: string }) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map(s => s.charAt(0).toUpperCase()).join('') || '–'
  return (
    <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--n-200)', color: 'var(--text-secondary)', fontSize: 10, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>{initials}</span>
  )
}

function SegmentedControl({ value, onChange, options }: { value: string; onChange: (v: any) => void; options: { value: string; label: string; icon: string }[] }) {
  return (
    <div style={{ display: 'inline-flex', padding: 3, gap: 2, background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
      {options.map(o => {
        const active = o.value === value
        return (
          <button key={o.value} onClick={() => onChange(o.value)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: 12.5, fontWeight: 600, border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: 'var(--font-sans)', background: active ? 'var(--surface)' : 'transparent', color: active ? 'var(--text-primary)' : 'var(--text-secondary)', boxShadow: active ? 'var(--shadow-sm)' : 'none' }}>
            <i className={`ti ti-${o.icon}`} aria-hidden="true" style={{ fontSize: 15 }} />{o.label}
          </button>
        )
      })}
    </div>
  )
}

const cardSt: React.CSSProperties = { border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--surface)' }
const thSt: React.CSSProperties = { padding: '9px 14px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }
const selSt: React.CSSProperties = { width: '100%', padding: '5px 7px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, fontFamily: 'var(--font-sans)', background: 'var(--surface)', color: 'var(--text-primary)' }
const navBtn: React.CSSProperties = { width: 26, height: 26, border: '1px solid var(--border)', borderRadius: 6, background: 'var(--surface)', cursor: 'pointer', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }

function Lg({ c, t }: { c: string; t: string }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 9, height: 9, borderRadius: 2, background: c }} />{t}</span>
}

function CardHeader({ icon, title, action }: { icon: string; title: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 14px', background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>
        <i className={`ti ti-${icon}`} aria-hidden="true" style={{ fontSize: 15, color: 'var(--text-secondary)' }} />{title}
      </span>
      {action}
    </div>
  )
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
    <div style={{ padding: '22px 24px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18, gap: 14, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Feuilles de temps</h1>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>Semaine du {lundiFormaté} au {vendrediFormaté} {annee} · {Object.values(heuresParEmploye).reduce((a, b) => a + (b as number), 0).toLocaleString('fr-CA').replace('.', ',')} h saisies</p>
        </div>
        <SegmentedControl value={ongletActif} onChange={setOngletActif}
          options={[{ value: 'consultation', label: 'Consultation', icon: 'table' }, { value: 'saisie', label: 'Saisie', icon: 'edit' }, { value: 'employes', label: 'Employés', icon: 'users' }]} />
      </div>

      {ongletActif === 'consultation' && (
        <div style={cardSt}>
          <CardHeader icon="table" title="Heures saisies"
            action={<span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{totalHeures.toLocaleString('fr-CA', { maximumFractionDigits: 1 }).replace('.', ',')} h · {formatMontant(totalMontant)}</span>} />
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)' }}>
                  {([['Date', 'left'], ['Employé', 'left'], ['Projet', 'left'], ['Heures', 'right'], ['Taux', 'right'], ['Coût main-d’œuvre', 'right']] as [string, 'left' | 'right'][]).map((h, i) => (
                    <th key={i} style={{ ...thSt, textAlign: h[1] }}>{h[0]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {feuilles_filtrees.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-tertiary)' }}>Aucune heure saisie</td></tr>
                ) : feuilles_filtrees.slice(0, 30).map((f) => (
                  <tr key={f.id} style={{ borderBottom: '1px solid var(--divider)' }}>
                    <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{formatDate(f.date)}</td>
                    <td style={{ padding: '10px 14px' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Avatar name={`${f.employe.prenom} ${f.employe.nom}`} /><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{f.employe.prenom} {f.employe.nom}</span></span></td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{f.projet.adresse}{f.projet.ville ? `, ${f.projet.ville}` : ''}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--text-primary)' }}>{f.heures.toLocaleString('fr-CA', { maximumFractionDigits: 1 }).replace('.', ',')} h</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary)' }}>{formatMontant(f.tauxHoraire)}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--text-primary)' }}>{formatMontant(f.heures * f.tauxHoraire)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {ongletActif === 'saisie' && (
        <div style={{ paddingBottom: '100px' }}>
          <div style={cardSt}>
            {/* Barre de navigation de semaine + enregistrer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button onClick={semainePrecedente} title="Semaine précédente" style={navBtn}><i className="ti ti-chevron-left" /></button>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Semaine du {lundiFormaté} au {vendrediFormaté} {annee}</span>
                <button onClick={semaineSuivante} title="Semaine suivante" style={navBtn}><i className="ti ti-chevron-right" /></button>
                <button onClick={semaineCourante} style={{ height: 26, padding: '0 10px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--surface)', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'var(--font-sans)' }}>Aujourd'hui</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {unsavedChanges && <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--warning-text)' }}>Modifications non enregistrées</span>}
                <button onClick={handleSauvegarderSemaine} disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 12px', fontSize: 12.5, fontWeight: 600, fontFamily: 'var(--font-sans)', color: '#fff', background: 'var(--dg-red)', border: 'none', borderRadius: 6, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}>
                  <i className="ti ti-device-floppy" aria-hidden="true" />{saving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </div>

            {/* Grille hebdomadaire */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 880, fontSize: 12.5 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ ...thSt, textAlign: 'left' }}>Employé</th>
                    <th style={{ ...thSt, textAlign: 'left' }}>Projet</th>
                    {JOURS.map((j, i) => {
                      const jour = new Date(semaineLundi); jour.setDate(semaineLundi.getDate() + i)
                      return (
                        <th key={i} style={{ ...thSt, textAlign: 'center', minWidth: 64 }}>
                          {j}<div style={{ fontSize: 9, fontWeight: 400, color: 'var(--text-disabled)' }}>{jour.getDate()}</div>
                        </th>
                      )
                    })}
                    <th style={{ ...thSt, textAlign: 'center' }}>Total</th>
                    <th style={{ ...thSt, textAlign: 'center', width: 40 }} />
                  </tr>
                </thead>
                <tbody>
                  {lignes.length === 0 ? (
                    <tr><td colSpan={9} style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-tertiary)' }}>Aucune saisie — ajoutez une ligne pour commencer.</td></tr>
                  ) : lignes.map((ligne, i) => {
                    const max = parametres?.maxHeuresParSemaine || 36.5
                    const totalH = Object.values(ligne.heures).reduce((s: number, h: number | null) => s + (h || 0), 0)
                    const depasse = totalH > max
                    return (
                      <tr key={ligne.id} style={{ borderBottom: i === lignes.length - 1 ? 'none' : '1px solid var(--divider)' }}>
                        <td style={{ padding: '6px 14px', minWidth: 160 }}>
                          <select value={ligne.employeId} onChange={e => onEmployeChange(ligne.id, e.target.value)} style={selSt}>
                            <option value=''>Choisir…</option>
                            {employes.filter(e => e.actif || e.id === ligne.employeId).map(e => <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: '6px 14px', minWidth: 180 }}>
                          <select value={ligne.projetId} onChange={e => setLignes(lignes.map(l => l.id === ligne.id ? { ...l, projetId: e.target.value } : l))} style={selSt}>
                            <option value=''>Choisir…</option>
                            {projets.map(p => <option key={p.id} value={p.id}>{p.adresse}{p.ville ? `, ${p.ville}` : ''}</option>)}
                          </select>
                        </td>
                        {(['lun', 'mar', 'mer', 'jeu', 'ven'] as const).map(jour => {
                          const v = ligne.heures[jour]
                          return (
                            <td key={jour} style={{ padding: '5px 6px', textAlign: 'center' }}>
                              <input type="number" step="0.5" value={v ?? ''} placeholder="—" onChange={e => handleChangerHeures(ligne.id, jour, e.target.value)}
                                style={{ width: 46, height: 28, textAlign: 'center', fontSize: 12.5, fontVariantNumeric: 'tabular-nums', border: '1px solid var(--border)', borderRadius: 6, background: v ? 'var(--surface)' : 'var(--surface-subtle)', fontFamily: 'var(--font-sans)', color: 'var(--text-primary)' }} />
                            </td>
                          )
                        })}
                        <td style={{ padding: '6px 12px', textAlign: 'center' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: heuresColor(totalH, max) }}>
                            {depasse ? <i className="ti ti-alert-triangle" style={{ fontSize: 13 }} /> : null}
                            {totalH.toLocaleString('fr-CA', { maximumFractionDigits: 1 }).replace('.', ',')} h
                          </span>
                          <div style={{ fontSize: 9.5, color: 'var(--text-disabled)', fontVariantNumeric: 'tabular-nums' }}>/ {max.toString().replace('.', ',')} max</div>
                        </td>
                        <td style={{ padding: '6px', textAlign: 'center' }}>
                          <button onClick={() => setLignes(lignes.filter(l => l.id !== ligne.id))} title="Retirer la ligne" style={{ width: 24, height: 24, border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: 15, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><i className="ti ti-x" /></button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Ajouter une ligne + légende des couleurs */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '9px 14px', borderTop: '1px solid var(--border)', background: 'var(--surface-subtle)', flexWrap: 'wrap' }}>
              <button onClick={ajouterLigne} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 11px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--surface)', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-sans)' }}>
                <i className="ti ti-plus" aria-hidden="true" />Ajouter une ligne
              </button>
              <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                <Lg c="var(--success)" t="Semaine complète" />
                <Lg c="var(--warning)" t="Sous le maximum" />
                <Lg c="var(--danger)" t="Dépassement" />
              </div>
            </div>
          </div>

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
                        <td style={{ padding: '6px 8px' }}>{formatDate(d.dateDepense)}</td>
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

        </div>
      )}

      {ongletActif === 'employes' && (
        <div>
          <div style={cardSt}>
            <CardHeader icon="users" title={`Employés (${employes.length})`}
              action={<button onClick={() => setShowAjouterEmploye(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 11px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--surface)', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-sans)' }}><i className="ti ti-plus" aria-hidden="true" />Ajouter</button>} />
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)' }}>
                    {([['Employé', 'left'], ['Rôle', 'left'], ['Heures (mois)', 'right'], ['Taux horaire', 'right'], ['Max hebdo', 'right'], ['Statut', 'left'], ['', 'right']] as [string, 'left' | 'right'][]).map((h, i) => (
                      <th key={i} style={{ ...thSt, textAlign: h[1] }}>{h[0]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employes.map((emp, i) => {
                    const max = parametres?.maxHeuresParSemaine || 36.5
                    return (
                      <tr key={emp.id} style={{ borderBottom: i === employes.length - 1 ? 'none' : '1px solid var(--divider)', opacity: emp.actif ? 1 : 0.55 }}>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <Avatar name={`${emp.prenom} ${emp.nom}`} />
                            <span><span style={{ fontWeight: 600, display: 'block', color: 'var(--text-primary)' }}>{emp.prenom} {emp.nom}</span><span style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>{emp.email || '—'}</span></span>
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{emp.metier || '—'}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary)' }}>{heuresmoisMap[emp.id] || 0} h</td>
                        <td style={{ padding: '8px 14px', textAlign: 'right' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end' }}>
                            <input type="number" step="0.01" value={tauxEdits[emp.id] !== undefined ? tauxEdits[emp.id] : emp.tauxHoraire} onChange={e => setTauxEdits(prev => ({ ...prev, [emp.id]: parseFloat(e.target.value) }))} style={{ width: 66, padding: '5px 6px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--font-sans)', background: 'var(--surface)', color: 'var(--text-primary)', textAlign: 'right' }} />
                            <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>$/h</span>
                            {tauxEdits[emp.id] !== undefined && (
                              <button onClick={() => handleSauvegarderTauxEmploye(emp.id)} title="Enregistrer le taux" style={{ width: 26, height: 26, border: 'none', borderRadius: 6, background: 'var(--dg-red)', color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}><i className="ti ti-check" /></button>
                            )}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary)' }}>{max.toString().replace('.', ',')} h</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 'var(--text-2xs)', fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--radius-full)', background: emp.actif ? 'var(--success-tint)' : 'var(--n-100)', color: emp.actif ? 'var(--success-text)' : 'var(--text-secondary)' }}>
                            {emp.actif ? <><span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />Actif</> : 'Inactif'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                          <button onClick={() => handleToggleEmploye(emp.id, emp.actif)} style={{ height: 26, padding: '0 10px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--surface)', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 11.5, fontWeight: 600, fontFamily: 'var(--font-sans)' }}>{emp.actif ? 'Désactiver' : 'Activer'}</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {showAjouterEmploye && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(31,29,27,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }} onClick={() => setShowAjouterEmploye(false)}>
              <div onClick={e => e.stopPropagation()} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', padding: 22, width: '100%', maxWidth: 400 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>Ajouter un employé</h3>
                <div style={{ display: 'grid', gap: 10 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <input type="text" placeholder="Prénom" value={nouvelEmploye.prenom} onChange={e => setNouvelEmploye({...nouvelEmploye, prenom: e.target.value})} style={{ width: '100%', minWidth: 0, boxSizing: 'border-box', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 13, fontFamily: 'var(--font-sans)', background: 'var(--surface)', color: 'var(--text-primary)' }} />
                    <input type="text" placeholder="Nom" value={nouvelEmploye.nom} onChange={e => setNouvelEmploye({...nouvelEmploye, nom: e.target.value})} style={{ width: '100%', minWidth: 0, boxSizing: 'border-box', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 13, fontFamily: 'var(--font-sans)', background: 'var(--surface)', color: 'var(--text-primary)' }} />
                  </div>
                  <input type="email" placeholder="Courriel (optionnel)" value={nouvelEmploye.email} onChange={e => setNouvelEmploye({...nouvelEmploye, email: e.target.value})} style={{ width: '100%', minWidth: 0, boxSizing: 'border-box', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 13, fontFamily: 'var(--font-sans)', background: 'var(--surface)', color: 'var(--text-primary)' }} />
                  <input type="tel" placeholder="Téléphone" value={nouvelEmploye.telephone} onChange={e => setNouvelEmploye({...nouvelEmploye, telephone: e.target.value})} style={{ width: '100%', minWidth: 0, boxSizing: 'border-box', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 13, fontFamily: 'var(--font-sans)', background: 'var(--surface)', color: 'var(--text-primary)' }} />
                  <input type="number" step="0.01" placeholder="Taux horaire ($/h)" value={nouvelEmploye.tauxHoraire} onChange={e => setNouvelEmploye({...nouvelEmploye, tauxHoraire: parseFloat(e.target.value)})} style={{ width: '100%', minWidth: 0, boxSizing: 'border-box', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 13, fontFamily: 'var(--font-sans)', background: 'var(--surface)', color: 'var(--text-primary)' }} />
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
                    <button onClick={() => setShowAjouterEmploye(false)} style={{ padding: '9px 14px', background: 'var(--surface)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-sans)', cursor: 'pointer' }}>
                      Annuler
                    </button>
                    <button onClick={handleAjouterEmploye} disabled={saving || !nouvelEmploye.prenom || !nouvelEmploye.nom} style={{ padding: '9px 16px', background: 'var(--dg-red)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-sans)', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving || !nouvelEmploye.prenom || !nouvelEmploye.nom ? 0.6 : 1 }}>
                      {saving ? 'Ajout…' : 'Ajouter'}
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
