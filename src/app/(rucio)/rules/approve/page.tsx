import { getSessionUser } from '@/lib/infrastructure/auth/nextauth-session-utils';
import { Role } from '@/lib/core/entity/auth-models';
import { redirect } from 'next/navigation';
import { ApproveRuleClient } from './ApproveRuleClient';
import { requireFeature } from '@/lib/infrastructure/feature-flags/require-feature';

export default async function Page({ searchParams }: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
    await requireFeature('rules.approve');
    const user = await getSessionUser();

    if (!user || !user.isLoggedIn) {
        redirect('/');
    }

    // Only global admins may access the approve rules page.
    if (user.role !== Role.ADMIN) {
        redirect('/');
    }

    const params = await searchParams;
    const autoSearch = params?.['autoSearch'] === 'true';

    const parseDate = (dateStr: string | string[] | undefined): Date | undefined => {
        if (typeof dateStr !== 'string') return undefined;
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? undefined : date;
    };

    const initialFilters = {
        account: typeof params?.['account'] === 'string' ? params['account'] : '',
        activity: typeof params?.['activity'] === 'string' ? params['activity'] : '',
        scope: typeof params?.['scope'] === 'string' ? params['scope'] : '*',
        name: typeof params?.['name'] === 'string' ? params['name'] : '',
        updatedBefore: parseDate(params?.['updated_before']),
        updatedAfter: parseDate(params?.['updated_after']),
    };

    return (
        <main className="min-h-screen bg-neutral-0 dark:bg-neutral-900 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                <header className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Approve Rules</h1>
                    <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
                        Review and approve or deny replication rules that are waiting for administrator approval.
                    </p>
                </header>
                <section aria-label="Rules Pending Approval">
                    <ApproveRuleClient autoSearch={autoSearch} initialFilters={initialFilters} />
                </section>
            </div>
        </main>
    );
}

export const metadata = {
    title: 'Approve Rules - Rucio',
};
