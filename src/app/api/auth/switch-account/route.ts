import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/infrastructure/auth/auth';

/**
 * API route for switching between authenticated accounts
 * POST /api/auth/switch-account
 * Body: { account: string }
 */
export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session?.allUsers || session.allUsers.length === 0) {
            return NextResponse.json({ error: 'No authentications found' }, { status: 400 });
        }

        const { account } = await req.json();

        if (!account) {
            return NextResponse.json({ error: 'Account is not specified' }, { status: 400 });
        }

        const userIdx = session.allUsers.findIndex(user => user.rucioAccount === account);

        if (userIdx === -1) {
            return NextResponse.json({ error: 'No authentication found for the specified account' }, { status: 400 });
        }

        // Return success - the actual switching will happen via session.update()
        // on the client side
        return NextResponse.json({ success: true, account });
    } catch (error) {
        console.error('Error switching account:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
