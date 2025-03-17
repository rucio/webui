'use client';

import { DetailsRule } from '@/component-library/pages/Rule/details/DetailsRule';
import { useEffect, use } from 'react';

export default function PageRule(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);
    useEffect(() => {
        document.title = 'Rule - Rucio';
    }, []);

    return <DetailsRule id={params.id} />;
}
