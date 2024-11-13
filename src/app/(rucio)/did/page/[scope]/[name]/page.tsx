'use client';

import { DetailsDID } from '@/component-library/pages/DID/details/DetailsDID';

export default function Page({ params }: { params: { scope: string; name: string } }) {
    const decodedScope = decodeURIComponent(params.scope);
    const decodedName = decodeURIComponent(params.name);

    return <DetailsDID scope={decodedScope} name={decodedName} />;
}
