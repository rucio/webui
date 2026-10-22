import React from 'react';
import { Button } from '@/component-library/atoms/form/button';
import { LoadingSpinner } from '@/component-library/atoms/loading/LoadingSpinner';
import { WarningField } from '@/component-library/features/fields/WarningField';
import { AccountResource } from './details-account-types';

/**
 * The loading or error state of an account tab. Renders nothing once the data is there.
 * `permission_denied` and `not_found` are final, so only other errors offer Retry.
 */
export const AccountResourceState = ({ resource, label }: { resource: AccountResource<unknown>; label: string }) => {
    const { error } = resource;
    if (error) {
        const final = error.errorType === 'permission_denied' || error.errorType === 'not_found';
        return (
            <WarningField>
                <span className="flex-1">{error.message || `Could not load the ${label}.`}</span>
                {!final && resource.onRetry && (
                    <Button variant="neutral" size="sm" onClick={resource.onRetry}>
                        Retry
                    </Button>
                )}
            </WarningField>
        );
    }
    if (resource.isLoading || resource.data === undefined) {
        return (
            <div className="flex items-center gap-2 py-6 text-sm text-neutral-600 dark:text-neutral-400">
                <LoadingSpinner size="sm" aria-hidden="true" />
                <span>Loading {label}...</span>
            </div>
        );
    }
    return null;
};
