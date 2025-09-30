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
        <div className="flex flex-col space-y-3 w-full grow">
            <Heading text="RSEs" />
            <RSESearchPanel
                onSearch={onSearch}
                stopStreaming={stopStreaming}
                isRunning={streamingHook.status === StreamingStatus.RUNNING}
                initialExpression={props.initialExpression}
                autoSearch={props.autoSearch}
                gridApi={gridApi || undefined}
            />
            <ListRSETable streamingHook={streamingHook} onGridReady={onGridReady} />
        </div>
    );
};
