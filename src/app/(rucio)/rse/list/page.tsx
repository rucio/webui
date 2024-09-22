'use client';

import { ListRSE } from '@/component-library/pages/RSE/list/ListRSE';
import { useSearchParams } from 'next/navigation';
export default function Page() {
    const searchParams = useSearchParams();
    const firstExpression = searchParams?.get('expression');

    // TODO: fetch initial data

    return <ListRSE initialExpression={firstExpression ?? undefined} />;
}
