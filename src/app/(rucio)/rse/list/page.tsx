'use client';

import { ListRSE } from '@/component-library/Pages/RSE/ListRSE';
import { RSEViewModel } from '@/lib/infrastructure/data/view-model/list-rse';
import useChunkedStream from '@/lib/infrastructure/hooks/useChunkedStream';

export default function Page() {
    const streamingHook = useChunkedStream<RSEViewModel>();
    return <ListRSE streamingHook={streamingHook} />;
}
