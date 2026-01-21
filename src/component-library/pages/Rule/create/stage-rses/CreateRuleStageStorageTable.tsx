import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StreamingStatus, UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';
import { ColSpanParams, GridReadyEvent, ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { formatFileSize } from '@/component-library/features/utils/text-formatters';
import { RSEAccountUsageLimitViewModel, RSEAccountUsageViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { ClickableCell } from '@/component-library/features/table/cells/ClickableCell';
import { SelectableCell } from '@/component-library/features/table/cells/selection-cells';

interface SelectableRSEViewModel extends RSEAccountUsageLimitViewModel {
    selected?: boolean;
}

type StageStorageTableProps = {
    streamingHook: UseStreamReader<RSEAccountUsageViewModel>;
    addRSE: (item: SelectableRSEViewModel) => void;
    removeRSE: (item: SelectableRSEViewModel) => void;
    onGridReady: (event: GridReadyEvent) => void;
    totalDataSize: number;
    selectedItems: RSEAccountUsageLimitViewModel[];
};

const WarningCell = (props: { value: string; warn: boolean }) => {
    const textColor = props.warn ? 'text-base-error-500 font-semibold' : '';
    return <span className={textColor}>{props.value}</span>;
};

const ClickableRSE = (props: { value: string }) => {
    return <ClickableCell href={`/rse/list?expression=${props.value}&autoSearch=true`}>{props.value}</ClickableCell>;
};

export const CreateRuleStageStorageTable: React.FC<StageStorageTableProps> = ({ addRSE, removeRSE, selectedItems, ...props }) => {
    const tableRef = useRef<AgGridReact<SelectableRSEViewModel>>(null);

    const [columnDefs] = useState([
        {
            headerName: 'Name',
            field: 'rse',
            minWidth: 250,
            flex: 1,
            pinned: 'left' as const,
            cellRenderer: (params: ICellRendererParams<SelectableRSEViewModel>) => {
                const rse = params.data!;
                // Use RSE name for comparison since rse_id is undefined from the API
                const isSelectedInArray = selectedItems.some(item => item.rse === rse.rse);
                rse.selected = rse.selected ?? isSelectedInArray;
                const onSelect = () => (rse.selected ? removeRSE(rse) : addRSE(rse));
                return <SelectableCell selected={rse.selected} onSelect={onSelect} {...params} />;
            },
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'Quota',
            field: 'bytes_limit',
            cellRenderer: (params: ICellRendererParams) => {
                const item: RSEAccountUsageLimitViewModel = params.data;
                if (item.bytes_limit === -1 && item.has_quota) {
                    return 'Infinite';
                }
                const value = item.bytes_limit < 0 ? 'No quota' : formatFileSize(item.bytes_limit);
                return <WarningCell warn={!item.has_quota} {...params} value={value} />;
            },
            colSpan: (params: ColSpanParams) => {
                // Take up all the subsequent columns
                return params.data.bytes_limit < 0 ? 3 : 1;
            },
            minWidth: 200,
            filter: 'agNumberColumnFilter',
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
            filter: 'agNumberColumnFilter',
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
            filter: 'agNumberColumnFilter',
        },
    ]);

    const updateSelection = useCallback(() => {
        tableRef.current?.api?.forEachNode(node => {
            if (!node.data) return;
            const rse: SelectableRSEViewModel = node.data;
            // Use RSE name for comparison since rse_id is undefined from the API
            const selected = selectedItems.some(element => element.rse === rse.rse);
            node.setData({ ...rse, selected });
        });
    }, [selectedItems]);

    useEffect(() => {
        updateSelection();
    }, [updateSelection]);

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

    return (
        <StreamedTable
            columnDefs={columnDefs}
            tableRef={tableRef}
            {...props}
            onGridReady={onGridReady}
            onAsyncTransactionsFlushed={() => updateSelection()}
        />
    );
};
