import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Admin hardcoded check
    if (email === 'admin' && password === 'vip@2026') {
      const token = await signToken({ id: 0, email: 'admin', role: 'admin', name: 'Admin' });
      const res = NextResponse.json({ success: true, role: 'admin' });
      res.cookies.set('vip_token', token, {
        httpOnly: true, secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/'
      });
      return res;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.active) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signToken({ id: user.id, email: user.email, role: user.role, name: user.name, dealerId: user.dealerId });
    const res = NextResponse.json({ success: true, role: user.role });
    res.cookies.set('vip_token', token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/'
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
