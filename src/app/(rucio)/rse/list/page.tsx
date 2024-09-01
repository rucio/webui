'use client';

import { ListRSE } from '@/component-library/Pages/RSE/List/ListRSE';
import { useSearchParams } from 'next/navigation';
export default function Page() {
    const searchParams = useSearchParams();
    const firstExpression = searchParams?.get('expression');

    // TODO: fetch initial data

    return <ListRSE firstExpression={firstExpression ?? undefined} />;
}
