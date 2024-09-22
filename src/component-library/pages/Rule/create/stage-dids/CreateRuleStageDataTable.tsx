import React, { useEffect, useRef, useState } from 'react';
import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';
import { DIDLongViewModel } from '@/lib/infrastructure/data/view-model/did';
import { GridReadyEvent, ICellRendererParams, ValueFormatterParams, ValueGetterParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { formatFileSize } from '@/component-library/features/utils/text-formatters';
import { Button } from '@/component-library/atoms/form/button';
import { HiCheck, HiPlus } from 'react-icons/hi';

const CreateRuleSelectableCell = (props: { onSelect: () => void; selected: boolean; value: string }) => {
    return (
        <div className="flex flex-row items-center" onClick={props.onSelect}>
            <Button variant={props.selected ? 'success' : 'default'} size="icon" className="mr-3 flex-shrink-0">
                {props.selected ? <HiCheck /> : <HiPlus />}
            </Button>
            <span>{props.value}</span>
        </div>
    );
};

interface SelectableDIDViewModel extends DIDLongViewModel {
    selected?: boolean;
}

type StageDataTableProps = {
    streamingHook: UseStreamReader<DIDLongViewModel>;
    addDID: (item: SelectableDIDViewModel) => void;
    removeDID: (item: SelectableDIDViewModel) => void;
    onGridReady: (event: GridReadyEvent) => void;
    selectedItems: DIDLongViewModel[];
};

export const CreateRuleStageDataTable: React.FC<StageDataTableProps> = ({ addDID, removeDID, selectedItems, ...props }) => {
    const tableRef = useRef<AgGridReact<SelectableDIDViewModel>>(null);

    const [columnDefs] = useState([
        {
            headerName: 'Identifier',
            valueGetter: (params: ValueGetterParams<DIDLongViewModel>) => `${params.data?.scope}:${params.data?.name}`,
            cellRenderer: (params: ICellRendererParams<SelectableDIDViewModel>) => {
                const did = params.data!;
                did.selected = did.selected ?? selectedItems.some(item => item.scope === did.scope && item.name === did.name);
                const onSelect = () => (did.selected ? removeDID(did) : addDID(did));
                return <CreateRuleSelectableCell selected={did.selected} onSelect={onSelect} {...params} />;
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
            maxWidth: 200,
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
