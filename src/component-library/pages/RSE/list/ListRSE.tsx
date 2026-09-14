'use client';

import { RSEViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { StreamingStatus } from '@/lib/infrastructure/hooks/useStreamReader';
import { ListRSETable } from '@/component-library/pages/RSE/list/ListRSETable';
import { Heading } from '@/component-library/atoms/misc/Heading';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { RSESearchPanel } from '@/component-library/features/search/RSESearchPanel';
import { useState } from 'react';
import { HiChevronDown, HiInformationCircle } from 'react-icons/hi2';
import { HiExternalLink } from 'react-icons/hi';
import { cn } from '@/component-library/utils';

type ListRSEProps = {
    initialExpression?: string;
    initialData?: RSEViewModel[];
    autoSearch?: boolean;
};

export const ListRSE = (props: ListRSEProps) => {
    const { onGridReady, streamingHook, startStreaming, stopStreaming, gridApi } = useTableStreaming<RSEViewModel>(props.initialData);

    const onSearch = (expression: string) => {
        startStreaming(`/api/feature/list-rses?rseExpression=${expression}`);
    };

    const [isTipsOpen, setIsTipsOpen] = useState(false);

    return (
        <div className="flex flex-col space-y-6 w-full">
            {/* Tips */}
            <div className="rounded-md bg-base-info-50 dark:bg-base-info-900 text-sm text-base-info-700 dark:text-base-info-200">
                <button
                    type="button"
                    className="flex w-full items-center gap-2 p-3 text-left"
                    onClick={() => setIsTipsOpen(prev => !prev)}
                    aria-expanded={isTipsOpen}
                >
                    <HiInformationCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="font-medium flex-1">Tips</span>
                    <HiChevronDown
                        className={cn('h-4 w-4 shrink-0 transition-transform duration-200', isTipsOpen && 'rotate-180')}
                        aria-hidden="true"
                    />
                </button>
                {isTipsOpen &&
                    <div>
                        <ul className="list-disc list-inside space-y-1 px-3 pl-10 pb-2">
                            <li>
                                <span className="font-medium">Purpose:</span> Allows to select a set of RSEs, by providing one or more terms which can be a single RSE name or a condition over the RSE attributes.
                            </li>
                            <li>
                                <span className="font-medium">Simple expressions:</span>
                                <ul className="list-decimal list-inside space-y-0.5 px-3 pl-5 py-1">
                                    <li>
                                        <code className="font-medium">*</code> lists all available RSEs,
                                    </li>
                                    <li>
                                        <code className="font-medium">type=SCRATCHDISK</code> shows RSEs of specific type,
                                    </li>
                                    <li>
                                        <code className="font-medium">freespace&gt;3000</code> shows RSEs that have more than 3000TB of free space.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <span className="font-medium">Operators:</span> Allows to connect terms via union |, intersection & or complementing \.
                            </li>
                        </ul>
                        <a
                            href="https://rucio.github.io/documentation/started/concepts/rse_expressions"
                            target="_blank"
                            className={cn(
                                'pl-9 pb-3',
                                'inline-flex items-center gap-1',
                                'font-medium underline underline-offset-2',
                                'hover:opacity-80 transition-opacity',
                                'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 rounded',
                            )}
                        >
                            Learn more
                            <HiExternalLink className="h-3 w-3 mr-1" aria-hidden="true" />
                        </a>
                        about RSEs expressions.
                    </div>
                }
            </div>

            {/* Search Panel */}
            <div className="rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm p-6">
                <RSESearchPanel
                    onSearch={onSearch}
                    stopStreaming={stopStreaming}
                    isRunning={streamingHook.status === StreamingStatus.RUNNING}
                    initialExpression={props.initialExpression}
                    autoSearch={props.autoSearch}
                    gridApi={gridApi || undefined}
                />
            </div>

            {/* Results Section */}
            <div className="rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden h-[calc(100vh-20rem)]">
                <ListRSETable streamingHook={streamingHook} onGridReady={onGridReady} />
            </div>
        </div>
    );
};
