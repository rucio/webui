'use client';

import { ListSubscription } from '@/component-library/pages/Subscription/list/ListSubscription';

export default function Page({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
    return <ListSubscription />;
}
