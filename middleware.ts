import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Tillåt login-sidan och API-routes
  if (
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/sw.js') ||
    request.nextUrl.pathname.startsWith('/manifest.json') ||
    request.nextUrl.pathname.startsWith('/icon')
  ) {
    return NextResponse.next();
  }

  // Kontrollera autentisering
  const isAuthenticated = request.cookies.get('authenticated')?.value === 'true';

  if (!isAuthenticated) {
    // Omdirigera till login-sidan
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
