'use client';

import { ListDID } from '@/component-library/pages/DID/list/ListDID';
import { didMetaQueryBase } from '../queries';
import { useSearchParams } from 'next/navigation';

export default function Page() {
    const searchParams = useSearchParams();
    const firstPattern = searchParams?.get('pattern');

    // TODO: fetch initial data

    return <ListDID firstPattern={firstPattern ?? undefined} />;
}
