'use client';

import { ListDID } from '@/component-library/pages/DID/list/ListDID';
import { DIDSearchParams } from '@/component-library/features/search/DIDSearchPanel';
import { DIDType } from '@/lib/core/entity/rucio';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export interface ListDIDClientProps {
    firstPattern?: string;
    autoSearch?: boolean;
    initialType?: DIDType;
}

export const ListDIDClient = (props: ListDIDClientProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleSearchStart = useCallback(
        (params: DIDSearchParams) => {
            // Build URL query parameters from search params
            const urlParams = new URLSearchParams();

            // Add autoSearch=true so the search executes when the URL is visited
            urlParams.set('autoSearch', 'true');

            // Add all filter values (as per user requirement)
            urlParams.set('type', params.type);
            urlParams.set('scope', params.scope);
            urlParams.set('name', params.name);

            if (params.limit) {
                urlParams.set('limit', params.limit);
            }

            if (params.createdDate && params.createdMode) {
                urlParams.set('created_mode', params.createdMode);
                // Format date as YYYY-MM-DD
                const year = params.createdDate.getFullYear();
                const month = String(params.createdDate.getMonth() + 1).padStart(2, '0');
                const day = String(params.createdDate.getDate()).padStart(2, '0');
                urlParams.set('created_date', `${year}-${month}-${day}`);

                if (params.createdTime) {
                    urlParams.set('created_time', params.createdTime);
                }
            }

            if (params.lengthValue && params.lengthOperator) {
                urlParams.set('length_operator', params.lengthOperator);
                urlParams.set('length_value', params.lengthValue);
            }

            // Update the URL using router.push (adds to history)
            const newUrl = `${pathname}?${urlParams.toString()}`;
            router.push(newUrl);
        },
        [router, pathname],
    );

    return (
        <ListDID firstPattern={props.firstPattern} autoSearch={props.autoSearch} initialType={props.initialType} onSearchStart={handleSearchStart} />
    );
};
