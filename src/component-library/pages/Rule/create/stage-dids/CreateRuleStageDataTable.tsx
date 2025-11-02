import React, { useEffect, useRef, useState } from 'react';
import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { buildDiscreteFilterParams, DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';
import { GridReadyEvent, ICellRendererParams, ValueFormatterParams, ValueGetterParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { formatFileSize } from '@/component-library/features/utils/text-formatters';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';
import { SelectableCell } from '@/component-library/features/table/cells/selection-cells';
import { DIDTypeBadge } from '@/component-library/features/badges/DID/DIDTypeBadge';
import { badgeCellClasses, badgeCellWrapperStyle } from '@/component-library/features/table/cells/badge-cell';
import { DIDType } from '@/lib/core/entity/rucio';

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

const DIDTypeDisplayNames = {
    [DIDType.FILE]: 'File',
    [DIDType.DATASET]: 'Dataset',
    [DIDType.CONTAINER]: 'Container',
    [DIDType.COLLECTION]: 'Collection',
    [DIDType.ALL]: 'All',
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
            minWidth: 450,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'Type',
            field: 'did_type',
            cellRenderer: DIDTypeBadge,
            minWidth: 180,
            cellStyle: badgeCellWrapperStyle,
            cellRendererParams: {
                className: badgeCellClasses,
            },
            filter: true,
            filterParams: buildDiscreteFilterParams(Object.values(DIDTypeDisplayNames), Object.values(DIDType)),
        },
        {
            headerName: 'Size',
            field: 'bytes',
            valueFormatter: (params: ValueFormatterParams) => formatFileSize(params.value),
            minWidth: 200,
            filter: 'agNumberColumnFilter',
        },
    ]);

    const updateSelection = () => {
        tableRef.current?.api?.forEachNode(node => {
            if (!node.data) return;
            const did: SelectableDIDViewModel = node.data;
            const selected = selectedItems.some(element => element.scope === did.scope && element.name === did.name);
            node.setData({ ...did, selected });
        });
    };

    useEffect(() => {
        updateSelection();
    }, [selectedItems]);

    return <StreamedTable columnDefs={columnDefs} tableRef={tableRef} onAsyncTransactionsFlushed={() => updateSelection()} {...props} />;
};
