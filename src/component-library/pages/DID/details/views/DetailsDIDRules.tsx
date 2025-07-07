import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { DIDRulesViewModel } from '@/lib/infrastructure/data/view-model/did';
import { GridReadyEvent, ValueFormatterParams } from 'ag-grid-community';
import { ClickableCell } from '@/component-library/features/table/cells/ClickableCell';
import React, { useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { buildDiscreteFilterParams, DefaultDateFilterParams, DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';
import { badgeCellClasses, badgeCellWrapperStyle } from '@/component-library/features/table/cells/badge-cell';
import { RuleState } from '@/lib/core/entity/rucio';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { DetailsDIDView, DetailsDIDProps } from '@/component-library/pages/DID/details/views/DetailsDIDView';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { formatDate, formatSeconds } from '@/component-library/features/utils/text-formatters';
import { RuleStateBadge } from '@/component-library/features/badges/Rule/RuleStateBadge';

type DetailsDIDRulesTableProps = {
    streamingHook: UseStreamReader<DIDRulesViewModel>;
    onGridReady: (event: GridReadyEvent) => void;
};

const ClickableId = (props: { value: string }) => {
    return <ClickableCell href={`/rule/page/${props.value}`}>{props.value}</ClickableCell>;
};

export const DetailsDIDRulesTable = (props: DetailsDIDRulesTableProps) => {
    const tableRef = useRef<AgGridReact<DIDRulesViewModel>>(null);

    const [columnDefs] = useState([
        {
            headerName: 'ID',
            field: 'id',
            width: 390,
            sortable: false,
            cellRenderer: ClickableId,
        },
        {
            headerName: 'RSE Expression',
            field: 'rse_expression',
            minWidth: 150,
            flex: 1,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'Created At',
            field: 'created_at',
            minWidth: 150,
            valueFormatter: (params: ValueFormatterParams) => {
                return formatDate(params.value);
            },
            filter: 'agDateColumnFilter',
            filterParams: DefaultDateFilterParams,
        },
        {
            headerName: 'Remaining',
            field: 'remaining_lifetime',
            minWidth: 125,
            valueFormatter: (params: ValueFormatterParams) => {
                return formatSeconds(params.value);
            },
        },
        {
            headerName: 'State',
            field: 'state',
            minWidth: 200,
            cellStyle: badgeCellWrapperStyle,
            cellRenderer: RuleStateBadge,
            cellRendererParams: {
                className: badgeCellClasses,
            },
            filter: true,
            sortable: false,
            // TODO: fix the string values
            filterParams: buildDiscreteFilterParams(Object.values(RuleState)),
        },
        // TODO: minified header with a tooltip
        {
            headerName: 'OK',
            field: 'locks_ok_cnt',
            minWidth: 75,
            sortable: false,
        },
        {
            headerName: 'Replicating',
            field: 'locks_replicating_cnt',
            minWidth: 135,
            sortable: false,
        },
        {
            headerName: 'Stuck',
            field: 'locks_stuck_cnt',
            minWidth: 90,
            sortable: false,
        },
    ]);

    return <StreamedTable columnDefs={columnDefs} tableRef={tableRef} {...props} />;
};

export const DetailsDIDRules: DetailsDIDView = ({ scope, name }: DetailsDIDProps) => {
    const { gridApi, onGridReady, streamingHook, startStreaming, stopStreaming } = useTableStreaming<DIDRulesViewModel>();

    useEffect(() => {
        if (gridApi) {
            const url = '/api/feature/list-did-rules?' + new URLSearchParams({ scope, name });
            startStreaming(url);
        }
    }, [gridApi]);

    return <DetailsDIDRulesTable streamingHook={streamingHook} onGridReady={onGridReady} />;
};
