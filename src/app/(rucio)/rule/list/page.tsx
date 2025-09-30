import { ListRule } from '@/component-library/pages/Rule/list/ListRule';

export default function Page({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
    const autoSearch = searchParams?.['autoSearch'] === 'true';

    // Extract search filter parameters
    const initialFilters = {
        account: typeof searchParams?.['account'] === 'string' ? searchParams['account'] : '',
        scope: typeof searchParams?.['scope'] === 'string' ? searchParams['scope'] : '*',
        name: typeof searchParams?.['name'] === 'string' ? searchParams['name'] : '',
        activity: typeof searchParams?.['activity'] === 'string' ? searchParams['activity'] : '',
        state: typeof searchParams?.['state'] === 'string' ? searchParams['state'] as any : undefined,
    };

    return <ListRule autoSearch={autoSearch} initialFilters={initialFilters} />;
}

export const metadata = {
    title: 'Rules List - Rucio',
};
