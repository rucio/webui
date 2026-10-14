import React from 'react';
import { HiPlus } from 'react-icons/hi';
import { Button } from '@/component-library/atoms/form/button';
import { Heading } from '@/component-library/atoms/misc/Heading';
import { InfoField } from '@/component-library/features/fields/InfoField';
import { WarningField } from '@/component-library/features/fields/WarningField';
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
    /** An empty rseExpression asks for the expression to be typed in (Rucio could not list the global quotas). */
    onDeleteLimit?: (target: AccountLimitTarget) => void;
}

const SECTIONS: { locality: AccountLimitLocality; title: string; empty: string; height: string }[] = [
    { locality: 'local', title: 'Local (per RSE)', empty: 'No local quotas or usage.', height: 'h-[calc(100vh-20rem)]' },
    { locality: 'global', title: 'Global (per RSE expression)', empty: 'No global quotas.', height: 'h-[calc(50vh-10rem)] min-h-48' },
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
                    {SECTIONS.map(({ locality, title, empty, height }) => {
                        const rows = data[locality];
                        const failed = locality === 'global' ? data.globalError : undefined;
                        return (
                            <section key={locality} className="flex flex-col gap-3" aria-label={title}>
                                <Heading text={title} size="sm" level="h2" />
                                {failed ? (
                                    <WarningField>
                                        <span className="flex-1">{failed}</span>
                                        {canManage && (
                                            <Button
                                                variant="neutral"
                                                size="sm"
                                                onClick={() => onDeleteLimit?.({ locality: 'global', rseExpression: '' })}
                                                disabled={busy}
                                            >
                                                Remove by expression
                                            </Button>
                                        )}
                                    </WarningField>
                                ) : rows.length === 0 ? (
                                    <InfoField>
                                        <span>{empty}</span>
                                    </InfoField>
                                ) : (
                                    <div
                                        className={`rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xs overflow-hidden ${height}`}
                                    >
                                        <AccountQuotasTable
                                            locality={locality}
                                            quotas={rows}
                                            canManage={canManage}
                                            onEdit={onSetLimit}
                                            onDelete={onDeleteLimit}
                                            busy={busy}
                                        />
                                    </div>
                                )}
                            </section>
                        );
                    })}
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Each RSE needs a local quota. Global quotas add a shared cap across the RSEs their expression matches. Accounts with the admin
                        attribute are not limited by quotas.
                    </p>
                </>
            )}
        </div>
    );
};
