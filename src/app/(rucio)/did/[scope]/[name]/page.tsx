'use client';

import { DetailsDID } from '@/component-library/pages/DID/details/DetailsDID';
import { use, useEffect } from 'react';

export default function Page({ params }: { params: Promise<{ scope: string; name: string }> }) {
    const resolvedParams = use(params);
    const decodedScope = decodeURIComponent(resolvedParams.scope);
    const decodedName = decodeURIComponent(resolvedParams.name);

    useEffect(() => {
        document.title = `${decodedScope}:${decodedName} - Rucio`;
    }, []);

    return <DetailsDID scope={decodedScope} name={decodedName} />;
}
