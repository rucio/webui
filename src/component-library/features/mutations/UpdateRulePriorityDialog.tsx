'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { Input } from '@/component-library/atoms/form/input';
import { UpdateRuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { invalidateForMutation } from '@/lib/infrastructure/query';
import { useToast } from '@/lib/infrastructure/hooks/useToast';

export interface UpdateRulePriorityDialogProps {
    ruleId: string;
    currentPriority: number;
    onClose: () => void;
    show: boolean;
}

function getErrorMessage(error: UpdateRuleViewModel): string {
    switch (error.errorType) {
        case 'unauthorized':
            return 'You are not authorized to update this rule. Please log in and try again.';
        case 'permission_denied':
            return 'You do not have permission to update the priority of this rule.';
        case 'not_found':
            return 'The rule could not be found. It may have been deleted.';
        case 'conflict':
            return 'There is a conflict updating this rule. It may have been modified concurrently.';
        case 'unknown':
        default:
            return error.message || 'An unexpected error occurred while updating the rule priority.';
    }
}

/**
 * Dialog for updating the priority of a replication rule.
 * Accepts a new priority value between 1 and 5.
 *
 * @example
 * ```tsx
 * <UpdateRulePriorityDialog
 *     ruleId="abc123"
 *     currentPriority={3}
 *     show={isOpen}
 *     onClose={() => setIsOpen(false)}
 * />
 * ```
 */
export const UpdateRulePriorityDialog: React.FC<UpdateRulePriorityDialogProps> = ({ ruleId, currentPriority, show, onClose }) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [priority, setPriority] = useState(String(currentPriority));
    const [inputError, setInputError] = useState<string | undefined>();

    useEffect(() => {
        if (show) {
            setPriority(String(currentPriority));
            setInputError(undefined);
        }
    }, [show, currentPriority]);

    const { mutate, isPending } = useMutation({
        mutationFn: async (newPriority: number) => {
            const res = await fetch('/api/feature/update-rule', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rule_id: ruleId, priority: newPriority }),
            });
            const viewModel: UpdateRuleViewModel = await res.json();
            if (!res.ok || viewModel.status !== 'success') {
                throw viewModel;
            }
            return viewModel;
        },
        onSuccess: () => {
            toast({ variant: 'success', title: 'Priority Updated', description: 'The rule priority has been updated successfully.' });
            invalidateForMutation(queryClient, 'update-rule');
            onClose();
        },
        onError: (error: UpdateRuleViewModel) => {
            toast({ variant: 'error', title: 'Update Failed', description: getErrorMessage(error) });
        },
    });

    const handleSubmit = () => {
        const parsed = parseInt(priority, 10);
        if (isNaN(parsed) || parsed < 1 || parsed > 5) {
            setInputError('Enter a priority value between 1 and 5');
            return;
        }
        setInputError(undefined);
        mutate(parsed);
    };

    return (
        <MutationDialog
            open={show}
            onOpenChange={open => {
                if (!open) onClose();
            }}
            title="Update Rule Priority"
            description="Set a new transfer priority for this replication rule. Higher values indicate higher priority."
            onSubmit={handleSubmit}
            submitLabel="Update Priority"
            submitVariant="default"
            loading={isPending}
        >
            <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600 dark:text-neutral-400">Current priority</span>
                    <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">{currentPriority}</span>
                </div>
                <div>
                    <label htmlFor="rule-priority" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                        New priority <span className="text-base-error-600">*</span>
                    </label>
                    <Input
                        id="rule-priority"
                        type="number"
                        min={1}
                        max={5}
                        value={priority}
                        onChange={e => {
                            setPriority(e.target.value);
                            if (inputError) setInputError(undefined);
                        }}
                        placeholder="e.g., 3"
                        error={!!inputError}
                        aria-describedby={inputError ? 'rule-priority-error' : undefined}
                    />
                    {inputError && (
                        <p id="rule-priority-error" className="mt-1 text-sm text-base-error-600 dark:text-base-error-400">
                            {inputError}
                        </p>
                    )}
                    <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">Priority must be an integer between 1 (lowest) and 5 (highest).</p>
                </div>
            </div>
        </MutationDialog>
    );
};

export default UpdateRulePriorityDialog;
