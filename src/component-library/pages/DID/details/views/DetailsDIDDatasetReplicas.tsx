import React, { useEffect, useRef, useState } from 'react';
import { DIDDatasetReplicasViewModel } from '@/lib/infrastructure/data/view-model/did';
import { DetailsDIDView, DetailsDIDProps } from '@/component-library/pages/DID/details/views/DetailsDIDView';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { AgGridReact } from 'ag-grid-react';
import { buildDiscreteFilterParams, DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';
import ProgressBar from '@/component-library/atoms/misc/ProgressBar';
import { ReplicaState } from '@/lib/core/entity/rucio';
import { ReplicaStateBadge } from '@/component-library/features/badges/DID/ReplicaStateBadge';
import { badgeCellClasses, badgeCellWrapperStyle } from '@/component-library/features/table/cells/badge-cell';
import { ClickableCell } from '@/component-library/features/table/cells/ClickableCell';

const ProgressBarCell = ({ data }: { data: DIDDatasetReplicasViewModel }) => {
    let percentage: number = 0;
    if (data.length > 0) {
        percentage = (data.available_files / data.length) * 100;
    }

    const getPercentageText = () => {
        const baseText = `${data.available_files} files out of ${data.length}`;
        if (data.length === 0) {
            return baseText;
        }
        return `${baseText} (${percentage.toFixed(2)}%)`;
    };

    return (
        <div className="flex flex-col w-full h-full justify-center space-y-2">
            <ProgressBar percentage={percentage} />
            <span className="text-ellipsis text-sm text-neutral-900 dark:text-neutral-100">{getPercentageText()}</span>
        </div>
    );
};

const StateCell = ({ data, className }: { data: DIDDatasetReplicasViewModel; className: string }) => {
    const state = data.availability ? ReplicaState.AVAILABLE : ReplicaState.UNAVAILABLE;
    return <ReplicaStateBadge value={state} className={`${className} h-7`} />;
};

const ClickableRSE = (props: { value: string }) => {
    return <ClickableCell href={`/rse/list?expression=${props.value}&autoSearch=true`}>{props.value}</ClickableCell>;
};

const ReplicaStateDisplayNames = {
    [ReplicaState.AVAILABLE]: 'Available',
    [ReplicaState.UNAVAILABLE]: 'Unavailable',
};

export const DetailsDIDDatasetReplicas: DetailsDIDView = ({ scope, name }: DetailsDIDProps) => {
    const { gridApi, onGridReady, streamingHook, startStreaming, stopStreaming } = useTableStreaming<DIDDatasetReplicasViewModel>();
    const gridRef = useRef<AgGridReact>(null);

    useEffect(() => {
        if (gridApi) {
            const url = '/api/feature/list-dataset-replicas?' + new URLSearchParams({ scope, name });
            startStreaming(url);
        }
    }, [gridApi]);

    const [columnDefs] = useState([
        {
            headerName: 'RSE',
            field: 'rse',
            flex: 3,
            pinned: 'left' as const,
            cellRenderer: ClickableRSE,
            filter: true,
            filterParams: DefaultTextFilterParams,
            cellStyle: {
                ...badgeCellWrapperStyle,
                alignItems: 'center',
            },
        },
        {
            headerName: 'State',
            field: 'availability',
            flex: 1,
            cellStyle: {
                ...badgeCellWrapperStyle,
                alignItems: 'center',
            },
            cellRendererParams: {
                className: badgeCellClasses,
            },
            cellRenderer: StateCell,
            filter: true,
            filterParams: buildDiscreteFilterParams(
                Object.values(ReplicaStateDisplayNames),
                Object.values(ReplicaState).filter(state => state === ReplicaState.AVAILABLE || state === ReplicaState.UNAVAILABLE),
            ),
        },
        {
            headerName: 'Replication Progress',
            flex: 3,
            sortable: false,
            cellRenderer: ProgressBarCell,
            cellStyle: {
                ...badgeCellWrapperStyle,
                alignItems: 'center',
            },
        },
    ]);

    return <StreamedTable columnDefs={columnDefs} tableRef={gridRef} onGridReady={onGridReady} streamingHook={streamingHook} rowHeight={75} />;
};
