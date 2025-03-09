import { ListDID } from '@/component-library/pages/DID/list/ListDID';

export default async function Page(
    props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }
) {
    const searchParams = await props.searchParams;
    let firstPattern: string | undefined = undefined;
    const searchPattern = searchParams?.['pattern'];

    if (typeof searchPattern === 'string') {
        firstPattern = searchPattern;
    }
    // TODO: fetch initial data
    return <ListDID firstPattern={firstPattern ?? undefined} />;
}

export const metadata = {
    title: 'DIDs List - Rucio'
};
