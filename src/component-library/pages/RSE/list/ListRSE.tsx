'use client';

import { RSEViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { StreamingStatus } from '@/lib/infrastructure/hooks/useStreamReader';
import { ListRSETable } from '@/component-library/pages/RSE/list/ListRSETable';
import { Heading } from '@/component-library/atoms/misc/Heading';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { RSESearchPanel } from '@/component-library/features/search/RSESearchPanel';

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

    return (
        <div className="flex flex-col space-y-6 w-full">
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
