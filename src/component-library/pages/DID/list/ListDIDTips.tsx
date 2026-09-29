import React from 'react';
import { HiFilter } from 'react-icons/hi';

/**
 * The guidance shown under the DID list page's Tips disclosure.
 *
 * Kept as its own component so the copy is testable: it is the page's primary
 * explanation of how search behaves, and it has to stay in step with the search
 * panel's actual types.
 */
export const ListDIDTips = () => (
    <ul className="list-disc list-inside space-y-1 px-3 pl-10 pb-3">
        <li>
            <span className="font-medium">Purpose:</span> Filtering DIDs and showing their basic data and metadata.
        </li>
        <li>
            <span className="font-medium">Type:</span> Choose what kind of DID to look for.
            <ul className="list-decimal list-inside space-y-0.5 px-3 pl-5 py-1">
                <li>
                    <span className="font-medium">All</span> is the default. It searches containers and datasets together and shows the type of each
                    result. If neither matches, it looks for files.
                </li>
                <li>
                    <span className="font-medium">Container</span>, <span className="font-medium">Dataset</span> and{' '}
                    <span className="font-medium">File</span> search that one type only.
                </li>
                <li>
                    Files are excluded from wildcard searches under <span className="font-medium">All</span>. Search the{' '}
                    <span className="font-medium">File</span> type directly to include them.
                </li>
            </ul>
        </li>
        <li>
            <span className="font-medium">Scope:</span> Must be specified, there is no possibility of finding DID without its properly defined scope.
        </li>
        <li>
            <span className="font-medium">Name:</span> You can use proper name of a DID, or a caption with wildcards{' '}
            <code className="font-mono">*</code> and <code className="font-mono">%</code>, which both stands for any number of signs, even zero:
            <ul className="list-decimal list-inside space-y-0.5 px-3 pl-5 py-1">
                <li>
                    <code className="font-mono">test*</code> will show all DIDs of specified type and scope, which name starts with{' '}
                    <code className="font-mono">test</code>.
                </li>
                <li>
                    <code className="font-mono">%-atlas-%-%</code> will show DIDs where all the places occured by <code className="font-mono">%</code>{' '}
                    are replaced for proper signs in their real names.
                </li>
                <li>
                    One <code className="font-mono">*</code> will return all DIDs within provided scope and type.
                </li>
            </ul>
        </li>
        <li>
            <span className="font-medium">Metadata filters:</span> In addition to the required filters, you can specify several metadata parameters in
            the dropdown menu that opens by clicking on the <HiFilter className="inline-block align-middle w-4 h-4 shrink-0 mx-0.5" /> icon.
        </li>
    </ul>
);
