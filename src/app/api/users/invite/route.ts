import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiRole, ROLES_MANAGE_USERS } from '@/lib/auth-guard'

export async function POST(request: NextRequest) {
  try {
    const guard = await requireApiRole(ROLES_MANAGE_USERS)
    if (guard.response) return guard.response

    const { prenom, nom, email, role } = await request.json()

    // Validation
    if (!prenom || !nom || !email || !role) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Client admin Supabase (service role)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Crée le user dans Supabase Auth avec invitation
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { prenom, nom, role }
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    // Crée le user dans la table Prisma. Si ça échoue, on supprime le user
    // Auth pour éviter un orphelin (créé dans Supabase mais absent de Prisma).
    let user
    try {
      user = await prisma.user.create({
        data: {
          id: authUser.user.id,
          email,
          prenom,
          nom,
          role: role as any,
          actif: true,
        }
      })
    } catch (prismaError: any) {
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id).catch(() => {})
      return NextResponse.json(
        { error: 'Profil non créé (Supabase Auth annulé): ' + (prismaError.message || 'erreur Prisma') },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        prenom: user.prenom,
        nom: user.nom,
        role: user.role,
      }
    })
  } catch (error: any) {
    console.error('Erreur invitation utilisateur:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}
