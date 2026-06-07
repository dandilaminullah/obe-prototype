import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Read role from cookie
  const roleCookie = request.cookies.get('userRole');
  const role = roleCookie?.value || 'ADMIN'; // Default to ADMIN if no cookie

  const { pathname } = request.nextUrl;

  // Basic role-based routing
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
  matcher: ['/admin/:path*', '/dosen/:path*', '/auditor/:path*'],
};
