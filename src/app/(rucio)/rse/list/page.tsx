import { ListRSE } from '@/component-library/pages/RSE/list/ListRSE';

export default async function Page({ searchParams }: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
    let firstExpression: string | undefined = undefined;
    const resolvedSearchParams = await searchParams;
    const searchExpression = resolvedSearchParams?.['expression'];
    const autoSearch = resolvedSearchParams?.['autoSearch'] === 'true';

    if (typeof searchExpression === 'string') {
        firstExpression = searchExpression;
    }
    // TODO: fetch initial data

    return <ListRSE initialExpression={firstExpression ?? undefined} autoSearch={autoSearch} />;
}

export const metadata = {
    title: 'RSEs List - Rucio',
};
