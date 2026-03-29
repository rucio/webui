'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { Input } from '@/component-library/atoms/form/input';
import { UpdateRuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { invalidateForMutation } from '@/lib/infrastructure/query';
import { useToast } from '@/lib/infrastructure/hooks/useToast';

const SECONDS_PER_DAY = 86400;

export interface UpdateRuleLifetimeDialogProps {
    ruleId: string;
    currentLifetime: number | null | undefined;
    onClose: () => void;
    show: boolean;
}

function getErrorMessage(error: UpdateRuleViewModel): string {
    switch (error.errorType) {
        case 'unauthorized':
            return 'You are not authorized to update this rule. Please log in and try again.';
        case 'permission_denied':
            return 'You do not have permission to update the lifetime of this rule.';
        case 'not_found':
            return 'The rule could not be found. It may have been deleted.';
        case 'conflict':
            return 'There is a conflict updating this rule. It may have been modified concurrently.';
        case 'unknown':
        default:
            return error.message || 'An unexpected error occurred while updating the rule lifetime.';
    }
}

/**
 * Dialog for updating the lifetime of a replication rule.
 * Accepts a new lifetime in days and converts to seconds before submitting.
 *
 * @example
 * ```tsx
 * <UpdateRuleLifetimeDialog
 *     ruleId="abc123"
 *     currentLifetime={2592000}
 *     show={isOpen}
 *     onClose={() => setIsOpen(false)}
 * />
 * ```
 */
export const UpdateRuleLifetimeDialog: React.FC<UpdateRuleLifetimeDialogProps> = ({ ruleId, currentLifetime, show, onClose }) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const currentLifetimeDays = currentLifetime != null ? Math.round(currentLifetime / SECONDS_PER_DAY) : undefined;

    const [days, setDays] = useState('');
    const [inputError, setInputError] = useState<string | undefined>();

    useEffect(() => {
        if (show) {
            setDays(currentLifetimeDays != null ? String(currentLifetimeDays) : '');
            setInputError(undefined);
        }
    }, [show, currentLifetimeDays]);

    const { mutate, isPending } = useMutation({
        mutationFn: async (lifetimeSeconds: number | null) => {
            const res = await fetch('/api/feature/update-rule', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ruleId, options: { lifetime: lifetimeSeconds } }),
            });
            const viewModel: UpdateRuleViewModel = await res.json();
            if (!res.ok || viewModel.status !== 'success') {
                throw viewModel;
            }
            return viewModel;
        },
        onSuccess: () => {
            toast({ variant: 'success', title: 'Lifetime Updated', description: 'The rule lifetime has been updated successfully.' });
            invalidateForMutation(queryClient, 'update-rule');
            onClose();
        },
        onError: (error: UpdateRuleViewModel) => {
            toast({ variant: 'error', title: 'Update Failed', description: getErrorMessage(error) });
        },
    });

    const handleSubmit = () => {
        if (days === '') {
            mutate(null);
            return;
        }
        const parsed = parseInt(days, 10);
        if (isNaN(parsed) || parsed < 0) {
            setInputError('Enter a non-negative number of days, or leave empty to remove the lifetime');
            return;
        }
        setInputError(undefined);
        mutate(parsed * SECONDS_PER_DAY);
    };

    return (
        <MutationDialog
            open={show}
            onOpenChange={open => {
                if (!open) onClose();
            }}
            title="Update Rule Lifetime"
            description="Set a new lifetime for this replication rule in days."
            onSubmit={handleSubmit}
            submitLabel="Update Lifetime"
            submitVariant="default"
            loading={isPending}
        >
            <div className="space-y-4">
                {currentLifetimeDays !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-600 dark:text-neutral-400">Current lifetime</span>
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            {currentLifetimeDays} {currentLifetimeDays === 1 ? 'day' : 'days'}
                        </span>
                    </div>
                )}
                <div>
                    <label htmlFor="lifetime-days" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                        New lifetime (days)
                    </label>
                    <Input
                        id="lifetime-days"
                        type="number"
                        min={0}
                        value={days}
                        onChange={e => {
                            setDays(e.target.value);
                            if (inputError) setInputError(undefined);
                        }}
                        placeholder="e.g., 30 (leave empty to remove lifetime)"
                        error={!!inputError}
                        aria-describedby={inputError ? 'lifetime-days-error' : undefined}
                    />
                    {inputError && (
                        <p id="lifetime-days-error" className="mt-1 text-sm text-base-error-600 dark:text-base-error-400">
                            {inputError}
                        </p>
                    )}
                    <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                        Leave empty to remove the lifetime (rule will not expire).
                    </p>
                </div>
            </div>
        </MutationDialog>
    );
};

export default UpdateRuleLifetimeDialog;
