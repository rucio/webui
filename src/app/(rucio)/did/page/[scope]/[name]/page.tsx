'use client';

import { DetailsDID } from '@/component-library/pages/DID/details/DetailsDID';
import { useEffect, use } from 'react';

export default function Page(props: { params: Promise<{ scope: string; name: string }> }) {
    const params = use(props.params);
    const decodedScope = decodeURIComponent(params.scope);
    const decodedName = decodeURIComponent(params.name);

    useEffect(() => {
        document.title = `${decodedScope}:${decodedName} - Rucio`;
    }, []);

    return <DetailsDID scope={decodedScope} name={decodedName} />;
}
