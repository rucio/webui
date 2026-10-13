import React from 'react';

/** The guidance shown under the accounts list page's Tips disclosure. */
export const ListAccountsTips = () => (
    <ul className="list-disc list-inside space-y-1 px-3 pl-10 pb-3">
        <li>
            <span className="font-medium">Purpose:</span> Browse Rucio accounts and open one to manage its identities, attributes and quotas.
        </li>
        <li>
            <span className="font-medium">Only active accounts are listed.</span> Suspended and deleted accounts do not appear here. Enter the exact
            name to open one directly.
        </li>
        <li>
            <span className="font-medium">Name:</span> Use <code className="font-mono">*</code> as a wildcard, for example{' '}
            <code className="font-mono">jdoe*</code> lists every account starting with <code className="font-mono">jdoe</code>.
        </li>
        <li>
            <span className="font-medium">Identity:</span> Lists the accounts a given identity can log in as, such as a username or a certificate DN.
        </li>
        <li>
            <span className="font-medium">Type:</span> Narrow the list to user, group or service accounts.
        </li>
    </ul>
);
