import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Read role from cookie
  const roleCookie = request.cookies.get('userRole');
  const role = roleCookie?.value || 'SUPERADMIN'; // Default role if no cookie set yet

  const { pathname } = request.nextUrl;

  // Strict role-based protection. If unauthorized, redirect to '/' (public page)
  // Redirecting to '/' prevents any potential infinite redirect loops.
  if (pathname.startsWith('/superadmin') && role !== 'SUPERADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname.startsWith('/dosen') && role !== 'DOSEN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname.startsWith('/auditor') && role !== 'AUDITOR') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/superadmin/:path*', '/admin/:path*', '/dosen/:path*', '/auditor/:path*'],
};
