import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'lector_staging_access';
const COOKIE_VALUE = 'lector_auth_granted_v1';

// Public paths that don't require the password gate
const PUBLIC_PATHS = [
  '/gate',
  '/api/gate',
  '/favicon.ico',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow internal Next.js requests and static assets
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/static') || 
    pathname.includes('.') // matches common file extensions
  ) {
    return NextResponse.next();
  }

  // 2. Allow explicitly public paths
  if (PUBLIC_PATHS.some(path => pathname === path)) {
    return NextResponse.next();
  }

  // 3. Check for the staging access cookie
  const accessCookie = request.cookies.get(COOKIE_NAME);

  if (accessCookie?.value === COOKIE_VALUE) {
    // If the user is on the gate page but already has access, redirect to home
    if (pathname === '/gate') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // 4. Redirect to the gate page if no valid access cookie
  const url = new URL('/gate', request.url);
  url.searchParams.set('returnUrl', pathname);
  
  return NextResponse.redirect(url);
}

// Config to limit middleware to specific routes if needed, 
// but here we want it global for all non-static paths.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) -> we allow /api/gate manually in logic but protect others
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
