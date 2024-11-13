'use client';

import { DetailsDID } from '@/component-library/pages/DID/details/DetailsDID';
import {useEffect} from "react";

export default function Page({ params }: { params: { scope: string; name: string } }) {
    const decodedScope = decodeURIComponent(params.scope);
    const decodedName = decodeURIComponent(params.name);

    useEffect(() => {
        document.title = `${decodedScope}:${decodedName} - Rucio`;
    }, []);

    return <DetailsDID scope={decodedScope} name={decodedName} />;
}
