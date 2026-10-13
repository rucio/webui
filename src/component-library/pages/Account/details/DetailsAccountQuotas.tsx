import React from 'react';
import { HiPlus } from 'react-icons/hi';
import { Button } from '@/component-library/atoms/form/button';
import { Heading } from '@/component-library/atoms/misc/Heading';
import { InfoField } from '@/component-library/features/fields/InfoField';
import { AccountLimitLocality } from '@/lib/core/entity/account';
import { AccountLimitTarget, AccountQuotas, AccountResource } from './details-account-types';
import { AccountResourceState } from './AccountResourceState';
import { AccountQuotasTable } from './AccountQuotasTable';

export interface DetailsAccountQuotasProps {
    quotas: AccountResource<AccountQuotas>;
    canManage: boolean;
    busy?: boolean;
    /** Open the quota dialog: empty for a new quota, prefilled to edit one. */
    onSetLimit?: (initial?: AccountLimitTarget & { bytes: number }) => void;
    onDeleteLimit?: (target: AccountLimitTarget) => void;
}

const SECTIONS: { locality: AccountLimitLocality; title: string; empty: string }[] = [
    { locality: 'local', title: 'Local (per RSE)', empty: 'No local quotas or usage.' },
    { locality: 'global', title: 'Global (per RSE expression)', empty: 'No global quotas.' },
];

export const DetailsAccountQuotas = ({ quotas, canManage, busy = false, onSetLimit, onDeleteLimit }: DetailsAccountQuotasProps) => {
    const data = quotas.error ? undefined : quotas.data;
    return (
        <div className="flex flex-col gap-6">
            {canManage && (
                <div className="flex justify-end">
                    <Button size="sm" onClick={() => onSetLimit?.(undefined)} disabled={busy}>
                        <HiPlus className="mr-1 h-4 w-4" aria-hidden="true" />
                        Set quota
                    </Button>
                </div>
            )}
            <AccountResourceState resource={quotas} label="quotas" />
            {data && (
                <>
                    {SECTIONS.map(({ locality, title, empty }) => {
                        const rows = data[locality];
                        return (
                            <section key={locality} className="flex flex-col gap-3" aria-label={title}>
                                <Heading text={title} size="sm" level="h2" />
                                {rows.length === 0 ? (
                                    <InfoField>
                                        <span>{empty}</span>
                                    </InfoField>
                                ) : (
                                    <div className="rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xs overflow-hidden h-80">
                                        <AccountQuotasTable
                                            locality={locality}
                                            quotas={rows}
                                            canManage={canManage}
                                            onEdit={onSetLimit}
                                            onDelete={onDeleteLimit}
                                        />
                                    </div>
                                )}
                            </section>
                        );
                    })}
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">A local quota on an RSE overrides a global quota that covers it.</p>
                </>
            )}
        </div>
    );
};
