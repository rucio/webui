'use client';

import React, { ChangeEvent, useCallback, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { HiOutlineBan, HiInformationCircle } from 'react-icons/hi';
import { HiChevronDown } from 'react-icons/hi2';
import { cn } from '@/component-library/utils';
import { SuspiciousReplicaViewModel, DeclareBadReplicasViewModel } from '@/lib/infrastructure/data/view-model/replica';
import { StreamingStatus } from '@/lib/infrastructure/hooks/useStreamReader';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { Button } from '@/component-library/atoms/form/button';
import { Input } from '@/component-library/atoms/form/input';
import { DateInput } from '@/component-library/atoms/legacy/input/DateInput/DateInput';
import { SearchButton } from '@/component-library/features/search/SearchButton';
import { SuspiciousReplicasTable } from '@/component-library/pages/Replica/suspicious/SuspiciousReplicasTable';
import { DeclareBadReplicaDialog, DeclareBadReplicaTarget } from '@/component-library/features/mutations/DeclareBadReplicaDialog';
import { useToast } from '@/lib/infrastructure/hooks/useToast';

type SearchFilters = {
    rseExpression: string;
    youngerThan?: Date;
    nattempts: string;
};

type ListSuspiciousReplicasProps = {
    initialData?: SuspiciousReplicaViewModel[];
};

function FilterField({
    children,
    label,
    htmlFor,
    className,
}: {
    children: React.ReactNode;
    label: string;
    htmlFor: string;
    className?: string;
}) {
    return (
        <div className={cn('flex-1', className)}>
            <label htmlFor={htmlFor} className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block whitespace-nowrap">
                {label}
            </label>
            {children}
        </div>
    );
}

const getDefaultYoungerThan = (): Date => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d;
};

const toTarget = (r: SuspiciousReplicaViewModel): DeclareBadReplicaTarget => ({
    scope: r.scope,
    name: r.name,
    rse: r.rse,
});

export const ListSuspiciousReplicas = (props: ListSuspiciousReplicasProps) => {
    const [filters, setFilters] = useState<SearchFilters>({
        rseExpression: '',
        youngerThan: getDefaultYoungerThan(),
        nattempts: '10',
    });

    const { onGridReady, streamingHook, startStreaming, stopStreaming } = useTableStreaming<SuspiciousReplicaViewModel>(props.initialData);
    const { toast } = useToast();

    // Selection: rows currently checked in the table.
    const [selectedReplicas, setSelectedReplicas] = useState<DeclareBadReplicaTarget[]>([]);
    // Dialog state: targets is non-empty when the dialog is open.
    const [declareBadTargets, setDeclareBadTargets] = useState<DeclareBadReplicaTarget[]>([]);
    const declareBadOpen = declareBadTargets.length > 0;

    // Stable refs so the polling interval / mutation callbacks always read the latest values.
    const filtersRef = useRef(filters);
    filtersRef.current = filters;
    const startStreamingRef = useRef(startStreaming);
    startStreamingRef.current = startStreaming;

    const handleFiltersChange = (newFilters: Partial<SearchFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const buildSearchUrl = useCallback((searchFilters: SearchFilters): string => {
        const params = new URLSearchParams();
        if (searchFilters.rseExpression) {
            params.append('rse_expression', searchFilters.rseExpression);
        }
        if (searchFilters.youngerThan) {
            // Rucio's parser uses datetime.strptime with `%Y-%m-%dT%H:%M:%S` — toISOString()
            // adds `.000Z` which Rucio rejects with HTTP 500, so we strip it.
            params.append('younger_than', searchFilters.youngerThan.toISOString().replace(/\.\d{3}Z$/, ''));
        }
        const nattempts = parseInt(searchFilters.nattempts, 10);
        // Rucio's filter is exclusive (`cnt > nattempts`), so 0 is meaningful
        // (matches every replica with at least one recorded suspicion).
        if (!isNaN(nattempts) && nattempts >= 0) {
            params.append('nattempts', nattempts.toString());
        }
        return `/api/feature/list-suspicious-replicas?${params.toString()}`;
    }, []);

    const onSearch = (event: React.SyntheticEvent) => {
        event.preventDefault();
        startStreaming(buildSearchUrl(filters));
    };

    const onStop = (event: React.SyntheticEvent) => {
        event.preventDefault();
        stopStreaming();
    };

    /**
     * Bulk-friendly mutation: groups the supplied targets by RSE (Rucio's
     * `/replicas/bad/dids` takes one RSE per call) and fires one POST per
     * group. Returns aggregated success/notDeclared counts so the toast
     * summary stays accurate for both single-row and bulk submissions.
     */
    const declareBadMutation = useMutation({
        mutationFn: async (input: { targets: DeclareBadReplicaTarget[]; reason: string; expiresAt: string | null }) => {
            const groups = new Map<string, DeclareBadReplicaTarget[]>();
            for (const t of input.targets) {
                const arr = groups.get(t.rse) ?? [];
                arr.push(t);
                groups.set(t.rse, arr);
            }
            const results = await Promise.all(
                Array.from(groups.entries()).map(async ([rse, replicas]) => {
                    const res = await fetch('/api/feature/declare-bad-replicas', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            dids: replicas.map(r => ({ scope: r.scope, name: r.name })),
                            rse,
                            reason: input.reason,
                            expiresAt: input.expiresAt,
                        }),
                    });
                    const vm: DeclareBadReplicasViewModel = await res.json();
                    if (!res.ok || vm.status !== 'success') {
                        throw vm;
                    }
                    return { rse, requested: replicas.length, vm };
                }),
            );
            return results;
        },
        onSuccess: results => {
            setDeclareBadTargets([]);
            setSelectedReplicas([]);
            const requested = results.reduce((acc, r) => acc + r.requested, 0);
            const refused = results.reduce((acc, r) => acc + (r.vm.notDeclared?.length ?? 0), 0);
            const accepted = requested - refused;
            const rseCount = results.length;

            if (refused === 0) {
                toast({
                    variant: 'success',
                    title: requested === 1 ? 'Replica declared bad' : `${accepted} replicas declared bad`,
                    description:
                        rseCount > 1
                            ? `Across ${rseCount} RSEs.`
                            : results[0]
                              ? `On ${results[0].rse}.`
                              : undefined,
                });
            } else {
                toast({
                    variant: 'warning',
                    title: `${accepted} of ${requested} declared bad`,
                    description: `${refused} replica${refused !== 1 ? 's were' : ' was'} refused by Rucio.`,
                });
            }
            // Refresh so newly-bad replicas drop out of the suspicious list.
            startStreamingRef.current(buildSearchUrl(filtersRef.current));
        },
        onError: (error: DeclareBadReplicasViewModel) => {
            toast({
                variant: 'error',
                title: 'Failed to declare replicas bad',
                description: error?.message || 'The Rucio server rejected the request.',
            });
        },
    });

    const onDeclareBad = useCallback((replica: SuspiciousReplicaViewModel) => {
        setDeclareBadTargets([toTarget(replica)]);
    }, []);

    const onBulkDeclareBad = () => {
        if (selectedReplicas.length === 0) return;
        setDeclareBadTargets(selectedReplicas);
    };

    const onDeclareBadConfirm = (reason: string, expiresAt: string | null) => {
        if (declareBadTargets.length === 0) return;
        declareBadMutation.mutate({ targets: declareBadTargets, reason, expiresAt });
    };

    const onSelectionChanged = useCallback((rows: SuspiciousReplicaViewModel[]) => {
        setSelectedReplicas(rows.filter(r => r.status === 'success').map(toTarget));
    }, []);

    const isRunning = streamingHook.status === StreamingStatus.RUNNING;
    const selectedCount = selectedReplicas.length;

    const [isTipsOpen, setIsTipsOpen] = useState(false);

    return (
        <div className="flex flex-col space-y-6 w-full">
            {/* Tips & suggestions — collapsible info banner. Page-local so the
                content stays specific to suspicious-replicas workflows. */}
            <div className="rounded-md bg-base-info-100 dark:bg-base-info-900 text-sm text-base-info-700 dark:text-base-info-200">
                <button
                    type="button"
                    className="flex w-full items-center gap-2 p-3 text-left"
                    onClick={() => setIsTipsOpen(prev => !prev)}
                    aria-expanded={isTipsOpen}
                    aria-controls="suspicious-replicas-tips"
                >
                    <HiInformationCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="font-medium flex-1">Tips & suggestions</span>
                    <HiChevronDown
                        className={cn('h-4 w-4 shrink-0 transition-transform duration-200', isTipsOpen && 'rotate-180')}
                        aria-hidden="true"
                    />
                </button>
                {isTipsOpen && (
                    <ul id="suspicious-replicas-tips" className="list-disc list-inside space-y-1 px-3 pb-3 pl-10">
                        <li>
                            <span className="font-medium">Suspicious vs. bad:</span>  A replica is &quot;suspicious&quot; when Rucio has
                            recorded one or more failed access attempts against it. Declaring it bad transitions Rucio to schedule
                            re-transfer or removal.
                        </li>
                        <li>
                            <span className="font-medium">Min Attempts Threshold:</span> Rucio applies this filter strictly. A replica
                            with <code className="font-mono">cnt = 3</code> is returned only when the threshold is{' '}
                            <code className="font-mono">0</code>, <code className="font-mono">1</code>, or{' '}
                            <code className="font-mono">2</code>. Set the threshold to <code className="font-mono">0</code> to see every
                            recorded suspicion.
                        </li>
                        <li>
                            <span className="font-medium">RSE Expression:</span> accepts Rucio expressions such as{' '}
                            <code className="font-mono">tier=1</code> or a literal RSE name to narrow results.
                        </li>
                        <li>
                            <span className="font-medium">Bulk Declare Bad:</span>  Tick checkboxes on multiple rows to enable the bulk
                            toolbar.
                        </li>
                        <li>
                            <span className="font-medium">Irreversible from the UI:</span> declaring a replica bad cannot be undone here;
                            it can only be reverted server-side by an administrator.
                        </li>
                        <li>
                            <span className="font-medium">Navigation:</span> click an <span className="font-medium">RSE</span> cell to
                            open its detail page, or a <span className="font-medium">Name</span> cell to open the DID.
                        </li>
                        <li>
                            <span className="font-medium">Refresh:</span> the page re-fetches automatically after each successful
                            declare-bad. To pick up new server-side suspicions, click the search button.
                        </li>
                    </ul>
                )}
            </div>

            {/* Streaming status strip — visible only while a stream is in progress */}
            {isRunning && (
                <div
                    role="status"
                    aria-live="polite"
                    className="flex items-center gap-2 rounded-md bg-base-info-100 dark:bg-base-info-900 text-base-info-700 dark:text-base-info-200 px-3 py-2 text-sm"
                >
                    <HiInformationCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span>Loading results - data streams progressively and may take a moment to complete.</span>
                </div>
            )}

            {/* Filter Panel */}
            <div className="rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm p-6">
                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 items-end">
                    <div className="flex flex-col w-full space-y-4">
                        <div className="flex flex-col md:flex-row w-full gap-4">
                            <FilterField label="RSE Expression" htmlFor="suspicious-rse-expression">
                                <Input
                                    id="suspicious-rse-expression"
                                    className="w-full"
                                    value={filters.rseExpression}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleFiltersChange({ rseExpression: e.target.value })}
                                    onEnterKey={onSearch}
                                    placeholder="e.g. tier=1&type=DATADISK"
                                />
                            </FilterField>
                            <FilterField label="Younger Than" htmlFor="suspicious-younger-than">
                                <DateInput
                                    id="suspicious-younger-than"
                                    onchange={(date: Date) => handleFiltersChange({ youngerThan: date })}
                                    initialdate={filters.youngerThan}
                                    placeholder="Select date"
                                />
                            </FilterField>
                            <FilterField label="Min Attempts Threshold" htmlFor="suspicious-nattempts" className="md:max-w-[200px]">
                                <Input
                                    id="suspicious-nattempts"
                                    className="w-full"
                                    type="number"
                                    value={filters.nattempts}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleFiltersChange({ nattempts: e.target.value })}
                                    onEnterKey={onSearch}
                                    placeholder="0"
                                    min={0}
                                    max={400}
                                />
                            </FilterField>
                        </div>
                    </div>
                    <SearchButton className="sm:w-48 shrink-0" isRunning={isRunning} onStop={onStop} onSearch={onSearch} />
                </div>
            </div>

            {/* Bulk actions toolbar — visible only when rows are selected */}
            {selectedCount > 0 && (
                <div className="flex items-center gap-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-4 py-3">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {selectedCount} replica{selectedCount !== 1 ? 's' : ''} selected
                    </span>
                    <div className="flex gap-2 ml-auto">
                        <Button variant="error" size="sm" onClick={onBulkDeclareBad}>
                            <HiOutlineBan className="mr-1.5 h-4 w-4" aria-hidden="true" />
                            Declare Bad Selected
                        </Button>
                    </div>
                </div>
            )}

            {/* Results Table */}
            <div className="rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden h-[calc(100vh-24rem)]">
                <SuspiciousReplicasTable
                    streamingHook={streamingHook}
                    onGridReady={onGridReady}
                    onDeclareBad={onDeclareBad}
                    onSelectionChanged={onSelectionChanged}
                />
            </div>

            <DeclareBadReplicaDialog
                open={declareBadOpen}
                onOpenChange={open => {
                    if (!open) setDeclareBadTargets([]);
                }}
                targets={declareBadTargets}
                onConfirm={onDeclareBadConfirm}
                loading={declareBadMutation.isPending}
            />
        </div>
    );
};
