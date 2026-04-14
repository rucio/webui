import { ListRuleClient } from './ListRuleClient';
import { RuleState } from '@/lib/core/entity/rucio';

export default async function Page({ searchParams }: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;
    const autoSearch = params?.['autoSearch'] === 'true';

    // Parse date parameters
    const parseDate = (dateStr: string | string[] | undefined): Date | undefined => {
        if (typeof dateStr !== 'string') return undefined;
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? undefined : date;
    };

    // Parse RuleState parameter
    const parseRuleState = (stateStr: string | string[] | undefined): RuleState | undefined => {
        if (typeof stateStr !== 'string') return undefined;
        // Check if the string is a valid RuleState enum value
        return Object.values(RuleState).includes(stateStr as RuleState) ? (stateStr as RuleState) : undefined;
    };

    // Extract search filter parameters
    const initialFilters = {
        account: typeof params?.['account'] === 'string' ? params['account'] : '',
        scope: typeof params?.['scope'] === 'string' ? params['scope'] : '*',
        name: typeof params?.['name'] === 'string' ? params['name'] : '',
        activity: typeof params?.['activity'] === 'string' ? params['activity'] : '',
        state: parseRuleState(params?.['state']),
        updatedBefore: parseDate(params?.['updated_before']),
        updatedAfter: parseDate(params?.['updated_after']),
    };

    return (
        <main className="min-h-screen bg-neutral-0 dark:bg-neutral-900 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                <header className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Rules</h1>
                    <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">Search and manage data replication rules</p>
                </header>
                <section aria-label="Rule Search and Results">
                    <ListRuleClient autoSearch={autoSearch} initialFilters={initialFilters} />
                </section>
            </div>
        </main>
    );
}

export const metadata = {
    title: 'Rules List - Rucio',
};
