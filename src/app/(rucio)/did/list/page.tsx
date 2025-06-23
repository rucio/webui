import { ListDID } from '@/component-library/pages/DID/list/ListDID';

export default function Page({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
    let firstPattern: string | undefined = undefined;
    const searchPattern = searchParams?.['pattern'];

    if (typeof searchPattern === 'string') {
        firstPattern = searchPattern;
    }else{
        // Load from environment variable if defined
        // The pattern needs to be a valid DID pattern ("scope:name", "scope:*", ...)
        firstPattern = process.env.WEBUI_LIST_DIDS_INITIAL_PATTERN;
    }
    // TODO: fetch initial data
    return <ListDID firstPattern={firstPattern ?? undefined} />;
}

export const metadata = {
    title: 'DIDs List - Rucio',
};
