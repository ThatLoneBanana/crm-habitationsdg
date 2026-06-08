'use client'
import { useState, useEffect } from 'react'

interface Fournisseur {
  id: string
  nom: string
  metier: string
  email: string
  telephone?: string
  actif: boolean
}

export default function FournisseursPage() {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([])
  const [loading, setLoading] = useState(true)
  const [vue, setVue] = useState<'cartes' | 'liste'>('cartes')
  const [tri, setTri] = useState<'nom' | 'metier'>('nom')
  const [recherche, setRecherche] = useState('')
  const [nouveauOpen, setNouveauOpen] = useState(false)
  const [modifierOpen, setModifierOpen] = useState(false)
  const [supprimerOpen, setSupprimerOpen] = useState(false)
  const [selectedFournisseur, setSelectedFournisseur] = useState<Fournisseur | null>(null)
  const [formData, setFormData] = useState({ nom: '', metier: '', email: '', telephone: '', actif: true })

  // Charger les fournisseurs
  useEffect(() => {
    const loadFournisseurs = async () => {
      try {
        const res = await fetch('/api/fournisseurs')
        if (res.ok) {
          const data = await res.json()
          setFournisseurs(data.fournisseurs || [])
        }
      } catch (err) {
        console.error('Erreur:', err)
      } finally {
        setLoading(false)
      }
    }
    loadFournisseurs()
  }, [])

  // Filtrer et trier
  const fournisseursFiltres = fournisseurs
    .filter(f => f.nom.toLowerCase().includes(recherche.toLowerCase()) || f.metier.toLowerCase().includes(recherche.toLowerCase()))
    .sort((a, b) => {
      const valA = tri === 'nom' ? a.nom : a.metier
      const valB = tri === 'nom' ? b.nom : b.metier
      return valA.localeCompare(valB)
    })

  // Sauvegarder fournisseur
  const handleSauvegarder = async () => {
    try {
      const method = selectedFournisseur ? 'PUT' : 'POST'
      const url = selectedFournisseur ? `/api/fournisseurs/${selectedFournisseur.id}` : '/api/fournisseurs'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setNouveauOpen(false)
        setModifierOpen(false)
        setFormData({ nom: '', metier: '', email: '', telephone: '', actif: true })
        setSelectedFournisseur(null)
        location.reload()
      }
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  // Supprimer fournisseur
  const handleSupprimer = async () => {
    if (!selectedFournisseur) return
    try {
      const res = await fetch(`/api/fournisseurs/${selectedFournisseur.id}`, { method: 'DELETE' })
      if (res.ok) {
        setSupprimerOpen(false)
        setSelectedFournisseur(null)
        location.reload()
      }
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  const openModifier = (f: Fournisseur) => {
    setSelectedFournisseur(f)
    setFormData({ nom: f.nom, metier: f.metier, email: f.email, telephone: f.telephone || '', actif: f.actif })
    setModifierOpen(true)
  }

  const openSupprimer = (f: Fournisseur) => {
    setSelectedFournisseur(f)
    setSupprimerOpen(true)
  }

  if (loading) return <div style={{ padding: '24px' }}>Chargement...</div>

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Fournisseurs</h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => setVue('cartes')} style={{ padding: '8px 12px', border: vue === 'cartes' ? 'none' : '1px solid #E5E7EB', background: vue === 'cartes' ? '#ea1c24' : 'white', color: vue === 'cartes' ? 'white' : 'black', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>⊞ Cartes</button>
          <button onClick={() => setVue('liste')} style={{ padding: '8px 12px', border: vue === 'liste' ? 'none' : '1px solid #E5E7EB', background: vue === 'liste' ? '#ea1c24' : 'white', color: vue === 'liste' ? 'white' : 'black', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>☰ Liste</button>
          <select value={tri} onChange={e => setTri(e.target.value as any)} style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
            <option value='nom'>Trier par nom</option>
            <option value='metier'>Trier par métier</option>
          </select>
          <button onClick={() => { setNouveauOpen(true); setSelectedFournisseur(null); setFormData({ nom: '', metier: '', email: '', telephone: '', actif: true }); }} style={{ padding: '8px 12px', background: '#ea1c24', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>+ Nouveau</button>
        </div>
      </div>

      {/* Barre de recherche */}
      <input
        placeholder='Rechercher...'
        value={recherche}
        onChange={e => setRecherche(e.target.value)}
        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '24px', fontSize: '13px' }}
      />

      {/* VUE CARTES */}
      {vue === 'cartes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
          {fournisseursFiltres.map(f => (
            <div key={f.id} style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{f.nom}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>{f.metier}</div>
                </div>
                <span style={{ padding: '4px 8px', borderRadius: '4px', background: f.actif ? '#EAF3DE' : '#F3F4F6', color: f.actif ? '#3B6D11' : '#6B7280', fontSize: '11px', fontWeight: 500 }}>
                  {f.actif ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px' }}>{f.email}</div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>{f.telephone}</div>

              <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                <button onClick={() => openModifier(f)} style={{ flex: 1, padding: '6px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>✏️ Modifier</button>
                <button onClick={() => openSupprimer(f)} style={{ padding: '6px 10px', border: '1px solid #FCA5A5', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', color: '#EF4444' }}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VUE LISTE */}
      {vue === 'liste' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#F9FAFB' }}>
            <tr>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '11px', color: '#6B7280', fontWeight: 500, borderBottom: '1px solid #E5E7EB' }}>Nom</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '11px', color: '#6B7280', fontWeight: 500, borderBottom: '1px solid #E5E7EB' }}>Métier</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '11px', color: '#6B7280', fontWeight: 500, borderBottom: '1px solid #E5E7EB' }}>Courriel</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '11px', color: '#6B7280', fontWeight: 500, borderBottom: '1px solid #E5E7EB' }}>Téléphone</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '11px', color: '#6B7280', fontWeight: 500, borderBottom: '1px solid #E5E7EB' }}>Statut</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '11px', color: '#6B7280', fontWeight: 500, borderBottom: '1px solid #E5E7EB' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fournisseursFiltres.map(f => (
              <tr key={f.id} style={{ borderBottom: '1px solid #F3F4F6', background: 'white' }} onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                <td style={{ padding: '10px 12px', fontSize: '13px', fontWeight: 500 }}>{f.nom}</td>
                <td style={{ padding: '10px 12px', fontSize: '12px', color: '#6B7280' }}>{f.metier}</td>
                <td style={{ padding: '10px 12px', fontSize: '12px', color: '#6B7280' }}>{f.email}</td>
                <td style={{ padding: '10px 12px', fontSize: '12px', color: '#6B7280' }}>{f.telephone || '—'}</td>
                <td style={{ padding: '10px 12px', fontSize: '12px' }}>
                  <span style={{ padding: '2px 6px', borderRadius: '3px', background: f.actif ? '#EAF3DE' : '#F3F4F6', color: f.actif ? '#3B6D11' : '#6B7280' }}>
                    {f.actif ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => openModifier(f)} style={{ padding: '4px 8px', border: '1px solid #E5E7EB', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Modifier</button>
                    <button onClick={() => openSupprimer(f)} style={{ padding: '4px 8px', border: '1px solid #FCA5A5', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', color: '#EF4444' }}>Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Dialog Nouveau/Modifier */}
      {(nouveauOpen || modifierOpen) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', maxWidth: '400px', width: '90%' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>{selectedFournisseur ? 'Modifier' : 'Nouveau'} fournisseur</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <input placeholder='Nom' value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} />
              <input placeholder='Métier' value={formData.metier} onChange={e => setFormData({...formData, metier: e.target.value})} style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} />
              <input placeholder='Email' value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} />
              <input placeholder='Téléphone' value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} />
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <input type='checkbox' checked={formData.actif} onChange={e => setFormData({...formData, actif: e.target.checked})} />
                Actif
              </label>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { setNouveauOpen(false); setModifierOpen(false); setSelectedFournisseur(null); }} style={{ flex: 1, padding: '8px', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Annuler</button>
              <button onClick={handleSauvegarder} style={{ flex: 1, padding: '8px', background: '#ea1c24', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>Sauvegarder</button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog Supprimer */}
      {supprimerOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', maxWidth: '400px', width: '90%' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Supprimer le fournisseur ?</h2>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '16px' }}>Êtes-vous sûr de vouloir supprimer {selectedFournisseur?.nom} ?</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setSupprimerOpen(false)} style={{ flex: 1, padding: '8px', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Annuler</button>
              <button onClick={handleSupprimer} style={{ flex: 1, padding: '8px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
