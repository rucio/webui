'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { FormField, describedBy, selectClassName } from '@/component-library/features/mutations/FormField';
import { Input } from '@/component-library/atoms/form/input';
import { Checkbox } from '@/component-library/atoms/form/checkbox';
import { Alert } from '@/component-library/atoms/feedback/Alert';
import { AccountLimitLocality } from '@/lib/core/entity/account';

/** Base 10 sizes, matching formatFileSize and Rucio quotas. */
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
                <FormField id="limit-locality" label="Scope" required>
                    <select
                        id="limit-locality"
                        className={selectClassName}
                        value={locality}
                        disabled={isEdit}
                        onChange={e => {
                            setLocality(e.target.value as AccountLimitLocality);
                            setRseExpression('');
                        }}
                    >
                        <option value="local">Local (one RSE)</option>
                        <option value="global">Global (RSE expression)</option>
                    </select>
                </FormField>
                {locality === 'local' ? (
                    <FormField id="limit-rse" label="RSE" required>
                        <select
                            id="limit-rse"
                            className={selectClassName}
                            value={rseExpression}
                            disabled={isEdit}
                            onChange={e => setRseExpression(e.target.value)}
                        >
                            <option value="">Select an RSE</option>
                            {(rses.includes(rseExpression) || !rseExpression ? rses : [rseExpression, ...rses]).map(r => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
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
                    <select
                        aria-label="Unit"
                        className={`${selectClassName} w-24`}
                        value={unit}
                        disabled={unlimited}
                        onChange={e => setUnit(e.target.value as LimitUnit)}
                    >
                        {Object.keys(LIMIT_UNITS).map(u => (
                            <option key={u} value={u}>
                                {u}
                            </option>
                        ))}
                    </select>
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
