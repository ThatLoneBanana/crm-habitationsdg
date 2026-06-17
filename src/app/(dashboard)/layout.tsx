import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/layout/sidebar'
import Bottombar from '@/components/layout/bottombar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [projetsCount, userPrisma] = await Promise.all([
    prisma.projet.count({ where: { phase: { not: 'TERMINE' } } }),
    user?.email ? prisma.user.findUnique({
      where: { email: user.email },
      select: { prenom: true, nom: true, role: true }
    }) : Promise.resolve(null)
  ])

  const estAdminOuDev = ['ADMIN', 'DEVELOPPEUR'].includes(userPrisma?.role || '')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F9FAFB' }}>
      {/* Sidebar : desktop seulement (>= md). Wrapper class-gated pour ne pas
          entrer en conflit avec le display:flex inline de la sidebar. */}
      <div className="hidden md:block">
        <Sidebar
          projetsCount={projetsCount}
          userPrenom={userPrisma?.prenom}
          userEmail={user?.email}
          estAdminOuDev={estAdminOuDev}
        />
      </div>
      {/* pb-14 (= hauteur bottombar) sur mobile pour que rien ne soit caché
          derrière la barre ; aucun padding sur desktop. */}
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }} className="pb-14 md:pb-0">
        {children}
      </main>
      {/* Bottombar : mobile seulement (< md), fixée en bas. */}
      <Bottombar />
    </div>
  )
}
