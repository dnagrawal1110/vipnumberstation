import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/auth';

const PROTECTED = {
  '/admin': ['admin'],
  '/team': ['admin', 'team'],
  '/dealer-dashboard': ['admin', 'dealer'],
};

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const protectedEntry = Object.entries(PROTECTED).find(([path]) => pathname.startsWith(path));
  if (!protectedEntry) return NextResponse.next();

  const [, allowedRoles] = protectedEntry;
  const token = request.cookies.get('vip_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const payload = await verifyToken(token);
  if (!payload || !allowedRoles.includes(payload.role)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/team/:path*', '/dealer-dashboard/:path*'],
};
