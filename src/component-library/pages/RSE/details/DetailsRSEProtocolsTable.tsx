import React, { useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { RegularTable } from '@/component-library/features/table/RegularTable/RegularTable';
import { RSEDetailsProtocol } from '@/lib/core/entity/rucio';
import { ValueGetterParams } from 'ag-grid-community';
import { DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';

type DetailsRSEProtocolsTableProps = {
    rowData: RSEDetailsProtocol[];
};

export const DetailsRSEProtocolsTable = (props: DetailsRSEProtocolsTableProps) => {
    const tableRef = useRef<AgGridReact<RSEDetailsProtocol>>(null);

    const [columnDefs] = useState([
        {
            headerName: 'Protocol',
            children: [
                {
                    headerName: 'Scheme',
                    field: 'scheme',
                    width: 120,
                    flex: 0,
                    pinned: 'left',
                    filter: true,
                    filterParams: DefaultTextFilterParams,
                },
                {
                    headerName: 'Hostname',
                    field: 'hostname',
                    width: 250,
                    flex: 0,
                    filter: true,
                    filterParams: DefaultTextFilterParams,
                },
                {
                    headerName: 'Port',
                    field: 'port',
                    width: 100,
                    flex: 0,
                    filter: 'agNumberColumnFilter',
                },
                {
                    headerName: 'Prefix',
                    field: 'prefix',
                    width: 200,
                    flex: 0,
                    filter: true,
                    filterParams: DefaultTextFilterParams,
                },
            ],
        },
        {
            headerName: 'LAN Priorities',
            children: [
                {
                    headerName: 'Read',
                    valueGetter: (params: ValueGetterParams<RSEDetailsProtocol>) => {
                        return params.data?.domains.lan.read;
                    },
                    width: 90,
                    flex: 0,
                    sortable: true,
                    filter: 'agNumberColumnFilter',
                },
                {
                    headerName: 'Write',
                    valueGetter: (params: ValueGetterParams<RSEDetailsProtocol>) => {
                        return params.data?.domains.lan.write;
                    },
                    width: 90,
                    flex: 0,
                    sortable: true,
                    filter: 'agNumberColumnFilter',
                },
                {
                    headerName: 'Delete',
                    valueGetter: (params: ValueGetterParams<RSEDetailsProtocol>) => {
                        return params.data?.domains.lan.delete;
                    },
                    width: 90,
                    flex: 0,
                    sortable: true,
                    filter: 'agNumberColumnFilter',
                },
            ],
        },
        {
            headerName: 'WAN Priorities',
            children: [
                {
                    headerName: 'Read',
                    valueGetter: (params: ValueGetterParams<RSEDetailsProtocol>) => {
                        return params.data?.domains.wan.read;
                    },
                    width: 90,
                    flex: 0,
                    sortable: true,
                    filter: 'agNumberColumnFilter',
                },
                {
                    headerName: 'Write',
                    valueGetter: (params: ValueGetterParams<RSEDetailsProtocol>) => {
                        return params.data?.domains.wan.write;
                    },
                    width: 90,
                    flex: 0,
                    sortable: true,
                    filter: 'agNumberColumnFilter',
                },
                {
                    headerName: 'Delete',
                    valueGetter: (params: ValueGetterParams<RSEDetailsProtocol>) => {
                        return params.data?.domains.wan.delete;
                    },
                    width: 90,
                    flex: 0,
                    sortable: true,
                    filter: 'agNumberColumnFilter',
                },
            ],
        },
        {
            headerName: 'Third Party Copy',
            children: [
                {
                    headerName: 'Read',
                    valueGetter: (params: ValueGetterParams<RSEDetailsProtocol>) => {
                        return params.data?.domains.wan.third_party_copy_read;
                    },
                    width: 90,
                    flex: 0,
                    sortable: true,
                    filter: 'agNumberColumnFilter',
                },
                {
                    headerName: 'Write',
                    valueGetter: (params: ValueGetterParams<RSEDetailsProtocol>) => {
                        return params.data?.domains.wan.third_party_copy_write;
                    },
                    width: 90,
                    flex: 0,
                    sortable: true,
                    filter: 'agNumberColumnFilter',
                },
            ],
        },
    ]);

    return <RegularTable columnDefs={columnDefs} tableRef={tableRef} {...props} />;
};
