'use client';

import React, { useState } from 'react';
import { HiChevronDown, HiInformationCircle, HiPlus } from 'react-icons/hi';
import { Button } from '@/component-library/atoms/form/button';
import { InfoField } from '@/component-library/features/fields/InfoField';
import { cn } from '@/component-library/utils';
import { AccountIdentity } from '@/lib/core/entity/account';
import { AccountResource } from './details-account-types';
import { AccountResourceState } from './AccountResourceState';
import { AccountIdentitiesTable } from './AccountIdentitiesTable';

/** The copy under the Identities tab's "About identities" disclosure. */
export const AccountIdentitiesTips = () => (
    <ul className="list-disc list-inside space-y-1 px-3 pl-10 pb-3">
        <li>
            <span className="font-medium">Identities</span> are the credentials that can log in as this account. One identity can map to several
            accounts.
        </li>
        <li>
            <span className="font-medium">X509:</span> Rucio compares certificate DNs exactly. Both the{' '}
            <code className="font-mono">CN=...,DC=...</code> and the <code className="font-mono">/DC=.../CN=...</code> forms are in use, so you may
            need to add both.
        </li>
        <li>
            <span className="font-medium">OIDC:</span> Use <code className="font-mono">SUB=&lt;sub&gt;, ISS=&lt;issuer&gt;</code>. A trailing slash on
            the issuer makes it a different identity.
        </li>
        <li>
            <span className="font-medium">Passwords cannot be changed</span> from the WebUI. Removing a username only unlinks it from this account.
        </li>
    </ul>
);

export interface DetailsAccountIdentitiesProps {
    identities: AccountResource<AccountIdentity[]>;
    canManage: boolean;
    busy?: boolean;
    onAdd?: () => void;
    onDelete?: (identity: AccountIdentity) => void;
}

export const DetailsAccountIdentities = ({ identities, canManage, busy = false, onAdd, onDelete }: DetailsAccountIdentitiesProps) => {
    const [tipsOpen, setTipsOpen] = useState(false);
    const addButton = canManage && (
        <Button size="sm" onClick={onAdd} disabled={busy}>
            <HiPlus className="mr-1 h-4 w-4" aria-hidden="true" />
            Add identity
        </Button>
    );

    return (
        <div className="flex flex-col gap-4">
            <div className="rounded-md bg-base-info-50 dark:bg-base-info-900 text-sm text-base-info-700 dark:text-base-info-200">
                <button
                    type="button"
                    className="flex w-full items-center gap-2 p-3 text-left"
                    onClick={() => setTipsOpen(prev => !prev)}
                    aria-expanded={tipsOpen}
                >
                    <HiInformationCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="font-medium flex-1">About identities</span>
                    <HiChevronDown
                        className={cn('h-4 w-4 shrink-0 transition-transform duration-200', tipsOpen && 'rotate-180')}
                        aria-hidden="true"
                    />
                </button>
                {tipsOpen && <AccountIdentitiesTips />}
            </div>

            <AccountResourceState resource={identities} label="identities" />
            {identities.data && !identities.error && (
                <>
                    {identities.data.length === 0 ? (
                        <InfoField>
                            <span className="flex-1">This account has no identities, so nobody can log in to it.</span>
                            {addButton}
                        </InfoField>
                    ) : (
                        <>
                            {addButton && <div className="flex justify-end">{addButton}</div>}
                            <div className="rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xs overflow-hidden h-[calc(100vh-20rem)]">
                                <AccountIdentitiesTable identities={identities.data} canManage={canManage} onDelete={onDelete} busy={busy} />
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};
