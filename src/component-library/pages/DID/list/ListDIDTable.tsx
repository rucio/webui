import React, { useEffect, useMemo, useRef } from 'react';
import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';
import { DIDViewModel } from '@/lib/infrastructure/data/view-model/did';
import { GridReadyEvent, SelectionChangedEvent, ValueGetterParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { DIDTypeBadge } from '@/component-library/features/badges/DID/DIDTypeBadge';
import { badgeCellClasses, badgeCellWrapperStyle } from '@/component-library/features/table/cells/badge-cell';
import { DIDSearchOverlay } from '@/component-library/features/search/DIDSearchOverlay';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';
import { DIDType } from '@/lib/core/entity/rucio';
import { AgGridMultiSelectFilter, createMultiSelectFilterHandler } from '@/component-library/features/table/filters/AgGridMultiSelectFilter';

type ListDIDTableProps = {
    streamingHook: UseStreamReader<DIDViewModel>;
    onSelectionChanged: (event: SelectionChangedEvent) => void;
    onGridReady: (event: GridReadyEvent) => void;
    /** Show the DID type per row. True when the search was not pinned to one type. */
    showTypeColumn?: boolean;
    /** Progress and notice records from an All search, rendered as the empty state. */
    searchRecords?: ListDIDsViewModel[];
};

/**
 * Builds the column set for the DID list.
 *
 * The type column only earns its place when the search could return more than one
 * type. A pinned-type search gives every row the same value, so the column is noise.
 */
export function buildListDIDColumnDefs(showTypeColumn: boolean) {
    // Only the three types a search can actually return. ALL is a search mode rather
    // than a value a row carries, and Collection, Derived and Unknown never appear in
    // list-dids results, so offering them would be filtering by something impossible.
    const didTypeOptions = [DIDType.CONTAINER, DIDType.DATASET, DIDType.FILE];

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
            cellRenderer: DIDTypeBadge,
            minWidth: 180,
            cellStyle: badgeCellWrapperStyle,
            cellRendererParams: {
                className: badgeCellClasses,
            },
            filter: {
                component: AgGridMultiSelectFilter,
                handler: createMultiSelectFilterHandler(didTypeOptions),
            },
            filterParams: {
                options: didTypeOptions,
            },
        },
    ];
}

export const ListDIDTable = (props: ListDIDTableProps) => {
    const tableRef = useRef<AgGridReact<DIDViewModel>>(null);
    const { showTypeColumn, searchRecords, ...tableProps } = props;

    const columnDefs = useMemo(() => buildListDIDColumnDefs(showTypeColumn ?? false), [showTypeColumn]);

    // The cascade's progress belongs in the table's empty state, where the results
    // will appear. Falls back to the standard streaming overlay when it has nothing to say.
    // StreamedTable hides the overlay once streaming stops without an error, which is
    // exactly how a cascade that found nothing ends: cleanly, with notice records but
    // no rows. Without this the table would just go blank and explain nothing.
    useEffect(() => {
        const api = tableRef.current?.api;
        if (!api) return;
        const hasNotice = (searchRecords ?? []).some(record => record.kind === 'notice');
        if (hasNotice && api.getDisplayedRowCount() === 0) {
            api.showNoRowsOverlay();
        }
    }, [searchRecords, props.streamingHook.status]);

    const noRowsOverlayComponent = (gridProps: any) => (
        <DIDSearchOverlay records={searchRecords ?? []} status={props.streamingHook.status} error={props.streamingHook.error} {...gridProps} />
    );

    return (
        <StreamedTable
            columnDefs={columnDefs}
            rowSelection={{ mode: 'singleRow', enableClickSelection: true }}
            tableRef={tableRef}
            noRowsOverlayComponent={noRowsOverlayComponent}
            enableFilterHandlers
            {...tableProps}
        />
    );
};
