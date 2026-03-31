import { getSessionUser } from '@/lib/infrastructure/auth/nextauth-session-utils';
import { Role } from '@/lib/core/entity/auth-models';
import { redirect } from 'next/navigation';
import { ApproveRuleClient } from './ApproveRuleClient';

export default async function Page() {
    const user = await getSessionUser();

    if (!user || !user.isLoggedIn) {
        redirect('/');
    }

    // Only global admins may access the approval queue page.
    // We check the session role directly rather than mutating the shared
    // module-level permix singleton, which would create a race condition
    // across concurrent server requests.
    if (user.role !== Role.ADMIN) {
        redirect('/');
    }

    return (
        <main className="min-h-screen bg-neutral-0 dark:bg-neutral-900 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                <ApproveRuleClient />
            </div>
        </main>
    );
}

export const metadata = {
    title: 'Approve Rules - Rucio',
};
