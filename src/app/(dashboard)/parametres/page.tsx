'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PageHeader, Card, CardHeader, Field, Input, Select, Button, Badge, Banner, dgTH, dgTD } from '@/components/dg'

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

  // Onglet stylé DG : soulignement actif rouge, tokens réels (corrige le --color-* cassé).
  const TabBtn = ({ id, label }: { id: 'general' | 'compte' | 'utilisateurs' | 'acces'; label: string }) => {
    const active = activeTab === id
    return (
      <button onClick={() => setActiveTab(id)} style={{ padding: '10px 14px', fontSize: 13, fontWeight: active ? 600 : 500, background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: -1, borderBottom: active ? '2px solid var(--dg-red)' : '2px solid transparent', color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{label}</button>
    )
  }
  const estAdminDev = currentUser?.role === 'ADMIN' || currentUser?.role === 'DEVELOPPEUR'

  return (
    <div style={{ padding: '22px 24px 40px' }}>
      <PageHeader title="Paramètres" />

      <div style={{ display: 'flex', gap: 2, marginBottom: 24, borderBottom: '1px solid var(--border)' }}>
        {estAdminOuComptabilite && <TabBtn id="general" label="Général" />}
        <TabBtn id="compte" label="Mon compte" />
        {estAdminDev && <TabBtn id="utilisateurs" label="Utilisateurs" />}
        {estAdminDev && <TabBtn id="acces" label="Accès" />}
        {/* Lien vers l'éditeur de cédules types (page dédiée, ADMIN/DEV) */}
        {estAdminDev && (
          <a href="/parametres/templates" style={{ padding: '10px 14px', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', textDecoration: 'none', borderBottom: '2px solid transparent', marginBottom: -1 }}>Cédules types</a>
        )}
      </div>

      {error && <Banner tone="danger">{error}</Banner>}
      {success && <Banner tone="success">{success}</Banner>}

      {activeTab === 'general' && (
        <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {estAdminDev && (
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: 16 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Journal d'activité</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Historique complet des actions dans l'application.</div>
                </div>
                <a href='/parametres/logs' style={{ textDecoration: 'none' }}>
                  <Button variant="outline"><i className="ti ti-history" aria-hidden="true" />Ouvrir</Button>
                </a>
              </div>
            </Card>
          )}
          <Card>
            <CardHeader title="Paramètres généraux" />
            <div style={{ padding: 16, display: 'grid', gap: 16 }}>
              <Field label="Nom de la compagnie"><Input value={parametres.nomCompagnie} onChange={(e) => setParametres({ ...parametres, nomCompagnie: e.target.value })} /></Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="RBQ"><Input value={parametres.rbq} onChange={(e) => setParametres({ ...parametres, rbq: e.target.value })} /></Field>
                <Field label="Courriel"><Input type="email" value={parametres.email} onChange={(e) => setParametres({ ...parametres, email: e.target.value })} /></Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Téléphone"><Input type="tel" value={parametres.telephone} onChange={(e) => setParametres({ ...parametres, telephone: e.target.value })} /></Field>
                <Field label="Site web"><Input value={parametres.siteWeb} onChange={(e) => setParametres({ ...parametres, siteWeb: e.target.value })} /></Field>
              </div>
              <Field label="Max heures par semaine"><Input type="number" step="0.5" value={parametres.maxHeuresParSemaine} onChange={(e) => setParametres({ ...parametres, maxHeuresParSemaine: parseFloat(e.target.value) })} /></Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Marge initiale de cédule (jours ouvrables)"><Input type="number" min="0" step="1" value={parametres.margeCeduleJours} onChange={(e) => setParametres({ ...parametres, margeCeduleJours: parseInt(e.target.value, 10) || 0 })} /></Field>
                <Field label="Tolérance de décalage par défaut (jours)"><Input type="number" min="0" step="1" value={parametres.toleranceDefautJours} onChange={(e) => setParametres({ ...parametres, toleranceDefautJours: parseInt(e.target.value, 10) || 0 })} /></Field>
              </div>
              <Button onClick={handleSaveParametres} disabled={saving} style={{ width: 'fit-content' }}>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</Button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'compte' && currentUser && (
        <div style={{ maxWidth: 640 }}>
          <Card>
            <CardHeader title="Mon compte" />
            <div style={{ padding: 16, display: 'grid', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Prénom"><Input value={editUser.prenom} onChange={(e) => setEditUser({ ...editUser, prenom: e.target.value })} /></Field>
                <Field label="Nom"><Input value={editUser.nom} onChange={(e) => setEditUser({ ...editUser, nom: e.target.value })} /></Field>
              </div>
              <Field label="Courriel"><Input type="email" value={currentUser.email} disabled /></Field>
              <Button onClick={handleSaveUser} disabled={saving} style={{ width: 'fit-content' }}>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</Button>
              <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Changer le mot de passe</div>
              <form onSubmit={handleChangePassword} style={{ display: 'grid', gap: 12 }}>
                <Field label="Nouveau mot de passe"><Input type="password" value={passwordForm.nouveau} onChange={(e) => setPasswordForm({ ...passwordForm, nouveau: e.target.value })} required /></Field>
                <Field label="Confirmer le mot de passe"><Input type="password" value={passwordForm.confirmer} onChange={(e) => setPasswordForm({ ...passwordForm, confirmer: e.target.value })} required /></Field>
                <Button type="submit" disabled={saving || !passwordForm.nouveau} style={{ width: 'fit-content' }}>{saving ? 'Mise à jour...' : 'Sauvegarder'}</Button>
              </form>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'utilisateurs' && estAdminDev && (
        <Card>
          <CardHeader title={`Utilisateurs (${users.length})`} action={<Button onClick={() => setInviteOpen(true)} style={{ padding: '6px 12px', fontSize: 12 }}><i className="ti ti-plus" aria-hidden="true" />Inviter</Button>} />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)' }}>
                <th style={dgTH}>Utilisateur</th>
                <th style={dgTH}>Rôle</th>
                <th style={{ ...dgTH, textAlign: 'center' }}>Statut</th>
                <th style={{ ...dgTH, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user.id} style={{ borderBottom: i < users.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                  <td style={dgTD}>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{user.prenom} {user.nom}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{user.email}</div>
                  </td>
                  <td style={dgTD}>
                    <Select value={user.role} onChange={(e) => handleChangeRole(user.id, e.target.value as Role)} style={{ width: 'auto', fontSize: 12, padding: '5px 8px', color: roleColor(user.role), fontWeight: 600 }}>
                      {(['ADMIN', 'COMPTABILITE', 'VENDEUR', 'CHARGE_PROJET', 'DEVELOPPEUR'] as Role[]).map(r => (
                        <option key={r} value={r}>{roleLabel(r)}</option>
                      ))}
                    </Select>
                  </td>
                  <td style={{ ...dgTD, textAlign: 'center' }}><Badge tone={user.actif ? 'success' : 'danger'}>{user.actif ? 'Actif' : 'Inactif'}</Badge></td>
                  <td style={{ ...dgTD, textAlign: 'right' }}>
                    <Button variant={user.actif ? 'danger' : 'outline'} onClick={() => handleToggleUser(user.id, user.actif)} style={{ fontSize: 12, padding: '6px 10px' }}>{user.actif ? 'Désactiver' : 'Activer'}</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {inviteOpen && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }} onClick={() => setInviteOpen(false)}>
              <div onClick={(e) => e.stopPropagation()} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: 24, width: '100%', maxWidth: 420, boxShadow: 'var(--shadow-lg)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Inviter un utilisateur</h3>
                <form onSubmit={handleInvite} style={{ display: 'grid', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Field label="Prénom"><Input value={inviteForm.prenom} onChange={(e) => setInviteForm({ ...inviteForm, prenom: e.target.value })} required /></Field>
                    <Field label="Nom"><Input value={inviteForm.nom} onChange={(e) => setInviteForm({ ...inviteForm, nom: e.target.value })} required /></Field>
                  </div>
                  <Field label="Courriel"><Input type="email" value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} required /></Field>
                  <Field label="Rôle">
                    <Select value={inviteForm.role} onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as Role })}>
                      <option value="ADMIN">Admin</option><option value="COMPTABILITE">Comptabilité</option><option value="VENDEUR">Vendeur</option><option value="CHARGE_PROJET">Chargé de projet</option><option value="DEVELOPPEUR">Développeur</option>
                    </Select>
                  </Field>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <Button type="submit" disabled={saving} style={{ flex: 1 }}>{saving ? 'Invitation...' : 'Inviter'}</Button>
                    <Button type="button" variant="outline" onClick={() => setInviteOpen(false)} style={{ flex: 1 }}>Annuler</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </Card>
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
