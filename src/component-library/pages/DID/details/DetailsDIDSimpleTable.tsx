import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { DIDViewModel } from '@/lib/infrastructure/data/view-model/did';
import { GridReadyEvent, ValueGetterParams } from 'ag-grid-community';
import { ClickableCell } from '@/component-library/features/table/cells/ClickableCell';
import React, { useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';
import { DIDTypeBadge } from '@/component-library/features/badges/DID/DIDTypeBadge';
import { badgeCellClasses, badgeCellWrapperStyle } from '@/component-library/features/table/cells/badge-cell';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';

type DetailsDIDSimpleTableProps = {
    streamingHook: UseStreamReader<DIDViewModel>;
    onGridReady: (event: GridReadyEvent) => void;
};

const ClickableDID = (props: { value: string[] }) => {
    console.log(props.value);
    const [scope, name] = props.value;
    return (
        <ClickableCell href={`/did/page/${scope}/${name}`}>
            {scope}:{name}
        </ClickableCell>
    );
};

export const DetailsDIDSimpleTable = (props: DetailsDIDSimpleTableProps) => {
    const tableRef = useRef<AgGridReact<DIDViewModel>>(null);

    const [columnDefs] = useState([
        {
            headerName: 'Identifier',
            flex: 1,
            valueGetter: (params: ValueGetterParams<ListDIDsViewModel>) => [params.data?.scope, params.data?.name],
            cellRenderer: ClickableDID,
            minWidth: 250,
            sortable: false,
        },
        {
            headerName: 'Type',
            field: 'did_type',
            cellRenderer: DIDTypeBadge,
            minWidth: 180,
            maxWidth: 180,
            cellStyle: badgeCellWrapperStyle,
            cellRendererParams: {
                className: badgeCellClasses,
            },
            sortable: false,
        },
    ]);

    return <StreamedTable columnDefs={columnDefs} tableRef={tableRef} {...props} />;
};
