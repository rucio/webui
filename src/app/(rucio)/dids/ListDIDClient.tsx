'use client';

import { ListDID } from '@/component-library/pages/DID/list/ListDID';
import { DIDSearchParams } from '@/component-library/features/search/DIDSearchPanel';
import { DIDType } from '@/lib/core/entity/rucio';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';
import { HiChevronDown, HiInformationCircle } from 'react-icons/hi2';
import { cn } from '@/component-library/utils';
import { HiFilter } from 'react-icons/hi';

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

    const [isTipsOpen, setIsTipsOpen] = useState(false);

    return (
        <div className="flex flex-col space-y-6 w-full">
            {/* Tips */}
            <div className="rounded-md bg-base-info-50 dark:bg-base-info-900 text-sm text-base-info-700 dark:text-base-info-200">
                <button
                    type="button"
                    className="flex w-full items-center gap-2 p-3 text-left"
                    onClick={() => setIsTipsOpen(!isTipsOpen)}
                >
                    <HiInformationCircle className="w-5 h-5" />
                    <span className="font-medium flex flex-1">Tips</span>
                    <HiChevronDown className={cn('w-4 h-4 transition-transform duration-200', isTipsOpen && 'rotate-180')} />
                </button>
                {isTipsOpen &&
                    <div>
                        <ul className="list-disc list-inside space-y-1 px-3 pl-10 pb-3">
                            <li>
                                <span className="font-medium">Purpose:</span> Filtering DIDs and showing their basic data and metadata.
                            </li>
                            <li>
                                <span className="font-medium">Scope:</span> Must be specified, there is no possibility of finding DID without its properly defined scope.
                            </li>
                            <li>
                                <span className="font-medium">Name:</span> You can use proper name of a DID, or a caption with wildcards <code className="font-mono">*</code> and <code className="font-mono">%</code>, which both stands for any number of signs, even zero:
                                <ul className="list-decimal list-inside space-y-0.5 px-3 pl-5 py-1">
                                    <li>
                                        <code className="font-mono">test*</code> will show all DIDs of specified type and scope, which name starts with <code className="font-mono">test</code>.
                                    </li>
                                    <li>
                                        <code className="font-mono">%-atlas-%-%</code> will show DIDs where all the places occured by <code className="font-mono">%</code> are replaced for proper signs in their real names.
                                    </li>
                                    <li>
                                        One <code className="font-mono">*</code> will return all DIDs within provided scope and type.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <span className="font-medium">Metadata filters:</span> In addition to the required filters, you can specify several metadata parameters in the dropdown menu that opens by clicking on the <HiFilter className="inline-block align-middle w-4 h-4 shrink-0 mx-0.5" /> icon.
                            </li>
                        </ul>
                    </div>
                }
            </div>
            <ListDID firstPattern={props.firstPattern} autoSearch={props.autoSearch} initialType={props.initialType} onSearchStart={handleSearchStart} />
        </div>
    );
};
