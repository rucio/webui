import { ListRSE } from '@/component-library/pages/RSE/list/ListRSE';

export default function Page({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
    let firstExpression: string | undefined = undefined;
    const searchExpression = searchParams?.['expression'];
    const autoSearch = searchParams?.['autoSearch'] === 'true';

    if (typeof searchExpression === 'string') {
        firstExpression = searchExpression;
    }
    // TODO: fetch initial data

    return <ListRSE initialExpression={firstExpression ?? undefined} autoSearch={autoSearch} />;
}

export const metadata = {
    title: 'RSEs List - Rucio',
};
