'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Role = 'ADMIN' | 'COMPTABILITE' | 'VENDEUR' | 'CHARGE_PROJET' | 'DEVELOPPEUR'
interface User { id: string; email: string; prenom: string; nom: string; role: Role; actif: boolean }

// Rôles configurables (ADMIN/DEVELOPPEUR = accès total non configurable)
const CONFIG_ROLES: Role[] = ['COMPTABILITE', 'CHARGE_PROJET', 'VENDEUR']
const CAPS: { key: string; label: string }[] = [
  { key: 'voirCosting', label: 'Voir costing' },
  { key: 'voirFeuilles', label: 'Voir feuilles' },
  { key: 'editFeuilles', label: 'Éditer feuilles' },
  { key: 'voirGCR', label: 'Voir GCR' },
  { key: 'editCedule', label: 'Éditer cédule' },
]

export default function ParametresPage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<'general' | 'compte' | 'utilisateurs' | 'acces'>('compte')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [estAdminOuComptabilite, setEstAdminOuComptabilite] = useState(false)
  const [editUser, setEditUser] = useState({ prenom: '', nom: '' })
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteForm, setInviteForm] = useState({ prenom: '', nom: '', email: '', role: 'VENDEUR' as Role })
  const [passwordForm, setPasswordForm] = useState({ nouveau: '', confirmer: '' })
  const [parametres, setParametres] = useState({ nomCompagnie: 'Habitations DG', rbq: '5856-1036-01', email: 'info@habitations-dg.com', telephone: '', siteWeb: 'habitations-dg.com', maxHeuresParSemaine: 36.5, margeCeduleJours: 5, toleranceDefautJours: 3 })
  const [accessPerms, setAccessPerms] = useState<Record<string, Record<string, boolean>>>({})

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load all data in parallel with timeout
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 5000)

        const [meRes, paramRes] = await Promise.all([
          fetch('/api/me', { signal: controller.signal }).catch(() => null),
          fetch('/api/parametres', { signal: controller.signal }).catch(() => null)
        ])

        clearTimeout(timeout)

        if (meRes?.ok) {
          const { user: userData } = await meRes.json()
          setCurrentUser(userData)
          setEditUser({ prenom: userData.prenom, nom: userData.nom })

          // Détermine si admin/comptabilité/développeur
          const estAdmin = userData.role === 'ADMIN'
          const estComptabilite = userData.role === 'COMPTABILITE'
          const estDeveloppeur = userData.role === 'DEVELOPPEUR'
          setEstAdminOuComptabilite(estAdmin || estComptabilite || estDeveloppeur)

          // Défaut à 'general' pour admin/compta/dev, 'compte' pour autres
          if (estAdmin || estComptabilite || estDeveloppeur) {
            setActiveTab('general')
          }

          // Load users + permissions configurables si admin ou développeur
          if (estAdmin || estDeveloppeur) {
            try {
              const usersRes = await fetch('/api/users', { signal: controller.signal })
              if (usersRes.ok) setUsers(await usersRes.json())
            } catch (e) {
              console.error('Erreur chargement users:', e)
            }
            try {
              const accRes = await fetch('/api/role-permissions', { signal: controller.signal })
              if (accRes.ok) setAccessPerms((await accRes.json()).permissions || {})
            } catch (e) {
              console.error('Erreur chargement accès:', e)
            }
          }

        }

        if (paramRes?.ok) {
          const data = await paramRes.json()
          setParametres(data.parametres || data)
        }

        setLoading(false)
      } catch (err: any) {
        console.error('Erreur:', err)
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSaveUser = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editUser)
      })
      if (!res.ok) throw new Error('Erreur mise à jour')
      const userData = await res.json()
      setCurrentUser(userData)
      setSuccess('Profil mis à jour')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/users/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteForm)
      })
      if (!res.ok) throw new Error('Erreur invitation')
      setSuccess('Utilisateur invité')
      setInviteForm({ prenom: '', nom: '', email: '', role: 'VENDEUR' })
      setInviteOpen(false)
      const usersRes = await fetch('/api/users')
      if (usersRes.ok) setUsers(await usersRes.json())
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleChangeRole = async (userId: string, role: Role) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      })
      if (!res.ok) throw new Error('Erreur lors du changement de rôle')
      setUsers(users.map(u => u.id === userId ? { ...u, role } : u))
      setSuccess('Rôle mis à jour')
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleToggleUser = async (userId: string, actif: boolean) => {
    try {
      await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actif: !actif })
      })
      const usersRes = await fetch('/api/users')
      if (usersRes.ok) setUsers(await usersRes.json())
      setSuccess(actif ? 'Désactivé' : 'Activé')
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.nouveau !== passwordForm.confirmer) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: passwordForm.nouveau })
      if (error) throw error
      setSuccess('Mot de passe changé')
      setPasswordForm({ nouveau: '', confirmer: '' })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveParametres = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/parametres', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parametres)
      })
      if (!res.ok) throw new Error('Erreur')
      setSuccess('Paramètres sauvegardés')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const toggleAccessCap = (role: string, cap: string) => {
    setAccessPerms(prev => ({
      ...prev,
      [role]: { ...prev[role], [cap]: !prev[role]?.[cap] },
    }))
  }

  const handleSaveAccess = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/role-permissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions: accessPerms }),
      })
      if (!res.ok) throw new Error('Erreur lors de la sauvegarde des accès')
      setSuccess('Accès mis à jour')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ padding: '24px' }}>Chargement...</div>

  const roleLabel = (r: Role) => ({ ADMIN: 'Admin', COMPTABILITE: 'Comptabilité', VENDEUR: 'Vendeur', CHARGE_PROJET: 'Chargé de projet', DEVELOPPEUR: 'Développeur' }[r])
  const roleColor = (r: Role) => ({ ADMIN: '#185FA5', COMPTABILITE: '#3C3489', VENDEUR: '#854F0B', CHARGE_PROJET: '#1D9E75', DEVELOPPEUR: '#7C3AED' }[r])

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '24px' }}>Paramètres</h1>

      <div style={{ display: 'flex', gap: '2px', marginBottom: '24px', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        {estAdminOuComptabilite && (
          <button onClick={() => setActiveTab('general')} style={{ padding: '12px 16px', fontSize: '13px', fontWeight: activeTab === 'general' ? 500 : 400, background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: activeTab === 'general' ? '2px solid var(--color-text-primary)' : 'none', color: activeTab === 'general' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>Général</button>
        )}
        <button onClick={() => setActiveTab('compte')} style={{ padding: '12px 16px', fontSize: '13px', fontWeight: activeTab === 'compte' ? 500 : 400, background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: activeTab === 'compte' ? '2px solid var(--color-text-primary)' : 'none', color: activeTab === 'compte' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>Mon compte</button>
        {(currentUser?.role === 'ADMIN' || currentUser?.role === 'DEVELOPPEUR') && (
          <button onClick={() => setActiveTab('utilisateurs')} style={{ padding: '12px 16px', fontSize: '13px', fontWeight: activeTab === 'utilisateurs' ? 500 : 400, background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: activeTab === 'utilisateurs' ? '2px solid var(--color-text-primary)' : 'none', color: activeTab === 'utilisateurs' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>Utilisateurs</button>
        )}
        {(currentUser?.role === 'ADMIN' || currentUser?.role === 'DEVELOPPEUR') && (
          <button onClick={() => setActiveTab('acces')} style={{ padding: '12px 16px', fontSize: '13px', fontWeight: activeTab === 'acces' ? 500 : 400, background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: activeTab === 'acces' ? '2px solid var(--color-text-primary)' : 'none', color: activeTab === 'acces' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>Accès</button>
        )}
        {/* Onglet de navigation vers l'éditeur de cédules types (page dédiée, ADMIN/DEV) */}
        {(currentUser?.role === 'ADMIN' || currentUser?.role === 'DEVELOPPEUR') && (
          <a href="/parametres/templates" style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 400, background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: 'none', color: 'var(--color-text-secondary)', textDecoration: 'none', display: 'inline-block' }}>Cédules types</a>
        )}
      </div>

      {error && <div style={{ background: '#FCEBEB', color: '#A32D2D', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '12px' }}>{error}</div>}
      {success && <div style={{ background: '#EAF3DE', color: '#3B6D11', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '12px' }}>{success}</div>}

      {activeTab === 'general' && (
        <div style={{ maxWidth: '600px' }}>
          {currentUser?.role === 'ADMIN' || currentUser?.role === 'DEVELOPPEUR' ? (
            <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px', background: '#EFF6FF', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>📊 Journal d'activité</h3>
                <p style={{ fontSize: '12px', color: '#6B7280' }}>Voir l'historique complet des actions dans l'application</p>
              </div>
              <a href='/parametres/logs' style={{ padding: '8px 16px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>Ouvrir</a>
            </div>
          ) : null}
          <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px', background: '#FAFAFA' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Paramètres généraux</h2>
            <div style={{ display: 'grid', gap: '16px' }}>
            <div><label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Nom de la compagnie</label><input value={parametres.nomCompagnie} onChange={(e) => setParametres({ ...parametres, nomCompagnie: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>RBQ</label><input value={parametres.rbq} onChange={(e) => setParametres({ ...parametres, rbq: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} /></div>
              <div><label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Courriel</label><input type="email" value={parametres.email} onChange={(e) => setParametres({ ...parametres, email: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Téléphone</label><input type="tel" value={parametres.telephone} onChange={(e) => setParametres({ ...parametres, telephone: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} /></div>
              <div><label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Site web</label><input value={parametres.siteWeb} onChange={(e) => setParametres({ ...parametres, siteWeb: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} /></div>
            </div>
            <div><label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Max heures par semaine</label><input type="number" step="0.5" value={parametres.maxHeuresParSemaine} onChange={(e) => setParametres({ ...parametres, maxHeuresParSemaine: parseFloat(e.target.value) })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Marge initiale de cédule (jours ouvrables)</label><input type="number" min="0" step="1" value={parametres.margeCeduleJours} onChange={(e) => setParametres({ ...parametres, margeCeduleJours: parseInt(e.target.value, 10) || 0 })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} /></div>
              <div><label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Tolérance de décalage par défaut (jours)</label><input type="number" min="0" step="1" value={parametres.toleranceDefautJours} onChange={(e) => setParametres({ ...parametres, toleranceDefautJours: parseInt(e.target.value, 10) || 0 })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} /></div>
            </div>
            <button onClick={handleSaveParametres} disabled={saving} style={{ padding: '10px 16px', background: '#ea1c24', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1, width: 'fit-content' }}>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'compte' && currentUser && (
        <div style={{ maxWidth: '600px' }}>
          <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px', background: '#FAFAFA' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Mon compte</h2>
            <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Prénom</label><input value={editUser.prenom} onChange={(e) => setEditUser({ ...editUser, prenom: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} /></div>
              <div><label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Nom</label><input value={editUser.nom} onChange={(e) => setEditUser({ ...editUser, nom: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} /></div>
            </div>
            <div><label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Courriel</label><input type="email" value={currentUser.email} disabled style={{ width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px', background: 'var(--color-background-secondary)' }} /></div>
            <button onClick={handleSaveUser} disabled={saving} style={{ padding: '10px 16px', background: '#ea1c24', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1, width: 'fit-content' }}>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</button>
            <hr style={{ borderColor: '#E5E7EB', margin: '16px 0' }} />
            <h3 style={{ fontSize: '14px', fontWeight: 500 }}>Changer le mot de passe</h3>
            <form onSubmit={handleChangePassword} style={{ display: 'grid', gap: '12px' }}>
              <div><label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Nouveau mot de passe</label><input type="password" value={passwordForm.nouveau} onChange={(e) => setPasswordForm({ ...passwordForm, nouveau: e.target.value })} required style={{ width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} /></div>
              <div><label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Confirmer le mot de passe</label><input type="password" value={passwordForm.confirmer} onChange={(e) => setPasswordForm({ ...passwordForm, confirmer: e.target.value })} required style={{ width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} /></div>
              <button type="submit" disabled={saving || !passwordForm.nouveau} style={{ padding: '10px 16px', background: '#ea1c24', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving || !passwordForm.nouveau ? 0.6 : 1, width: 'fit-content' }}>{saving ? 'Mise à jour...' : 'Sauvegarder'}</button>
            </form>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'utilisateurs' && (currentUser?.role === 'ADMIN' || currentUser?.role === 'DEVELOPPEUR') && (
        <div>
          <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px', background: '#FAFAFA' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600 }}>Utilisateurs ({users.length})</h2>
              <button onClick={() => setInviteOpen(true)} style={{ padding: '8px 12px', background: '#ea1c24', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>+ Inviter</button>
            </div>

          {inviteOpen && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
              <div style={{ background: 'var(--color-background-primary)', borderRadius: '8px', padding: '24px', width: '90%', maxWidth: '400px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '16px' }}>Inviter un utilisateur</h3>
                <form onSubmit={handleInvite} style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div><label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Prénom</label><input value={inviteForm.prenom} onChange={(e) => setInviteForm({ ...inviteForm, prenom: e.target.value })} required style={{ width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} /></div>
                    <div><label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Nom</label><input value={inviteForm.nom} onChange={(e) => setInviteForm({ ...inviteForm, nom: e.target.value })} required style={{ width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} /></div>
                  </div>
                  <div><label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Courriel</label><input type="email" value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} required style={{ width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }} /></div>
                  <div><label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Rôle</label><select value={inviteForm.role} onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as Role })} style={{ width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px' }}><option value="ADMIN">Admin</option><option value="COMPTABILITE">Comptabilité</option><option value="VENDEUR">Vendeur</option><option value="CHARGE_PROJET">Chargé de projet</option><option value="DEVELOPPEUR">Développeur</option></select></div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="submit" disabled={saving} style={{ flex: 1, padding: '10px', background: '#ea1c24', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}>{saving ? 'Invitation...' : 'Inviter'}</button>
                    <button type="button" onClick={() => setInviteOpen(false)} style={{ flex: 1, padding: '10px', background: '#E5E7EB', color: '#374151', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Annuler</button>
                  </div>
                </form>
              </div>
            </div>
          )}

            <div style={{ border: '1px solid #E5E7EB', borderRadius: '6px', overflow: 'hidden', marginTop: '12px' }}>
              {users.map((user, i) => (
                <div key={user.id} style={{ display: 'grid', gridTemplateColumns: '1fr 150px 100px 80px', alignItems: 'center', gap: '12px', padding: '12px 14px', borderBottom: i < users.length - 1 ? '1px solid #E5E7EB' : 'none', background: i % 2 === 0 ? 'white' : '#F9FAFB' }}>
                  <div><p style={{ fontSize: '13px', fontWeight: 500 }}>{user.prenom} {user.nom}</p><p style={{ fontSize: '11px', color: '#6B7280' }}>{user.email}</p></div>
                  <select value={user.role} onChange={(e) => handleChangeRole(user.id, e.target.value as Role)} style={{ fontSize: '11px', padding: '4px 6px', borderRadius: '4px', border: '1px solid #E5E7EB', color: roleColor(user.role), fontWeight: 500, cursor: 'pointer', background: 'white' }}>
                    {(['ADMIN', 'COMPTABILITE', 'VENDEUR', 'CHARGE_PROJET', 'DEVELOPPEUR'] as Role[]).map(r => (
                      <option key={r} value={r}>{roleLabel(r)}</option>
                    ))}
                  </select>
                  <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: user.actif ? '#EAF3DE' : '#FCEBEB', color: user.actif ? '#3B6D11' : '#A32D2D', fontWeight: 500, textAlign: 'center' }}>{user.actif ? 'Actif' : 'Inactif'}</span>
                  <button onClick={() => handleToggleUser(user.id, user.actif)} style={{ padding: '6px 10px', background: user.actif ? '#FCEBEB' : '#EAF3DE', color: user.actif ? '#A32D2D' : '#3B6D11', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 500, cursor: 'pointer' }}>{user.actif ? 'Désactiver' : 'Activer'}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'acces' && (currentUser?.role === 'ADMIN' || currentUser?.role === 'DEVELOPPEUR') && (
        <div>
          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', background: 'var(--surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Accès par rôle</h2>
              <button onClick={handleSaveAccess} disabled={saving} style={{ padding: '10px 16px', background: 'var(--dg-red)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</button>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Admin et Développeur ont l'accès total (non configurable). Un changement prend effet au prochain chargement de page de l'utilisateur visé.
            </p>
            <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-subtle)' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>Rôle</th>
                    {CAPS.map(c => (
                      <th key={c.key} style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>{c.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CONFIG_ROLES.map((role, i) => (
                    <tr key={role} style={{ borderBottom: '1px solid var(--divider)' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 500, color: 'var(--text-primary)' }}>{roleLabel(role)}</td>
                      {CAPS.map(c => (
                        <td key={c.key} style={{ padding: '10px 14px', textAlign: 'center' }}>
                          <input type="checkbox" checked={!!accessPerms[role]?.[c.key]} onChange={() => toggleAccessCap(role, c.key)} style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--dg-red)' }} />
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr style={{ background: 'var(--surface-subtle)' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 500, color: 'var(--text-tertiary)' }}>Admin · Développeur</td>
                    <td colSpan={CAPS.length} style={{ padding: '10px 14px', textAlign: 'center', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Accès total (verrouillé)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
