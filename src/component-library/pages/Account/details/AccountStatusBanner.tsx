import React from 'react';
import { HiExclamation } from 'react-icons/hi';
import { Button } from '@/component-library/atoms/form/button';
import { DateWithTooltip } from '@/component-library/features/utils/DateWithTooltip';
import { AccountStatus } from '@/lib/core/entity/rucio';

export interface AccountStatusBannerProps {
    status: AccountStatus;
    suspendedAt?: string;
    deletedAt?: string;
    /** Show the Reactivate button (admins with accounts.manage). */
    canReactivate: boolean;
    onReactivate?: () => void;
    /** A mutation is running: Reactivate is disabled. */
    busy?: boolean;
}

const HIDDEN = 'Rucio hides its identities, attributes and quotas until it is reactivated.';

/** Explains a non-ACTIVE account on its detail page. Renders nothing for ACTIVE accounts. */
export const AccountStatusBanner = ({ status, suspendedAt, deletedAt, canReactivate, onReactivate, busy = false }: AccountStatusBannerProps) => {
    if (status === AccountStatus.ACTIVE) return null;

    let headline: React.ReactNode;
    if (status === AccountStatus.SUSPENDED) {
        headline = suspendedAt ? (
            <>
                This account is suspended since <DateWithTooltip date={suspendedAt} />.
            </>
        ) : (
            'This account is suspended.'
        );
    } else if (status === AccountStatus.DELETED) {
        headline = deletedAt ? (
            <>
                This account was deleted on <DateWithTooltip date={deletedAt} />.
            </>
        ) : (
            'This account was deleted.'
        );
    } else {
        headline = 'This account is not active.';
    }

    return (
        <div
            role="status"
            className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-base-warning-600 dark:border-base-warning-500 bg-base-warning-100 dark:bg-base-warning-900 px-4 py-3 text-sm text-base-warning-900 dark:text-base-warning-100"
        >
            <HiExclamation className="h-5 w-5 shrink-0" aria-hidden="true" />
            <p className="flex-1">
                {headline} {HIDDEN}
            </p>
            {canReactivate && (
                <Button variant="success" size="sm" onClick={onReactivate} disabled={busy}>
                    Reactivate
                </Button>
            )}
        </div>
    );
};
