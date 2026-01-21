'use client';

import { use } from 'react';
import { DetailsSubscription } from '@/component-library/pages/Subscriptions/details/DetailsSubscription';

export default function PageSubscription({ params }: { params: Promise<{ account: string; name: string }> }) {
    const { account, name } = use(params);

    return <DetailsSubscription account={account} name={name} />;
}
