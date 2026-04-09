import { NextRequest, NextResponse } from 'next/server';

const STAGING_PASSWORD = '210479';
const COOKIE_NAME = 'lector_staging_access';
const COOKIE_VALUE = 'lector_auth_granted_v1';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (password === STAGING_PASSWORD) {
      const response = NextResponse.json({ success: true, message: 'Access granted' });
      
      // Set HttpOnly, secure cookie for 30 days
      response.cookies.set({
        name: COOKIE_NAME,
        value: COOKIE_VALUE,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
  } catch (error) {
    console.error('API Gate Error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
