import { ListRule } from '@/component-library/pages/Rule/list/ListRule';

export default async function Page({ searchParams }: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;
    const autoSearch = params?.['autoSearch'] === 'true';

    // Extract search filter parameters
    const initialFilters = {
        account: typeof params?.['account'] === 'string' ? params['account'] : '',
        scope: typeof params?.['scope'] === 'string' ? params['scope'] : '*',
        name: typeof params?.['name'] === 'string' ? params['name'] : '',
        activity: typeof params?.['activity'] === 'string' ? params['activity'] : '',
        state: typeof params?.['state'] === 'string' ? params['state'] as any : undefined,
    };

    return <ListRule autoSearch={autoSearch} initialFilters={initialFilters} />;
}

export const metadata = {
    title: 'Rules List - Rucio',
};
