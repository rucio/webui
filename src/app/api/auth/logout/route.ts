import { NextRequest, NextResponse } from 'next/server';
import { signOut } from '@/lib/infrastructure/auth/auth';

/**
 * API route for logging out
 * GET /api/auth/logout
 * Query params: callbackUrl (optional)
 *
 * Note: With NextAuth, logout is typically handled via signOut()
 * This endpoint provides backward compatibility
 */
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const callbackUrl = searchParams.get('callbackUrl') || '/auth/login';

        // NextAuth signOut will clear the session
        await signOut({ redirect: false });

        // Return JSON response or redirect
        if (callbackUrl) {
            return NextResponse.redirect(new URL(callbackUrl, req.url));
        }

        return NextResponse.json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        console.error('Error during logout:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * POST /api/auth/logout
 * Logs out from all accounts (destroys entire session)
 */
export async function POST(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const callbackUrl = searchParams.get('callbackUrl') || '/auth/login';

        // NextAuth signOut will clear the session
        await signOut({ redirect: false });

        // Return JSON response or redirect
        if (callbackUrl) {
            return NextResponse.redirect(new URL(callbackUrl, req.url));
        }

        return NextResponse.json({
            success: true,
            message: 'Logged out from all accounts!',
        });
    } catch (error) {
        console.error('Error during logout:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
