'use client';

import { DetailsRule } from '@/component-library/pages/Rule/details/DetailsRule';
import { use, useEffect } from 'react';

export default function PageRule({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    useEffect(() => {
        document.title = 'Rule - Rucio';
    }, []);

    return <DetailsRule id={id} />;
}
