import { getSessionUser } from '@/lib/infrastructure/auth/nextauth-session-utils';
import { Role } from '@/lib/core/entity/auth-models';
import { redirect } from 'next/navigation';
import { ApproveRuleClient } from './ApproveRuleClient';

export default async function Page({ searchParams }: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
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
                <ApproveRuleClient autoSearch={autoSearch} initialFilters={initialFilters} />
            </div>
        </main>
    );
}

export const metadata = {
    title: 'Approve Rules - Rucio',
};
