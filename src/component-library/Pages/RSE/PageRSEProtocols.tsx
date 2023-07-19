import { RSEProtocol } from "@/lib/infrastructure/data/view-model/rse";
import { createColumnHelper } from "@tanstack/react-table";
import { P } from "../../Text/Content/P";
import { twMerge } from "tailwind-merge";
import { UseComDOM } from "@/lib/infrastructure/hooks/useComDOM";
import { StreamedTable } from "../../StreamedTables/StreamedTable.stories";
import { TableSortUpDown } from "../../StreamedTables/TableSortUpDown";
import { TableFilterString } from "../../StreamedTables/TableFilterString";
import { H3 } from "../../Text/Headings/H3";

export const PageRSEProtocols = (
    props: {
        comdom: UseComDOM<RSEProtocol>
    }
) => {
    const shortstyle = { style: "w-20" }
    const shortstyleblue = { style: "w-20 bg-blue-100"}
    const shortstylepink = { style: "w-20 bg-pink-100"}
    const columnHelper = createColumnHelper<RSEProtocol>()
    const tablecolumns: any[] = [
        columnHelper.accessor("scheme", {
            id: "scheme",
            header: info => <H3>Scheme</H3>,
            cell: info => <P className="break-all pr-1">{info.getValue()}</P>,
            meta: { style: "w-24" }
        }),
        columnHelper.accessor("hostname", {
            id: "hostname",
            header: info => <H3>Hostname</H3>,
            cell: info => <P className="break-all pr-1">{info.getValue()}</P>
        }),
        columnHelper.accessor("port", {
            id: "port",
            header: info => <H3>Port</H3>,
            cell: info => <P className="break-all pr-1">{info.getValue()}</P>,
            meta: { style: "w-24" }
        }),
        columnHelper.accessor("prefix", {
            id: "prefix",
            header: info => <H3>Prefix</H3>,
            cell: info => <P className="break-all pr-1">{info.getValue()}</P>,
        }),
        columnHelper.accessor("priorities_lan.read", {
            id: "priorities_lan.read",
            header: info => <TableSortUpDown name="LAN/R" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-right">{info.getValue()}</P>,
            meta: shortstyleblue
        }),
        columnHelper.accessor("priorities_lan.write", {
            id: "priorities_lan.write",
            header: info => <TableSortUpDown name="LAN/W" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-right">{info.getValue()}</P>,
            meta: shortstyleblue
        }),
        columnHelper.accessor("priorities_lan.delete", {
            id: "priorities_lan.delete",
            header: info => <TableSortUpDown name="LAN/D" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-right">{info.getValue()}</P>,
            meta: shortstyleblue
        }),
        columnHelper.accessor("priorities_wan.read", {
            id: "priorities_lan.read",
            header: info => <TableSortUpDown name="WAN/R" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-right">{info.getValue()}</P>,
            meta: shortstylepink
        }),
        columnHelper.accessor("priorities_wan.write", {
            id: "priorities_lan.write",
            header: info => <TableSortUpDown name="WAN/W" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-right">{info.getValue()}</P>,
            meta: shortstylepink
        }),
        columnHelper.accessor("priorities_wan.delete", {
            id: "priorities_lan.delete",
            header: info => <TableSortUpDown name="WAN/D" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-right">{info.getValue()}</P>,
            meta: shortstylepink,
        }),
        columnHelper.accessor("priorities_wan.tpc", {
            id: "priorities_lan.tpc",
            header: info => <TableSortUpDown name="TPC" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-right">{info.getValue()}</P>,
            meta: shortstylepink,
        }),
        columnHelper.accessor("priorities_wan.tpcwrite", {
            id: "priorities_lan.tpcwrite",
            header: info => <TableSortUpDown name="TPC/W" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-right">{info.getValue()}</P>,
            meta: shortstylepink,
        }),
        columnHelper.accessor("priorities_wan.tpcread", {
            id: "priorities_lan.tpcread",
            header: info => <TableSortUpDown name="TPC/R" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-right">{info.getValue()}</P>,
            meta: shortstylepink,
        }),
    ]
    return (
        <StreamedTable
            tablecomdom={props.comdom}
            tablecolumns={tablecolumns}
            tablestyling={{
                pageSize: 5
            }}
        />
    );
};