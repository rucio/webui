'use client';

import { ListDID } from '@/component-library/Pages/DID/ListDID';
import { DIDViewModel } from '@/lib/infrastructure/data/view-model/did';
import { didMetaQueryBase } from '../queries';
import useChunkedStream from '@/lib/infrastructure/hooks/useChunkedStream';

export default function Page() {
    const streamingHook = useChunkedStream<DIDViewModel>();

    return <ListDID streamingHook={streamingHook} queryMeta={didMetaQueryBase} />;
}
