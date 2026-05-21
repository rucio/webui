'use client';

import * as React from 'react';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { Input } from '@/component-library/atoms/form/input';
import { DateInput } from '@/component-library/atoms/legacy/input/DateInput/DateInput';
import { HiExclamationCircle } from 'react-icons/hi';

export interface DeclareBadReplicaTarget {
    scope: string;
    name: string;
    rse: string;
}

export interface DeclareBadReplicaDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /**
     * Replicas to be declared bad. Empty array means no selection (dialog closed
     * caller-side). Length 1 renders the single-row layout; length > 1 renders
     * the bulk summary grouped by RSE.
     */
    targets: DeclareBadReplicaTarget[];
    onConfirm: (reason: string, expiresAt: string | null) => void;
    loading?: boolean;
}

/**
 * Confirmation dialog for declaring one or more suspicious replicas as bad.
 * Reason is required; expires_at is optional (null = no expiry).
 *
 * For bulk selections spanning multiple RSEs the caller is expected to send
 * one POST per RSE group (Rucio's `/replicas/bad/dids` takes a single RSE
 * per call); the dialog itself just collects the shared reason + expiry.
 */
export const DeclareBadReplicaDialog: React.FC<DeclareBadReplicaDialogProps> = ({
    open,
    onOpenChange,
    targets,
    onConfirm,
    loading = false,
}) => {
    const [reason, setReason] = React.useState('');
    const [expiresAt, setExpiresAt] = React.useState<Date | null>(null);

    // Reset form whenever the dialog opens for a new selection. Keyed on the
    // sorted target list so re-opening the same selection doesn't clobber input.
    const selectionKey = React.useMemo(
        () =>
            targets
                .map(t => `${t.rse}::${t.scope}:${t.name}`)
                .sort()
                .join('|'),
        [targets],
    );
    React.useEffect(() => {
        if (open) {
            setReason('');
            setExpiresAt(null);
        }
    }, [open, selectionKey]);

    const trimmedReason = reason.trim();
    const isValid = trimmedReason.length > 0 && targets.length > 0;

    const handleSubmit = () => {
        if (!isValid) return;
        // Rucio's parser expects %Y-%m-%dT%H:%M:%S without fractional seconds.
        const expiresAtStr = expiresAt ? expiresAt.toISOString().replace(/\.\d{3}Z$/, '') : null;
        onConfirm(trimmedReason, expiresAtStr);
    };

    const byRse = React.useMemo(() => {
        const map = new Map<string, DeclareBadReplicaTarget[]>();
        for (const t of targets) {
            const arr = map.get(t.rse) ?? [];
            arr.push(t);
            map.set(t.rse, arr);
        }
        return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
    }, [targets]);

    const isBulk = targets.length > 1;
    const single = targets.length === 1 ? targets[0] : null;

    return (
        <MutationDialog
            open={open}
            onOpenChange={onOpenChange}
            title={isBulk ? 'Declare Replicas Bad' : 'Declare Replica Bad'}
            description={
                isBulk
                    ? `Mark ${targets.length} replicas across ${byRse.length} RSE${byRse.length !== 1 ? 's' : ''} as bad.`
                    : 'Mark this replica as bad on its RSE. Rucio will schedule re-transfer or removal.'
            }
            onSubmit={handleSubmit}
            submitLabel={isBulk ? `Declare ${targets.length} Bad` : 'Declare Bad'}
            submitVariant="error"
            loading={loading}
            disabled={!isValid}
        >
            <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-md bg-base-error-50 dark:bg-base-error-950 border border-base-error-200 dark:border-base-error-800 p-3">
                    <HiExclamationCircle
                        className="h-5 w-5 shrink-0 text-base-error-600 dark:text-base-error-400 mt-0.5"
                        aria-hidden="true"
                    />
                    <p className="text-sm text-base-error-900 dark:text-base-error-100">
                        {isBulk
                            ? 'Each replica will be marked bad on its RSE. Rucio will treat them as unavailable and may schedule re-transfer or deletion. This cannot be undone from the UI.'
                            : 'This marks the replica as bad on its RSE. Rucio will treat it as unavailable and may schedule re-transfer or deletion. This cannot be undone from the UI.'}
                    </p>
                </div>

                {single && (
                    <div className="rounded-md bg-neutral-100 dark:bg-neutral-800 p-3 space-y-2">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">Scope</span>
                            <span className="font-mono text-sm font-medium text-neutral-900 dark:text-neutral-100 break-all text-right">
                                {single.scope}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">Name</span>
                            <span className="font-mono text-sm font-medium text-neutral-900 dark:text-neutral-100 break-all text-right max-w-[70%]">
                                {single.name}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">RSE</span>
                            <span className="font-mono text-sm font-medium text-neutral-900 dark:text-neutral-100 break-all text-right">
                                {single.rse}
                            </span>
                        </div>
                    </div>
                )}

                {isBulk && (
                    <div className="rounded-md bg-neutral-100 dark:bg-neutral-800 p-3 space-y-2 max-h-48 overflow-y-auto">
                        <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">By RSE</p>
                        <ul className="space-y-1">
                            {byRse.map(([rse, replicas]) => (
                                <li key={rse} className="flex items-center justify-between gap-3">
                                    <span className="font-mono text-sm text-neutral-900 dark:text-neutral-100 break-all">{rse}</span>
                                    <span className="text-sm text-neutral-600 dark:text-neutral-400 shrink-0">
                                        {replicas.length} replica{replicas.length !== 1 ? 's' : ''}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div>
                    <label
                        htmlFor="declare-bad-reason"
                        className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block"
                    >
                        Reason <span className="text-base-error-600">*</span>
                    </label>
                    <Input
                        id="declare-bad-reason"
                        className="w-full"
                        value={reason}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReason(e.target.value)}
                        placeholder="e.g. lost, source unreachable"
                        aria-required
                        aria-invalid={!isValid && reason.length > 0}
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label
                            htmlFor="declare-bad-expires-at"
                            className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                        >
                            Expires at <span className="text-neutral-500">(optional)</span>
                        </label>
                        {expiresAt && (
                            <button
                                type="button"
                                onClick={() => setExpiresAt(null)}
                                className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-500 rounded"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                    <DateInput
                        id="declare-bad-expires-at"
                        onchange={(date: Date) => setExpiresAt(date)}
                        initialdate={expiresAt ?? undefined}
                        placeholder="No expiry"
                    />
                </div>
            </div>
        </MutationDialog>
    );
};
