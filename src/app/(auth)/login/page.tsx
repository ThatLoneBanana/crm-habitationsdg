'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

      if (signInError) {
        console.error('Erreur login:', signInError.message)
        setError(signInError.message)
        setLoading(false)
        return
      }

      console.log('✅ Connexion réussie')
      router.push('/')
      router.refresh()
    } catch (err: any) {
      console.error('Erreur:', err)
      setError(err.message || 'Erreur de connexion')
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--color-background-secondary)' }}>
      <div style={{ width: '360px', background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-lg)', padding: '32px' }}>
        <img src='/habitationsdg.svg' alt='Habitations DG' style={{ width: '120px', margin: '0 auto 24px', display: 'block' }} />

        {error && (
          <div style={{ background: '#FCEBEB', border: '0.5px solid #EAB8B4', borderRadius: 'var(--border-radius-md)', padding: '10px 12px', marginBottom: '12px', fontSize: '12px', color: '#A32D2D' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Courriel</label>
            <input
              name='email'
              type='email'
              required
              disabled={loading}
              style={{ width: '100%', padding: '8px 10px', border: '0.5px solid var(--color-border-secondary)', borderRadius: 'var(--border-radius-md)', fontSize: '13px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Mot de passe</label>
            <input
              name='password'
              type='password'
              required
              disabled={loading}
              style={{ width: '100%', padding: '8px 10px', border: '0.5px solid var(--color-border-secondary)', borderRadius: 'var(--border-radius-md)', fontSize: '13px' }}
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            style={{ width: '100%', padding: '10px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 'var(--border-radius-md)', fontSize: '13px', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
