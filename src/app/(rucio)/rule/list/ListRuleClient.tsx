'use client';

import { ListRule, SearchFilters } from '@/component-library/pages/Rule/list/ListRule';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export interface ListRuleClientProps {
    autoSearch?: boolean;
    initialFilters?: Partial<SearchFilters>;
}

export const ListRuleClient = (props: ListRuleClientProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleSearchStart = useCallback(
        (filters: SearchFilters) => {
            // Build URL query parameters from search filters
            const urlParams = new URLSearchParams();

            // Add autoSearch=true so the search executes when the URL is visited
            urlParams.set('autoSearch', 'true');

            // Add all filter values (as per user requirement)
            if (filters.account) {
                urlParams.set('account', filters.account);
            }

            if (filters.scope) {
                urlParams.set('scope', filters.scope);
            }

            if (filters.name) {
                urlParams.set('name', filters.name);
            }

            if (filters.activity) {
                urlParams.set('activity', filters.activity);
            }

            if (filters.state) {
                urlParams.set('state', filters.state);
            }

            if (filters.updatedBefore) {
                // Format as ISO date (YYYY-MM-DD)
                const year = filters.updatedBefore.getFullYear();
                const month = String(filters.updatedBefore.getMonth() + 1).padStart(2, '0');
                const day = String(filters.updatedBefore.getDate()).padStart(2, '0');
                urlParams.set('updated_before', `${year}-${month}-${day}`);
            }

            if (filters.updatedAfter) {
                // Format as ISO date (YYYY-MM-DD)
                const year = filters.updatedAfter.getFullYear();
                const month = String(filters.updatedAfter.getMonth() + 1).padStart(2, '0');
                const day = String(filters.updatedAfter.getDate()).padStart(2, '0');
                urlParams.set('updated_after', `${year}-${month}-${day}`);
            }

            // Update the URL using router.push (adds to history)
            const newUrl = `${pathname}?${urlParams.toString()}`;
            router.push(newUrl);
        },
        [router, pathname],
    );

    return <ListRule autoSearch={props.autoSearch} initialFilters={props.initialFilters} onSearchStart={handleSearchStart} />;
};
