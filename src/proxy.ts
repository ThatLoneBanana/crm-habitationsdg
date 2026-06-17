import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Next 16 : la convention « middleware » est renommée « proxy » (fichier proxy.ts
// + fonction proxy). Runtime Node (pas Edge). Logique d'auth : gating
// non-connecté → /login, routes publiques (/login, /p/, /api/projets-by-slug)
// exemptées.
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Routes publiques — pas de redirect
  // /api/projets-by-slug est l'API que la vue client publique (/p/) consomme :
  // elle est filtrée pour ne renvoyer que des données destinées au client.
  const isPublic = request.nextUrl.pathname.startsWith('/login') ||
                   request.nextUrl.pathname.startsWith('/p/') ||
                   request.nextUrl.pathname.startsWith('/api/projets-by-slug')

  if (!user && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|habitationsdg|leaflet|.*\\.png$|.*\\.svg$).*)'],
}
