import React, { useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { RegularTable } from '@/component-library/features/table/RegularTable/RegularTable';
import { RSEAttribute } from '@/lib/core/entity/rucio';
import { RSEAttributeViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';
import { AttributeCell } from '@/component-library/features/table/cells/AttributeCell';

type DetailsRSEAttributesTableProps = {
    viewModel: RSEAttributeViewModel;
};

export const DetailsRSEAttributesTable = (props: DetailsRSEAttributesTableProps) => {
    const tableRef = useRef<AgGridReact<RSEAttribute>>(null);

    const [columnDefs] = useState([
        {
            headerName: 'Key',
            field: 'key',
            flex: 1,
            sortable: true,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'Value',
            field: 'value',
            cellRenderer: AttributeCell,
            flex: 1,
            sortable: false,
        },
    ]);

    return <RegularTable columnDefs={columnDefs} tableRef={tableRef} rowData={props.viewModel.attributes} />;
};
