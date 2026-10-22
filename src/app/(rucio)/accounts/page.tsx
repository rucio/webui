import { requireFeature } from '@/lib/infrastructure/feature-flags/require-feature';
import { requireAdmin } from '@/lib/infrastructure/auth/require-admin';
import { ListAccounts } from '@/component-library/pages/Account/list/ListAccounts';

export default async function Page() {
    await requireFeature('accounts');
    await requireAdmin();
    return (
        <main className="min-h-screen bg-neutral-0 dark:bg-neutral-900 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                {/* The header lives in ListAccounts so the Create account button can sit next to the title. */}
                <ListAccounts />
            </div>
        </main>
    );
}

export const metadata = { title: 'Accounts - Rucio' };
