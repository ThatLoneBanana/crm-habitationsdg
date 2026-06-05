import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Permettre l'accès à la vue client publique sans authentification
  if (request.nextUrl.pathname.startsWith('/p/')) {
    return NextResponse.next();
  }

  // Permettre l'accès à la page de login et routes auth
  if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/(auth)')) {
    return NextResponse.next();
  }

  // Permettre les assets et APIs publiques
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Vérifier les cookies Supabase (il y a plusieurs variantes possibles)
  const supabaseCookies = [
    request.cookies.get('sb-luzqndarimdwkogjurxm-auth-token'),
    request.cookies.get('sb-auth-token'),
    request.cookies.get('sb-access-token'),
  ];

  const hasAuth = supabaseCookies.some((cookie) => cookie?.value);

  // Si pas d'authentification et on accède au dashboard, rediriger vers login
  if (!hasAuth && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si pas d'auth et accès à / (dashboard), rediriger au login
  if (!hasAuth && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
