'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { Input } from '@/component-library/atoms/form/input';
import { Checkbox } from '@/component-library/atoms/form/checkbox';
import { HiInformationCircle } from 'react-icons/hi';

export interface UpdateLifetimeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ruleId: string;
    currentExpiresAt?: string | null;
    onConfirm: (lifetimeSeconds: number | null) => void;
    loading?: boolean;
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
}) => {
    const [mode, setMode] = useState<InputMode>('duration');
    const [clearLifetime, setClearLifetime] = useState(false);
    const [dateValue, setDateValue] = useState('');
    const [days, setDays] = useState('');
    const [hours, setHours] = useState('');
    const [error, setError] = useState<string | undefined>();

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

    const handleSubmit = () => {
        if (clearLifetime) {
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
            if (diffSeconds < 3600) {
                setError('The date must be at least 1 hour in the future');
                return;
            }
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
            const totalHours = parsedDays * 24 + parsedHours;
            if (totalHours < 1) {
                setError('Minimum lifetime is 1 hour');
                return;
            }
            setError(undefined);
            onConfirm(totalHours * 3600);
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
                        Tips: Setting the lifetime controls when this rule expires and is deleted. You can extend, shorten, or clear the lifetime
                        entirely. Minimum lifetime is 1 hour.
                    </p>
                </div>

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

                {/* Clear lifetime checkbox */}
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
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
                                                ${days === String(opt.d) && hours === '0'
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
                                    <label htmlFor="lifetime-days" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
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
                                    <label htmlFor="lifetime-hours" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
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
