'use client';

import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { Input } from '@/component-library/atoms/form/input';
import { Checkbox } from '@/component-library/atoms/form/checkbox';
import { Alert } from '@/component-library/atoms/feedback/Alert';
import { HiInformationCircle } from 'react-icons/hi';

export interface UpdateLifetimeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ruleId: string;
    currentExpiresAt?: string | null;
    onConfirm: (lifetimeSeconds: number | null) => void;
    loading?: boolean;
    /** Whether the user can set infinite lifetime (clear expiry). Defaults to true. */
    canSetInfinite?: boolean;
    /** Maximum lifetime in seconds the user can set. Undefined means no limit. */
    maxLifetimeSeconds?: number;
    /** Minimum lifetime in seconds. Defaults to 0 (any non-negative value). */
    minLifetimeSeconds?: number;
    /** Whether the current user is an admin. Non-admins see a policy warning. */
    isAdmin?: boolean;
}

type InputMode = 'date' | 'duration';

/**
 * Dialog for updating the lifetime of a replication rule.
 * Supports setting by date, setting by days+hours duration, or clearing the lifetime entirely.
 *
 * @example
 * ```tsx
 * <UpdateLifetimeDialog
 *     open={isOpen}
 *     onOpenChange={setIsOpen}
 *     ruleId="abc123"
 *     currentExpiresAt="2025-12-31T00:00:00Z"
 *     onConfirm={(seconds) => handleUpdate(seconds)}
 * />
 * ```
 */
export const UpdateLifetimeDialog: React.FC<UpdateLifetimeDialogProps> = ({
    open,
    onOpenChange,
    ruleId,
    currentExpiresAt,
    onConfirm,
    loading = false,
    canSetInfinite = true,
    maxLifetimeSeconds,
    minLifetimeSeconds = 0,
    isAdmin = false,
}) => {
    const [mode, setMode] = useState<InputMode>('duration');
    const [clearLifetime, setClearLifetime] = useState(false);
    const [dateValue, setDateValue] = useState('');
    const [days, setDays] = useState('');
    const [hours, setHours] = useState('');
    const [error, setError] = useState<string | undefined>();

    /** Reactively compute the current intended lifetime in seconds from the form state. */
    const computedSeconds = useMemo(() => {
        if (clearLifetime) return null;
        if (mode === 'date') {
            if (!dateValue) return null;
            try {
                const target = new Date(dateValue);
                const now = new Date();
                return Math.floor((target.getTime() - now.getTime()) / 1000);
            } catch {
                return null;
            }
        } else {
            const parsedDays = days === '' ? 0 : parseInt(days, 10);
            const parsedHours = hours === '' ? 0 : parseInt(hours, 10);
            if (isNaN(parsedDays) || isNaN(parsedHours)) return null;
            return (parsedDays * 24 + parsedHours) * 3600;
        }
    }, [clearLifetime, mode, dateValue, days, hours]);

    /**
     * Show a destructive warning when the user has explicitly entered a zero lifetime.
     * Guard against showing on initial state (duration mode: both fields empty → computedSeconds=0)
     * by requiring at least one field to have been filled. In date mode the guard is `dateValue`
     * being non-empty (already enforced by the computedSeconds useMemo returning null when empty).
     */
    const showZeroLifetimeWarning =
        computedSeconds !== null &&
        computedSeconds === 0 &&
        (mode === 'date' ? !!dateValue : days !== '' || hours !== '');
    /** Show a softer warning when the lifetime is very short but non-zero (< 1 hour). */
    const showShortLifetimeWarning = computedSeconds !== null && computedSeconds > 0 && computedSeconds < 3600;

    useEffect(() => {
        if (open) {
            setMode('duration');
            setClearLifetime(false);
            setDateValue('');
            setDays('');
            setHours('');
            setError(undefined);
        }
    }, [open]);

    const formatCurrentExpiry = (iso: string) => {
        try {
            return new Date(iso).toLocaleString();
        } catch {
            return iso;
        }
    };

    const formatMinLifetime = () => {
        const h = Math.floor(minLifetimeSeconds / 3600);
        if (h >= 24 && minLifetimeSeconds % 86400 === 0) {
            const d = minLifetimeSeconds / 86400;
            return `${d} day${d !== 1 ? 's' : ''}`;
        }
        return `${h} hour${h !== 1 ? 's' : ''}`;
    };

    const validateMinLifetime = (seconds: number): boolean => {
        if (seconds < minLifetimeSeconds) {
            setError(`Minimum lifetime is ${formatMinLifetime()}`);
            return false;
        }
        return true;
    };

    const validateMaxLifetime = (seconds: number): boolean => {
        if (maxLifetimeSeconds !== undefined && seconds > maxLifetimeSeconds) {
            const maxDays = Math.floor(maxLifetimeSeconds / 86400);
            setError(`Maximum lifetime is ${maxDays} day${maxDays !== 1 ? 's' : ''}`);
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (clearLifetime && canSetInfinite) {
            onConfirm(null);
            return;
        }

        if (mode === 'date') {
            if (!dateValue) {
                setError('Please select a date and time');
                return;
            }
            const target = new Date(dateValue);
            const now = new Date();
            const diffSeconds = Math.floor((target.getTime() - now.getTime()) / 1000);
            if (diffSeconds < 0) {
                setError('Expiry date must be in the future');
                return;
            }
            // Respect an explicit minLifetimeSeconds > 0 when set by the caller.
            if (minLifetimeSeconds > 0 && !validateMinLifetime(diffSeconds)) return;
            if (!validateMaxLifetime(diffSeconds)) return;
            setError(undefined);
            onConfirm(diffSeconds);
        } else {
            const parsedDays = days === '' ? 0 : parseInt(days, 10);
            const parsedHours = hours === '' ? 0 : parseInt(hours, 10);

            if (isNaN(parsedDays) || parsedDays < 0) {
                setError('Days must be 0 or greater');
                return;
            }
            if (isNaN(parsedHours) || parsedHours < 0 || parsedHours > 23) {
                setError('Hours must be between 0 and 23');
                return;
            }
            const totalSeconds = (parsedDays * 24 + parsedHours) * 3600;
            // Negative values are already blocked by input validation; only enforce an
            // explicit minimum > 0 when the caller has set one.
            if (minLifetimeSeconds > 0 && !validateMinLifetime(totalSeconds)) return;
            if (!validateMaxLifetime(totalSeconds)) return;
            setError(undefined);
            onConfirm(totalSeconds);
        }
    };

    const isSubmitDisabled = !clearLifetime && (mode === 'date' ? !dateValue : days === '' && hours === '');

    return (
        <MutationDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Update Lifetime"
            description="Set when this replication rule should expire."
            onSubmit={handleSubmit}
            submitLabel="Update Lifetime"
            submitVariant="default"
            loading={loading}
            disabled={isSubmitDisabled}
        >
            <div className="space-y-4">
                {/* Tips */}
                <div className="rounded-md bg-base-info-50 dark:bg-base-info-900 p-3 text-sm text-base-info-700 dark:text-base-info-200 flex gap-2 items-start">
                    <HiInformationCircle className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
                    <p>
                        Tips: Setting the lifetime controls when this rule expires and is deleted. You can extend or shorten the lifetime.
                        {canSetInfinite && ' You can also clear the lifetime entirely.'}
                        {minLifetimeSeconds > 0 && ` Minimum lifetime is ${formatMinLifetime()}.`}
                    </p>
                </div>

                {/* Policy warning for non-admins */}
                {!isAdmin && (
                    <div className="flex items-start gap-3 rounded-md bg-base-warning-50 dark:bg-base-warning-950 border border-base-warning-200 dark:border-base-warning-800 p-3">
                        <HiInformationCircle
                            className="h-5 w-5 shrink-0 text-base-warning-600 dark:text-base-warning-400 mt-0.5"
                            aria-hidden="true"
                        />
                        <p className="text-sm text-base-warning-900 dark:text-base-warning-100">
                            The server may reject this request depending on the policy configured by your administrator.
                        </p>
                    </div>
                )}

                {/* Current expiry */}
                {currentExpiresAt && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-600 dark:text-neutral-400">Current expiry</span>
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">{formatCurrentExpiry(currentExpiresAt)}</span>
                    </div>
                )}

                {/* Rule ID */}
                <div>
                    <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Rule ID</span>
                    <p className="mt-1 font-mono text-sm text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 rounded px-2 py-1.5 break-all">
                        {ruleId}
                    </p>
                </div>

                {/* Clear lifetime checkbox — only shown when user has permission */}
                {canSetInfinite && (
                    // eslint-disable-next-line jsx-a11y/label-has-associated-control
                    <label htmlFor="clear-lifetime-checkbox" className="flex items-center gap-2 cursor-pointer select-none">
                        <Checkbox
                            id="clear-lifetime-checkbox"
                            checked={clearLifetime}
                            onCheckedChange={checked => {
                                setClearLifetime(checked === true);
                                if (error) setError(undefined);
                            }}
                        />
                        <span className="text-sm text-neutral-900 dark:text-neutral-100">Clear lifetime (no expiry)</span>
                    </label>
                )}

                {/* Mode toggle */}
                {!clearLifetime && (
                    <div className="space-y-3">
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="radio"
                                    name="lifetime-mode"
                                    value="duration"
                                    checked={mode === 'duration'}
                                    onChange={() => {
                                        setMode('duration');
                                        if (error) setError(undefined);
                                    }}
                                    className="text-brand-500 focus:ring-brand-500"
                                />
                                <span className="text-sm text-neutral-900 dark:text-neutral-100">Set by duration</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="radio"
                                    name="lifetime-mode"
                                    value="date"
                                    checked={mode === 'date'}
                                    onChange={() => {
                                        setMode('date');
                                        if (error) setError(undefined);
                                    }}
                                    className="text-brand-500 focus:ring-brand-500"
                                />
                                <span className="text-sm text-neutral-900 dark:text-neutral-100">Set by date</span>
                            </label>
                        </div>

                        {mode === 'duration' && (
                            <div className="space-y-3">
                                {/* Quick-select buttons */}
                                <div className="flex gap-2">
                                    {[
                                        { label: '14 days', d: 14 },
                                        { label: '1 month', d: 30 },
                                        { label: '3 months', d: 90 },
                                    ].map(opt => (
                                        <button
                                            key={opt.label}
                                            type="button"
                                            onClick={() => {
                                                setDays(String(opt.d));
                                                setHours('0');
                                                if (error) setError(undefined);
                                            }}
                                            className={`flex-1 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors
                                                ${
                                                    days === String(opt.d) && hours === '0'
                                                        ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900 dark:text-brand-200 dark:border-brand-400'
                                                        : 'border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:border-brand-300 hover:bg-brand-50/50 dark:hover:bg-brand-900/30'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label
                                            htmlFor="lifetime-days"
                                            className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2"
                                        >
                                            Days
                                        </label>
                                        <Input
                                            id="lifetime-days"
                                            type="number"
                                            min={0}
                                            value={days}
                                            onChange={e => {
                                                setDays(e.target.value);
                                                if (error) setError(undefined);
                                            }}
                                            placeholder="0"
                                            error={!!error}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label
                                            htmlFor="lifetime-hours"
                                            className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2"
                                        >
                                            Hours
                                        </label>
                                        <Input
                                            id="lifetime-hours"
                                            type="number"
                                            min={0}
                                            max={23}
                                            value={hours}
                                            onChange={e => {
                                                setHours(e.target.value);
                                                if (error) setError(undefined);
                                            }}
                                            placeholder="0"
                                            error={!!error}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {mode === 'date' && (
                            <div>
                                <label htmlFor="lifetime-date" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                                    Expiry date &amp; time <span className="text-base-error-600">*</span>
                                </label>
                                <Input
                                    id="lifetime-date"
                                    type="datetime-local"
                                    value={dateValue}
                                    onChange={e => {
                                        setDateValue(e.target.value);
                                        if (error) setError(undefined);
                                    }}
                                    error={!!error}
                                    aria-describedby={error ? 'lifetime-date-error' : undefined}
                                />
                            </div>
                        )}

                        {/* Zero-lifetime destructive warning */}
                        {showZeroLifetimeWarning && (
                            <Alert
                                variant="error"
                                message="Setting the lifetime to 0 will schedule this rule for immediate deletion. The rule and all associated replicas managed by it will be removed as soon as the reaper runs."
                            />
                        )}

                        {/* Short-lifetime informational warning */}
                        {showShortLifetimeWarning && (
                            <Alert
                                variant="warning"
                                message="The selected lifetime is very short (less than 1 hour). The rule will expire and be deleted very soon after confirmation."
                            />
                        )}

                        {error && (
                            <p id="lifetime-date-error" className="mt-1 text-sm text-base-error-600 dark:text-base-error-400">
                                {error}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </MutationDialog>
    );
};
