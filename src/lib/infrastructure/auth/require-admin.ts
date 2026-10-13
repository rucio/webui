import 'server-only';
import { redirect } from 'next/navigation';
import { getSessionUser } from './nextauth-session-utils';
import { Role, SessionUser } from '@/lib/core/entity/auth-models';

export async function requireAdmin(): Promise<SessionUser> {
    const user = await getSessionUser();
    if (!user || !user.isLoggedIn || user.role !== Role.ADMIN) redirect('/');
    return user;
}

export async function requireSelfOrAdmin(account: string): Promise<SessionUser> {
    const user = await getSessionUser();
    if (!user || !user.isLoggedIn) redirect('/');
    if (user.role !== Role.ADMIN && user.rucioAccount !== account) redirect(`/account/${encodeURIComponent(user.rucioAccount)}`);
    return user;
}
