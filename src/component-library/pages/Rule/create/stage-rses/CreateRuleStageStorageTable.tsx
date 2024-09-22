import React, { useEffect, useRef, useState } from 'react';
import { StreamingStatus, UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';
import { ColSpanParams, GridReadyEvent, ICellRendererParams, SelectionChangedEvent, ValueFormatterParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { formatFileSize } from '@/component-library/features/utils/text-formatters';
import { RSEAccountUsageLimitViewModel, RSEAccountUsageViewModel } from '@/lib/infrastructure/data/view-model/rse';

type StageStorageTableProps = {
    streamingHook: UseStreamReader<RSEAccountUsageViewModel>;
    onSelectionChanged: (event: SelectionChangedEvent) => void;
    onGridReady: (event: GridReadyEvent) => void;
    totalDataSize: number;
    selectedItems: RSEAccountUsageLimitViewModel[];
};

const WarningCell = (props: { value: string; warn: boolean }) => {
    const textColor = props.warn ? 'text-base-error-500 font-semibold' : '';
    return <span className={textColor}>{props.value}</span>;
};

export const CreateRuleStageStorageTable: React.FC<StageStorageTableProps> = ({ ...props }) => {
    const tableRef = useRef<AgGridReact<RSEAccountUsageLimitViewModel>>(null);

    // TODO: these should be calculated on the client side
    const [columnDefs] = useState([
        {
            headerName: 'Name',
            field: 'rse',
            minWidth: 250,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'Quota',
            field: 'bytes_limit',
            cellRenderer: (params: ICellRendererParams) => {
                const item: RSEAccountUsageLimitViewModel = params.data;
                const value = params.value < 0 ? 'No quota' : formatFileSize(params.value);
                return <WarningCell warn={!item.has_quota} {...params} value={value} />;
            },
            colSpan: (params: ColSpanParams) => {
                // Take up all the subsequent columns
                return params.data.bytes_limit < 0 ? 3 : 1;
            },
            minWidth: 200,
            maxWidth: 200,
        },
        {
            headerName: 'Total usage',
            // TODO: for some reason total expected usage doesn't include the passed DIDs...
            field: 'used_bytes',
            cellRenderer: (params: ICellRendererParams) => {
                const item: RSEAccountUsageLimitViewModel = params.data;
                // Aggregating usage
                const value = formatFileSize(item.used_bytes + props.totalDataSize);
                return <WarningCell warn={!item.has_quota} {...params} value={value} />;
            },
            minWidth: 200,
            maxWidth: 200,
        },
        {
            headerName: 'Remaining',
            field: 'bytes_remaining',
            cellRenderer: (params: ICellRendererParams) => {
                const item: RSEAccountUsageLimitViewModel = params.data;
                const value = formatFileSize(item.bytes_remaining - props.totalDataSize);
                return <WarningCell warn={!item.has_quota} {...params} value={value} />;
            },
            minWidth: 200,
            maxWidth: 200,
        },
    ]);

    const onGridReady = (event: GridReadyEvent) => {
        props.onGridReady(event);
        event.api.applyColumnState({
            state: [
                {
                    colId: 'bytes_remaining',
                    sort: 'desc',
                },
            ],
        });
    };

    useEffect(() => {
        if (props.streamingHook.status === StreamingStatus.STOPPED) {
            const updateSelection = () => {
                tableRef.current?.api?.forEachNode(node => {
                    const model: RSEAccountUsageLimitViewModel = node.data;
                    const selected = props.selectedItems.some(element => element.rse === model.rse);
                    node.setSelected(selected);
                });
            };

            setTimeout(updateSelection, 100);
        }
    }, [props.streamingHook.status]);

    return <StreamedTable columnDefs={columnDefs} rowSelection="multiple" tableRef={tableRef} {...props} onGridReady={onGridReady} />;
};
