import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/layout/Sidebar'

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
      <Sidebar
        projetsCount={projetsCount}
        userPrenom={userPrisma?.prenom}
        userEmail={user?.email}
        estAdminOuDev={estAdminOuDev}
      />
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}
