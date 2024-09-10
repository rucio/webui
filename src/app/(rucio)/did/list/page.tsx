'use client';

import { ListDID } from '@/component-library/Pages/DID/List/ListDID';
import { didMetaQueryBase } from '../queries';
import { useSearchParams } from 'next/navigation';

export default function Page() {
    const searchParams = useSearchParams();
    const firstPattern = searchParams?.get('pattern');

    // TODO: fetch initial data

    return <ListDID queryMeta={didMetaQueryBase} firstPattern={firstPattern ?? undefined} />;
}
