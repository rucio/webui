'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { Input } from '@/component-library/atoms/form/input';

export interface BoostRuleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ruleId: string;
    currentLifetime?: number;
    onConfirm: (additionalDays: number) => void;
    loading?: boolean;
}

/**
 * Dialog for boosting (extending the lifetime of) a replication rule.
 * Accepts a number of additional days to add to the rule's lifetime.
 *
 * @example
 * ```tsx
 * <BoostRuleDialog
 *     open={isOpen}
 *     onOpenChange={setIsOpen}
 *     ruleId="abc123"
 *     currentLifetime={30}
 *     onConfirm={(days) => handleBoost(days)}
 * />
 * ```
 */
export const BoostRuleDialog: React.FC<BoostRuleDialogProps> = ({
    open,
    onOpenChange,
    ruleId,
    currentLifetime,
    onConfirm,
    loading = false,
}) => {
    const [days, setDays] = useState('');
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        if (open) {
            setDays('');
            setError(undefined);
        }
    }, [open]);

    const handleSubmit = () => {
        const parsed = parseInt(days, 10);
        if (isNaN(parsed) || parsed <= 0) {
            setError('Enter a positive number of days');
            return;
        }
        setError(undefined);
        onConfirm(parsed);
    };

    return (
        <MutationDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Boost Rule"
            description="Extend the lifetime of this rule by adding days."
            onSubmit={handleSubmit}
            submitLabel="Boost Rule"
            submitVariant="default"
            loading={loading}
            disabled={!days}
        >
            <div className="space-y-4">
                {currentLifetime !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-600 dark:text-neutral-400">Current lifetime</span>
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            {currentLifetime} {currentLifetime === 1 ? 'day' : 'days'}
                        </span>
                    </div>
                )}
                <div>
                    <label htmlFor="boost-days" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                        Additional days <span className="text-base-error-600">*</span>
                    </label>
                    <Input
                        id="boost-days"
                        type="number"
                        min={1}
                        value={days}
                        onChange={e => {
                            setDays(e.target.value);
                            if (error) setError(undefined);
                        }}
                        placeholder="e.g., 30"
                        error={!!error}
                        aria-describedby={error ? 'boost-days-error' : undefined}
                    />
                    {error && (
                        <p id="boost-days-error" className="mt-1 text-sm text-base-error-600 dark:text-base-error-400">
                            {error}
                        </p>
                    )}
                </div>
                {days && !error && (
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        New lifetime:{' '}
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            {(currentLifetime || 0) + parseInt(days, 10)} days
                        </span>
                    </div>
                )}
            </div>
        </MutationDialog>
    );
};
