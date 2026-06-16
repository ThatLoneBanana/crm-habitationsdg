'use client'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, Building2, Map, Users, Truck, Clock, BarChart3, Settings, LogOut } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/projets', label: 'Projets', Icon: Building2, showCount: true },
  { href: '/map', label: 'Carte', Icon: Map },
  { href: '/clients', label: 'Clients', Icon: Users },
  { href: '/fournisseurs', label: 'Fournisseurs', Icon: Truck },
  { href: '/costing', label: 'Costing', Icon: BarChart3 },
  { href: '/feuilles-de-temps', label: 'Feuilles de temps', Icon: Clock },
]

export default function Sidebar({ projetsCount, userPrenom, userEmail, estAdminOuDev }: {
  projetsCount?: number
  userPrenom?: string
  userEmail?: string
  estAdminOuDev?: boolean
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [logoutHover, setLogoutHover] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Initiales pour l'avatar
  const initiales = userPrenom
    ? userPrenom.slice(0, 1).toUpperCase()
    : userEmail?.slice(0, 1).toUpperCase() || 'U'

  return (
    <div style={{
      width: '200px',
      minWidth: '200px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'white',
      borderRight: '1px solid #E5E7EB',
      position: 'sticky',
      top: 0,
    }}>

      {/* LOGO EN HAUT */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #F3F4F6' }}>
        <img
          src='/habitationsdg.svg'
          alt='Habitations DG'
          style={{ width: '140px', display: 'block', cursor: 'pointer' }}
          onClick={() => router.push('/')}
        />
      </div>

      {/* NAVIGATION — prend tout l'espace disponible */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
        {navItems.map(item => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href)
          const IconComponent = item.Icon
          return (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: isActive ? 500 : 400,
                color: isActive ? '#ea1c24' : '#374151',
                background: isActive ? '#fff0f0' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.1s',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#ffe8e8' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              <IconComponent size={18} style={{ flexShrink: 0, color: isActive ? '#ea1c24' : '#6B7280' }} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.showCount && projetsCount ? (
                <span style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  padding: '1px 6px',
                  borderRadius: '10px',
                  background: isActive ? '#ea1c24' : '#E5E7EB',
                  color: isActive ? 'white' : '#6B7280',
                }}>
                  {projetsCount}
                </span>
              ) : null}
            </a>
          )
        })}
      </nav>

      {/* JOURNAL + PARAMÈTRES */}
      <div style={{ padding: '8px', borderTop: '1px solid #F3F4F6' }}>
        {/* Journal d'activité — visible ADMIN/DEV seulement */}
        {estAdminOuDev && (
          <a
            href='/parametres/logs'
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              borderRadius: '6px',
              fontSize: '13px',
              color: pathname.startsWith('/parametres/logs') ? '#ea1c24' : '#374151',
              background: pathname.startsWith('/parametres/logs') ? '#fff0f0' : 'transparent',
              textDecoration: 'none',
              marginBottom: '2px',
            }}
            onMouseEnter={e => e.currentTarget.style.background = pathname.startsWith('/parametres/logs') ? '#fff0f0' : '#ffe8e8'}
            onMouseLeave={e => e.currentTarget.style.background = pathname.startsWith('/parametres/logs') ? '#fff0f0' : 'transparent'}
          >
            <i className='ti ti-history' style={{ fontSize: '16px', color: pathname.startsWith('/parametres/logs') ? '#ea1c24' : '#6B7280', flexShrink: 0 }} />
            <span>Journal d'activité</span>
          </a>
        )}

        {/* Paramètres */}
        <a
          href='/parametres'
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            color: pathname === '/parametres' ? '#ea1c24' : '#374151',
            background: pathname === '/parametres' ? '#fff0f0' : 'transparent',
            textDecoration: 'none',
          }}
          onMouseEnter={e => e.currentTarget.style.background = pathname === '/parametres' ? '#fff0f0' : '#ffe8e8'}
          onMouseLeave={e => e.currentTarget.style.background = pathname === '/parametres' ? '#fff0f0' : 'transparent'}
        >
          <Settings size={18} style={{ color: pathname === '/parametres' ? '#ea1c24' : '#6B7280' }} />
          <span>Paramètres</span>
        </a>
      </div>

      {/* AVATAR + NOM + SIGNOUT EN BAS */}
      <div style={{
        padding: '12px 12px',
        borderTop: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        {/* Avatar initiales */}
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: '#1D9E75',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 600,
          flexShrink: 0,
        }}>
          {initiales}
        </div>
        {/* Nom + email */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '12px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {userPrenom || userEmail?.split('@')[0] || 'Utilisateur'}
          </div>
          <div style={{ fontSize: '10px', color: '#9CA3AF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {userEmail}
          </div>
        </div>
        {/* Bouton signout */}
        <button
          onClick={handleSignOut}
          title='Se déconnecter'
          style={{
            width: '28px',
            height: '28px',
            border: `1px solid ${logoutHover ? '#FCA5A5' : '#E5E7EB'}`,
            borderRadius: '6px',
            background: logoutHover ? '#FEF2F2' : 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.15s',
          }}
          onMouseEnter={() => setLogoutHover(true)}
          onMouseLeave={() => setLogoutHover(false)}
        >
          <LogOut size={18} color={logoutHover ? '#ea1c24' : '#6B7280'} strokeWidth={2.5} />
        </button>
      </div>

    </div>
  )
}
