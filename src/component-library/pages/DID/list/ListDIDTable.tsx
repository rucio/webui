import React, { useMemo, useRef } from 'react';
import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';
import { DIDViewModel } from '@/lib/infrastructure/data/view-model/did';
import { GridReadyEvent, SelectionChangedEvent, ValueGetterParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { DIDTypeTag } from '@/component-library/features/legacy/Tags/DIDTypeTag';
import { DIDType } from '@/lib/core/entity/rucio';

type ListDIDTableProps = {
    streamingHook: UseStreamReader<DIDViewModel>;
    onSelectionChanged: (event: SelectionChangedEvent) => void;
    onGridReady: (event: GridReadyEvent) => void;
    /** Show the DID type per row. True when the search was not pinned to one type. */
    showTypeColumn?: boolean;
};

/**
 * Builds the column set for the DID list.
 *
 * The type column only earns its place when the search could return more than one
 * type. A pinned-type search gives every row the same value, so the column is noise.
 */
export function buildListDIDColumnDefs(showTypeColumn: boolean) {
    const identifier = {
        headerName: 'Identifier',
        valueGetter: (params: ValueGetterParams<DIDViewModel>) => {
            return params.data?.scope + ':' + params.data?.name;
        },
        flex: 1,
        minWidth: 250,
        filter: true,
        filterParams: DefaultTextFilterParams,
    };

    if (!showTypeColumn) return [identifier];

    return [
        identifier,
        {
            headerName: 'Type',
            field: 'did_type',
            maxWidth: 150,
            cellRenderer: (params: { value: DIDType }) => <DIDTypeTag didtype={params.value ?? DIDType.UNKNOWN} />,
        },
    ];
}

export const ListDIDTable = (props: ListDIDTableProps) => {
    const tableRef = useRef<AgGridReact<DIDViewModel>>(null);
    const { showTypeColumn, ...tableProps } = props;

    const columnDefs = useMemo(() => buildListDIDColumnDefs(showTypeColumn ?? false), [showTypeColumn]);

    return (
        <StreamedTable columnDefs={columnDefs} rowSelection={{ mode: 'singleRow', enableClickSelection: true }} tableRef={tableRef} {...tableProps} />
    );
};
