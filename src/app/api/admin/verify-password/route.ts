import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    // Check password against server-side environment variable
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_PASSWORD) {
      console.error('❌ ADMIN_PASSWORD not configured in environment variables');
      return NextResponse.json(
        { error: 'Admin authentication not configured' },
        { status: 500 }
      );
    }

    if (password === ADMIN_PASSWORD) {
      console.log('✅ Admin authentication successful');
      return NextResponse.json({
        success: true,
        authenticated: true
      });
    } else {
      console.log('❌ Admin authentication failed - invalid password');
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: 'Invalid password'
      }, { status: 401 });
    }

  } catch (error) {
    console.error('❌ Error verifying admin password:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
