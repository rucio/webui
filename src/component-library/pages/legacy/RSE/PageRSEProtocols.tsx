import { createColumnHelper } from '@tanstack/react-table';
import { P } from '../../../atoms/legacy/text/content/P/P';
import { twMerge } from 'tailwind-merge';
import { UseComDOM } from '@/lib/infrastructure/hooks/useComDOM';
import { StreamedTable } from '@/component-library/features/legacy/StreamedTables/StreamedTable.stories';
import { TableSortUpDown } from '@/component-library/features/legacy/StreamedTables/TableSortUpDown';
import { H3 } from '../../../atoms/legacy/text/headings/H3/H3';
import { RSEProtocolViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { RSEProtocol } from '@/lib/core/entity/rucio';
import { NormalTable } from '@/component-library/features/legacy/StreamedTables/NormalTable';
import { TableStyling } from '@/component-library/features/legacy/StreamedTables/types';

export const PageRSEProtocols = (props: {
    // TODO: data will not be streamed, but loaded in one go
    tableData: RSEProtocolViewModel;
}) => {
    const shortstyle = { style: 'w-20' };
    const shortstyleblue = { style: 'w-20 bg-extra-indigo-500' };
    const shortstylepink = { style: 'w-20 bg-extra-rose-500' };
    const columnHelper = createColumnHelper<RSEProtocol>();
    const tablecolumns: any[] = [
        columnHelper.accessor('scheme', {
            id: 'scheme',
            header: info => <H3>Scheme</H3>,
            cell: info => <P className="break-all pr-1 text-text-1000">{info.getValue()}</P>,
            meta: { style: 'w-24' },
        }),
        columnHelper.accessor('hostname', {
            id: 'hostname',
            header: info => <H3>Hostname</H3>,
            cell: info => <P className="break-all pr-1 text-text-1000">{info.getValue()}</P>,
        }),
        columnHelper.accessor('port', {
            id: 'port',
            header: info => <H3>Port</H3>,
            cell: info => <P className="break-all pr-1 text-text-1000">{info.getValue()}</P>,
            meta: { style: 'w-24' },
        }),
        columnHelper.accessor('prefix', {
            id: 'prefix',
            header: info => <H3>Prefix</H3>,
            cell: info => <P className="break-all pr-1 text-text-1000">{info.getValue()}</P>,
        }),
        columnHelper.accessor('priorities_lan.read', {
            id: 'priorities_lan.read',
            header: info => <TableSortUpDown name="LAN/R" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-right text-text-1000">{info.getValue()}</P>,
            meta: shortstyleblue,
        }),
        columnHelper.accessor('priorities_lan.write', {
            id: 'priorities_lan.write',
            header: info => <TableSortUpDown name="LAN/W" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-right text-text-1000">{info.getValue()}</P>,
            meta: shortstyleblue,
        }),
        columnHelper.accessor('priorities_lan.delete', {
            id: 'priorities_lan.delete',
            header: info => <TableSortUpDown name="LAN/D" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-right text-text-1000">{info.getValue()}</P>,
            meta: shortstyleblue,
        }),
        columnHelper.accessor('priorities_wan.read', {
            id: 'priorities_wan.read',
            header: info => <TableSortUpDown name="WAN/R" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-right text-text-1000">{info.getValue()}</P>,
            meta: shortstylepink,
        }),
        columnHelper.accessor('priorities_wan.write', {
            id: 'priorities_wan.write',
            header: info => <TableSortUpDown name="WAN/W" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-right text-text-1000">{info.getValue()}</P>,
            meta: shortstylepink,
        }),
        columnHelper.accessor('priorities_wan.delete', {
            id: 'priorities_wan.delete',
            header: info => <TableSortUpDown name="WAN/D" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-right text-text-1000">{info.getValue()}</P>,
            meta: shortstylepink,
        }),
        // columnHelper.accessor("priorities_wan.tpc", {
        //     id: "priorities_lan.tpc",
        //     header: info => <TableSortUpDown name="TPC" column={info.column} stack />,
        //     cell: info => <P className="break-all pr-1 text-right">{info.getValue()}</P>,
        //     meta: shortstylepink,
        // }),
        columnHelper.accessor('priorities_wan.tpcwrite', {
            id: 'priorities_wan.tpcwrite',
            header: info => <TableSortUpDown name="TPC/W" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-right text-text-1000">{info.getValue()}</P>,
            meta: shortstylepink,
        }),
        columnHelper.accessor('priorities_wan.tpcread', {
            id: 'priorities_wan.tpcread',
            header: info => <TableSortUpDown name="TPC/R" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-right text-text-1000">{info.getValue()}</P>,
            meta: shortstylepink,
        }),
    ];
    return (
        <NormalTable<RSEProtocol>
            tabledata={props.tableData.protocols || []}
            tablecolumns={tablecolumns}
            tablestyling={
                {
                    pageSize: 5,
                } as TableStyling
            }
        />
    );
};
