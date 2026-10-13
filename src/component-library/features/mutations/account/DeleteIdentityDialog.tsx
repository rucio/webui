'use client';

import * as React from 'react';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { Alert } from '@/component-library/atoms/feedback/Alert';
import { IdentityTypeBadge } from '@/component-library/features/badges/account/IdentityTypeBadge';
import { IdentityType } from '@/lib/core/entity/account';

export interface DeleteIdentityValues {
    identity: string;
    authType: IdentityType;
}

export interface DeleteIdentityDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    account: string;
    identity: string;
    authType: IdentityType;
    /** The account has no other identity left after this one is removed. */
    isLastIdentity: boolean;
    /** The identity the admin is signed in with right now. */
    isCurrentSessionIdentity: boolean;
    onSubmit: (values: DeleteIdentityValues) => void;
    loading?: boolean;
    /** Server error, rendered inside the dialog. The dialog stays open. */
    error?: string;
}

/** Confirmation dialog for unlinking an identity from an account. */
export const DeleteIdentityDialog: React.FC<DeleteIdentityDialogProps> = ({
    open,
    onOpenChange,
    account,
    identity,
    authType,
    isLastIdentity,
    isCurrentSessionIdentity,
    onSubmit,
    loading = false,
    error,
}) => (
    <MutationDialog
        open={open}
        onOpenChange={onOpenChange}
        title="Remove identity"
        description={`Unlink this identity from ${account}.`}
        onSubmit={() => onSubmit({ identity, authType })}
        submitLabel="Remove identity"
        submitVariant="error"
        loading={loading}
    >
        <div className="space-y-4">
            {error && <Alert variant="error" message={error} />}
            {isLastIdentity && (
                <Alert variant="warning" message="This is the last identity on this account. Nobody will be able to log in as it afterwards." />
            )}
            {isCurrentSessionIdentity && (
                <Alert variant="warning" message="This is the identity you are signed in with. You may lose access to this account." />
            )}
            <div className="rounded-md bg-neutral-100 dark:bg-neutral-800 p-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Type</span>
                    <IdentityTypeBadge value={authType} />
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Identity</span>
                    <span className="font-mono text-sm text-neutral-900 dark:text-neutral-100 break-all text-right max-w-[70%]">{identity}</span>
                </div>
            </div>
        </div>
    </MutationDialog>
);
