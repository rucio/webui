import React, { useEffect, useRef, useState } from 'react';
import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';
import { DIDLongViewModel } from '@/lib/infrastructure/data/view-model/did';
import { GridReadyEvent, ICellRendererParams, ValueFormatterParams, ValueGetterParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { formatFileSize } from '@/component-library/features/utils/text-formatters';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';
import { SelectableCell } from '@/component-library/features/table/cells/selection-cells';

interface SelectableDIDViewModel extends ListDIDsViewModel {
    selected?: boolean;
}

type StageDataTableProps = {
    streamingHook: UseStreamReader<ListDIDsViewModel>;
    addDID: (item: SelectableDIDViewModel) => void;
    removeDID: (item: SelectableDIDViewModel) => void;
    onGridReady: (event: GridReadyEvent) => void;
    selectedItems: ListDIDsViewModel[];
};

export const CreateRuleStageDataTable: React.FC<StageDataTableProps> = ({ addDID, removeDID, selectedItems, ...props }) => {
    const tableRef = useRef<AgGridReact<SelectableDIDViewModel>>(null);

    const [columnDefs] = useState([
        {
            headerName: 'Identifier',
            flex: 1,
            valueGetter: (params: ValueGetterParams<ListDIDsViewModel>) => `${params.data?.scope}:${params.data?.name}`,
            cellRenderer: (params: ICellRendererParams<SelectableDIDViewModel>) => {
                const did = params.data!;
                did.selected = did.selected ?? selectedItems.some(item => item.scope === did.scope && item.name === did.name);
                const onSelect = () => (did.selected ? removeDID(did) : addDID(did));
                return <SelectableCell selected={did.selected} onSelect={onSelect} {...params} />;
            },
            minWidth: 250,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'Size',
            field: 'bytes',
            valueFormatter: (params: ValueFormatterParams) => formatFileSize(params.value),
            minWidth: 200,
        },
    ]);

    const updateSelection = () => {
        tableRef.current?.api?.forEachNode(node => {
            const did: DIDLongViewModel = node.data;
            const selected = selectedItems.some(element => element.scope === did.scope && element.name === did.name);
            node.setData({ ...did, selected });
        });
    };

    useEffect(() => {
        updateSelection();
    }, [selectedItems]);

    return <StreamedTable columnDefs={columnDefs} tableRef={tableRef} onAsyncTransactionsFlushed={() => updateSelection()} {...props} />;
};
