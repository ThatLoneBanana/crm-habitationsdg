'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Client {
  id: string
  prenom: string
  nom: string
  email: string
  telephone?: string
  projets: Array<{ id: string; adresse: string; slug?: string; phase?: string }>
}

function phaseConfig(phase: string | null | undefined) {
  if (!phase) return { label: 'Signé', bg: '#E6F1FB', text: '#185FA5', bar: '#378ADD' }
  const config: Record<string, any> = {
    SIGNE: { label: 'Signé', bg: '#E6F1FB', text: '#185FA5', bar: '#378ADD' },
    PREPARATION: { label: 'Préparation', bg: '#EEEDFE', text: '#3C3489', bar: '#7F77DD' },
    CHANTIER: { label: 'Chantier', bg: '#FAEEDA', text: '#854F0B', bar: '#EF9F27' },
    LIVRAISON: { label: 'Livraison', bg: '#EAF3DE', text: '#3B6D11', bar: '#639922' },
    TERMINE: { label: 'Terminé', bg: '#F1EFE8', text: '#5F5E5A', bar: '#B4B2A9' },
  }
  return config[phase] || config['SIGNE']
}

export default function ClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [vue, setVue] = useState<'cartes' | 'liste'>('cartes')
  const [tri, setTri] = useState<'nom' | 'prenom'>('nom')
  const [recherche, setRecherche] = useState('')
  const [nouveauOpen, setNouveauOpen] = useState(false)
  const [modifierOpen, setModifierOpen] = useState(false)
  const [supprimerOpen, setSupprimerOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState({ prenom: '', nom: '', email: '', telephone: '' })

  // Charger les clients
  useEffect(() => {
    const loadClients = async () => {
      try {
        const res = await fetch('/api/clients')
        if (res.ok) {
          const data = await res.json()
          setClients(data.clients || [])
        }
      } catch (err) {
        console.error('Erreur:', err)
      } finally {
        setLoading(false)
      }
    }
    loadClients()
  }, [])

  // Filtrer et trier
  const clientsFiltres = clients
    .filter(c => `${c.prenom} ${c.nom}`.toLowerCase().includes(recherche.toLowerCase()))
    .sort((a, b) => {
      const valA = tri === 'nom' ? a.nom : a.prenom
      const valB = tri === 'nom' ? b.nom : b.prenom
      return valA.localeCompare(valB)
    })

  // Sauvegarder client
  const handleSauvegarder = async () => {
    try {
      const method = selectedClient ? 'PUT' : 'POST'
      const url = selectedClient ? `/api/clients/${selectedClient.id}` : '/api/clients'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setNouveauOpen(false)
        setModifierOpen(false)
        setFormData({ prenom: '', nom: '', email: '', telephone: '' })
        setSelectedClient(null)
        location.reload()
      }
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  // Supprimer client
  const handleSupprimer = async () => {
    if (!selectedClient) return
    try {
      const res = await fetch(`/api/clients/${selectedClient.id}`, { method: 'DELETE' })
      if (res.ok) {
        setSupprimerOpen(false)
        setSelectedClient(null)
        location.reload()
      }
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  const openModifier = (client: Client) => {
    setSelectedClient(client)
    setFormData({ prenom: client.prenom, nom: client.nom, email: client.email, telephone: client.telephone || '' })
    setModifierOpen(true)
  }

  const openSupprimer = (client: Client) => {
    setSelectedClient(client)
    setSupprimerOpen(true)
  }

  if (loading) return <div style={{ padding: '24px' }}>Chargement...</div>

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Clients</h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => setVue('cartes')} style={{ padding: '8px 12px', border: vue === 'cartes' ? 'none' : '1px solid #E5E7EB', background: vue === 'cartes' ? '#1D9E75' : 'white', color: vue === 'cartes' ? 'white' : 'black', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>⊞ Cartes</button>
          <button onClick={() => setVue('liste')} style={{ padding: '8px 12px', border: vue === 'liste' ? 'none' : '1px solid #E5E7EB', background: vue === 'liste' ? '#1D9E75' : 'white', color: vue === 'liste' ? 'white' : 'black', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>☰ Liste</button>
          <select value={tri} onChange={e => setTri(e.target.value as any)} style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
            <option value='nom'>Trier par nom</option>
            <option value='prenom'>Trier par prénom</option>
          </select>
          <button onClick={() => { setNouveauOpen(true); setSelectedClient(null); setFormData({ prenom: '', nom: '', email: '', telephone: '' }); }} style={{ padding: '8px 12px', background: '#1D9E75', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>+ Nouveau client</button>
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
          {clientsFiltres.map(client => (
            <div key={client.id} style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', background: 'white' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1D9E75', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, marginBottom: '10px', fontSize: '14px' }}>
                {client.prenom[0]}{client.nom[0]}
              </div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>{client.prenom} {client.nom}</div>
              <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>{client.email}</div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>{client.telephone}</div>

              <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #F3F4F6' }}>
                {client.projets.map(p => (
                  <div key={p.id} style={{ fontSize: '11px', display: 'flex', justifyContent: 'space-between', marginBottom: '3px', cursor: 'pointer' }} onClick={() => router.push(`/projets/${p.slug || p.id}`)}>
                    <span style={{ flex: 1 }}>{p.adresse}</span>
                    <span style={{ padding: '1px 6px', borderRadius: '20px', background: phaseConfig(p.phase).bg, color: phaseConfig(p.phase).text, fontSize: '10px', whiteSpace: 'nowrap' }}>{phaseConfig(p.phase).label}</span>
                  </div>
                ))}
                {client.projets.length === 0 && <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Aucun projet</span>}
              </div>

              <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                <button onClick={() => openModifier(client)} style={{ flex: 1, padding: '6px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>✏️ Modifier</button>
                <button onClick={() => openSupprimer(client)} style={{ padding: '6px 10px', border: '1px solid #FCA5A5', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', color: '#EF4444' }}>🗑</button>
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
              <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '11px', color: '#6B7280', fontWeight: 500, borderBottom: '1px solid #E5E7EB' }}>Courriel</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '11px', color: '#6B7280', fontWeight: 500, borderBottom: '1px solid #E5E7EB' }}>Téléphone</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '11px', color: '#6B7280', fontWeight: 500, borderBottom: '1px solid #E5E7EB' }}>Projets</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '11px', color: '#6B7280', fontWeight: 500, borderBottom: '1px solid #E5E7EB' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clientsFiltres.map(client => (
              <tr key={client.id} style={{ borderBottom: '1px solid #F3F4F6', background: 'white' }} onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                <td style={{ padding: '10px 12px', fontSize: '13px', fontWeight: 500 }}>{client.prenom} {client.nom}</td>
                <td style={{ padding: '10px 12px', fontSize: '12px', color: '#6B7280' }}>{client.email}</td>
                <td style={{ padding: '10px 12px', fontSize: '12px', color: '#6B7280' }}>{client.telephone || '—'}</td>
                <td style={{ padding: '10px 12px', fontSize: '12px' }}>{client.projets.length} projet(s)</td>
                <td style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => openModifier(client)} style={{ padding: '4px 8px', border: '1px solid #E5E7EB', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Modifier</button>
                    <button onClick={() => openSupprimer(client)} style={{ padding: '4px 8px', border: '1px solid #FCA5A5', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', color: '#EF4444' }}>Supprimer</button>
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
            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>{selectedClient ? 'Modifier' : 'Nouveau'} client</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <input placeholder='Prénom' value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} />
              <input placeholder='Nom' value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} />
              <input placeholder='Email' value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} />
              <input placeholder='Téléphone' value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { setNouveauOpen(false); setModifierOpen(false); setSelectedClient(null); }} style={{ flex: 1, padding: '8px', border: '1px solid #E5E7EB', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Annuler</button>
              <button onClick={handleSauvegarder} style={{ flex: 1, padding: '8px', background: '#1D9E75', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>Sauvegarder</button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog Supprimer */}
      {supprimerOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '8px', padding: '24px', maxWidth: '400px', width: '90%' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Supprimer le client ?</h2>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '16px' }}>Êtes-vous sûr de vouloir supprimer {selectedClient?.prenom} {selectedClient?.nom} ?</p>
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
