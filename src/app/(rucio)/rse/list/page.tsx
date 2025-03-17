import { ListRSE } from '@/component-library/pages/RSE/list/ListRSE';

export default async function Page(
    props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }
) {
    const searchParams = await props.searchParams;
    let firstExpression: string | undefined = undefined;
    const searchExpression = searchParams?.['expression'];

    if (typeof searchExpression === 'string') {
        firstExpression = searchExpression;
    }
    // TODO: fetch initial data

    return <ListRSE initialExpression={firstExpression ?? undefined} />;
}

export const metadata = {
    title: 'RSEs List - Rucio'
};
