'use client';

import { ListRSE } from '@/component-library/Pages/RSE/ListRSE';
import { RSEViewModel } from '@/lib/infrastructure/data/view-model/list-rse';
import useChunkedStream from '@/lib/infrastructure/hooks/useChunkedStream';
import { useSearchParams } from 'next/navigation';

export default function Page() {
    const searchParams = useSearchParams();
    const firstExpression = searchParams?.get('expression');

    // TODO: fetch initial data

    return <ListRSE firstExpression={firstExpression ?? undefined} />;
}
