import React, { useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { RegularTable } from '@/component-library/features/table/RegularTable/RegularTable';
import { RSEDetailsProtocol } from '@/lib/core/entity/rucio';
import { ValueGetterParams } from 'ag-grid-community';

type DetailsRSEProtocolsTableProps = {
    rowData: RSEDetailsProtocol[];
};

export const DetailsRSEProtocolsTable = (props: DetailsRSEProtocolsTableProps) => {
    const tableRef = useRef<AgGridReact<RSEDetailsProtocol>>(null);

    const [columnDefs] = useState([
        {
            headerName: 'Scheme',
            field: 'scheme',
            minWidth: 100,
            sortable: false,
        },
        {
            headerName: 'Hostname',
            field: 'hostname',
            minWidth: 200,
            flex: 1,
            sortable: false,
        },
        {
            headerName: 'Port',
            field: 'port',
            minWidth: 80,
            sortable: false,
        },
        {
            headerName: 'Prefix',
            field: 'prefix',
            minWidth: 250,
            flex: 1,
            sortable: false,
        },
        {
            headerName: 'LAN/R',
            valueGetter: (params: ValueGetterParams<RSEDetailsProtocol>) => {
                return params.data?.domains.lan.read;
            },
            minWidth: 80,
            sortable: true,
        },
        {
            headerName: 'LAN/W',
            valueGetter: (params: ValueGetterParams<RSEDetailsProtocol>) => {
                return params.data?.domains.lan.write;
            },
            minWidth: 80,
            sortable: true,
        },
        {
            headerName: 'LAN/D',
            valueGetter: (params: ValueGetterParams<RSEDetailsProtocol>) => {
                return params.data?.domains.lan.delete;
            },
            minWidth: 80,
            sortable: true,
        },
        {
            headerName: 'WAN/R',
            valueGetter: (params: ValueGetterParams<RSEDetailsProtocol>) => {
                return params.data?.domains.wan.read;
            },
            minWidth: 80,
            sortable: true,
        },
        {
            headerName: 'WAN/W',
            valueGetter: (params: ValueGetterParams<RSEDetailsProtocol>) => {
                return params.data?.domains.wan.write;
            },
            minWidth: 80,
            sortable: true,
        },
        {
            headerName: 'WAN/D',
            valueGetter: (params: ValueGetterParams<RSEDetailsProtocol>) => {
                return params.data?.domains.wan.delete;
            },
            minWidth: 80,
            sortable: true,
        },
        {
            headerName: 'TPC/R',
            valueGetter: (params: ValueGetterParams<RSEDetailsProtocol>) => {
                return params.data?.domains.wan.third_party_copy_read;
            },
            minWidth: 80,
            sortable: true,
        },
        {
            headerName: 'TPC/W',
            valueGetter: (params: ValueGetterParams<RSEDetailsProtocol>) => {
                return params.data?.domains.wan.third_party_copy_write;
            },
            minWidth: 80,
            sortable: true,
        },
    ]);

    return <RegularTable columnDefs={columnDefs} tableRef={tableRef} {...props} />;
};
