'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { FormField, describedBy } from '@/component-library/features/mutations/FormField';
import { FieldSelect } from '@/component-library/features/mutations/FieldSelect';
import { Input } from '@/component-library/atoms/form/input';
import { Checkbox } from '@/component-library/atoms/form/checkbox';
import { Alert } from '@/component-library/atoms/feedback/Alert';
import { AccountLimitLocality } from '@/lib/core/entity/account';

/** Base 10 sizes, matching formatFileSize and the Rucio CLI's sizefmt. */
export const LIMIT_UNITS = { GB: 1e9, TB: 1e12, PB: 1e15 } as const;
export type LimitUnit = keyof typeof LIMIT_UNITS;

export interface SetAccountLimitValues {
    locality: AccountLimitLocality;
    rseExpression: string;
    /** -1 means unlimited. */
    bytes: number;
}

export interface SetAccountLimitDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    account: string;
    /** RSE options for local limits. */
    rses: string[];
    /** The RSE options are still loading. */
    rsesLoading?: boolean;
    /** Why the RSE options could not be loaded. */
    rsesError?: string;
    /** Edit mode: locality and RSE are locked. */
    initial?: SetAccountLimitValues;
    onSubmit: (values: SetAccountLimitValues) => void;
    loading?: boolean;
    /** Server error, rendered inside the dialog. The dialog stays open. */
    error?: string;
}

const splitBytes = (bytes: number): { amount: string; unit: LimitUnit } => {
    const units = Object.keys(LIMIT_UNITS) as LimitUnit[];
    for (const unit of [...units].reverse()) {
        if (bytes >= LIMIT_UNITS[unit] && bytes % LIMIT_UNITS[unit] === 0) return { amount: String(bytes / LIMIT_UNITS[unit]), unit };
    }
    return { amount: String(bytes / LIMIT_UNITS.GB), unit: 'GB' };
};

/** Dialog for setting (or editing) a local or global quota of an account. */
export const SetAccountLimitDialog: React.FC<SetAccountLimitDialogProps> = ({
    open,
    onOpenChange,
    account,
    rses,
    rsesLoading = false,
    rsesError,
    initial,
    onSubmit,
    loading = false,
    error,
}) => {
    const isEdit = !!initial;
    const [locality, setLocality] = useState<AccountLimitLocality>('local');
    const [rseExpression, setRseExpression] = useState('');
    const [amount, setAmount] = useState('');
    const [unit, setUnit] = useState<LimitUnit>('TB');
    const [unlimited, setUnlimited] = useState(false);

    useEffect(() => {
        if (!open) return;
        setLocality(initial?.locality ?? 'local');
        setRseExpression(initial?.rseExpression ?? '');
        if (initial && initial.bytes < 0) {
            setUnlimited(true);
            setAmount('');
            setUnit('TB');
        } else if (initial) {
            setUnlimited(false);
            const parts = splitBytes(initial.bytes);
            setAmount(parts.amount);
            setUnit(parts.unit);
        } else {
            setUnlimited(false);
            setAmount('');
            setUnit('TB');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const numeric = Number(amount);
    const amountError = !unlimited && amount !== '' && (!Number.isFinite(numeric) || numeric < 0) ? 'Enter a number of zero or more' : undefined;
    const invalid = !rseExpression.trim() || !!amountError || (!unlimited && amount === '');
    // Explain an empty RSE select instead of leaving it silently empty.
    const rseHint = isEdit || rsesError ? undefined : rsesLoading ? 'Loading RSEs...' : rses.length === 0 ? 'No RSEs found.' : undefined;

    const handleSubmit = () => {
        if (invalid) return;
        onSubmit({
            locality,
            rseExpression: rseExpression.trim(),
            bytes: unlimited ? -1 : Math.round(numeric * LIMIT_UNITS[unit]),
        });
    };

    return (
        <MutationDialog
            open={open}
            onOpenChange={onOpenChange}
            title={isEdit ? 'Edit limit' : 'Set limit'}
            description={`Quota for ${account}.`}
            onSubmit={handleSubmit}
            submitLabel={isEdit ? 'Save limit' : 'Set limit'}
            loading={loading}
            disabled={invalid}
        >
            <div className="space-y-4">
                {error && <Alert variant="error" message={error} />}
                <fieldset>
                    <legend className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                        Scope <span className="text-base-error-600">*</span>
                    </legend>
                    <div className="flex gap-4">
                        {(
                            [
                                ['local', 'Local (per RSE)'],
                                ['global', 'Global (per RSE expression)'],
                            ] as const
                        ).map(([value, label]) => (
                            <label key={value} className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="radio"
                                    name="limit-locality"
                                    value={value}
                                    checked={locality === value}
                                    disabled={isEdit}
                                    onChange={() => {
                                        setLocality(value);
                                        setRseExpression('');
                                    }}
                                    className="text-brand-500 focus:ring-brand-500"
                                />
                                <span className="text-sm text-neutral-900 dark:text-neutral-100">{label}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>
                {locality === 'local' ? (
                    <FormField id="limit-rse" label="RSE" required hint={rseHint} error={isEdit ? undefined : rsesError}>
                        <FieldSelect
                            id="limit-rse"
                            aria-describedby={describedBy('limit-rse', { hint: rseHint, error: isEdit ? undefined : rsesError })}
                            value={rseExpression}
                            disabled={isEdit}
                            onValueChange={setRseExpression}
                            placeholder="Select an RSE"
                            options={(rses.includes(rseExpression) || !rseExpression ? rses : [rseExpression, ...rses]).map(r => ({
                                value: r,
                                label: r,
                            }))}
                        />
                    </FormField>
                ) : (
                    <FormField id="limit-rse" label="RSE expression" required hint="For example tier=1&type=DATADISK">
                        <Input
                            id="limit-rse"
                            value={rseExpression}
                            disabled={isEdit}
                            onChange={e => setRseExpression(e.target.value)}
                            autoComplete="off"
                            aria-describedby={describedBy('limit-rse', { hint: true })}
                        />
                    </FormField>
                )}
                <div className="flex items-end gap-2">
                    <div className="flex-1">
                        <FormField id="limit-amount" label="Limit" required={!unlimited} error={amountError}>
                            <Input
                                id="limit-amount"
                                type="number"
                                min={0}
                                step="any"
                                value={amount}
                                disabled={unlimited}
                                onChange={e => setAmount(e.target.value)}
                                error={!!amountError}
                                aria-describedby={describedBy('limit-amount', { error: amountError })}
                            />
                        </FormField>
                    </div>
                    <FieldSelect
                        id="limit-unit"
                        aria-label="Unit"
                        className="w-24"
                        value={unit}
                        disabled={unlimited}
                        onValueChange={v => setUnit(v as LimitUnit)}
                        options={Object.keys(LIMIT_UNITS).map(u => ({ value: u, label: u }))}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox id="limit-unlimited" checked={unlimited} onCheckedChange={v => setUnlimited(v === true)} />
                    <label htmlFor="limit-unlimited" className="text-sm text-neutral-900 dark:text-neutral-100">
                        Unlimited
                    </label>
                </div>
            </div>
        </MutationDialog>
    );
};
