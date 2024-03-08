import { createColumnHelper } from "@tanstack/react-table";
import { P } from "../../Text/Content/P";
import { twMerge } from "tailwind-merge";
import { UseComDOM } from "@/lib/infrastructure/hooks/useComDOM";
import { StreamedTable } from "../../StreamedTables/StreamedTable.stories";
import { TableSortUpDown } from "../../StreamedTables/TableSortUpDown";
import { H3 } from "../../Text/Headings/H3";
import { RSEProtocolViewModel } from "@/lib/infrastructure/data/view-model/rse";
import { RSEProtocol } from "@/lib/core/entity/rucio";
import { NormalTable } from "@/component-library/StreamedTables/NormalTable";
import { TableStyling } from "@/component-library/StreamedTables/types";
import useReponsiveHook from "@/component-library/Helpers/ResponsiveHook";

export const PageRSEProtocols = (
    props: {
        // TODO: data will not be streamed, but loaded in one go
        tableData: RSEProtocolViewModel
    }
) => {
    const shortstyle = { style: "w-20" }
    const shortstyleblue = { style: "w-20 bg-blue-100 dark:bg-blue-900"}
    const shortstylepink = { style: "w-20 bg-pink-100 dark:bg-pink-900"}
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
            cell: info => <P className="break-all pr-1">{info.getValue()}</P>,
            meta: { style: "md:w-26 sm:w-24" }
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
            header: info => (responsive.md && !responsive.lg) ? <TableSortUpDown name="L/R" column={info.column} stack /> :
            <TableSortUpDown name="LAN/R" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-center">{info.getValue()}</P>,
            meta: shortstyleblue
        }),
        columnHelper.accessor("priorities_lan.write", {
            id: "priorities_lan.write",
            header: info => (responsive.md && !responsive.lg) ? <TableSortUpDown name="L/W" column={info.column} stack />:
            <TableSortUpDown name="LAN/W" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-center">{info.getValue()}</P>,
            meta: shortstyleblue
        }),
        columnHelper.accessor("priorities_lan.delete", {
            id: "priorities_lan.delete",
            header: info => (responsive.md && !responsive.lg) ? <TableSortUpDown name="L/D" column={info.column} stack />:
            <TableSortUpDown name="LAN/D" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-center">{info.getValue()}</P>,
            meta: shortstyleblue
        }),
        columnHelper.accessor("priorities_wan.read", {
            id: "priorities_wan.read",
            header: info => (responsive.md && !responsive.lg) ? <TableSortUpDown name="W/R" column={info.column} stack />:
            <TableSortUpDown name="WAN/R" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-center">{info.getValue()}</P>,
            meta: shortstylepink
        }),
        columnHelper.accessor("priorities_wan.write", {
            id: "priorities_wan.write",
            header: info => (responsive.md && !responsive.lg) ? <TableSortUpDown name="W/W" column={info.column} stack />:
            <TableSortUpDown name="WAN/W" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-center">{info.getValue()}</P>,
            meta: shortstylepink
        }),
        columnHelper.accessor("priorities_wan.delete", {
            id: "priorities_wan.delete",
            header: info => (responsive.md && !responsive.lg) ? <TableSortUpDown name="W/D" column={info.column} stack />:
            <TableSortUpDown name="WAN/D" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-center">{info.getValue()}</P>,
            meta: shortstylepink,
        }),
        // columnHelper.accessor("priorities_wan.tpc", {
        //     id: "priorities_lan.tpc",
        //     header: info => <TableSortUpDown name="TPC" column={info.column} stack />,
        //     cell: info => <P className="break-all pr-1 text-right">{info.getValue()}</P>,
        //     meta: shortstylepink,
        // }),
        columnHelper.accessor("priorities_wan.tpcwrite", {
            id: "priorities_wan.tpcwrite",
            header: info => (responsive.md && !responsive.lg) ? <TableSortUpDown name="T/W" column={info.column} stack />:
            <TableSortUpDown name="TPC/W" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-center">{info.getValue()}</P>,
            meta: shortstylepink,
        }),
        columnHelper.accessor("priorities_wan.tpcread", {
            id: "priorities_wan.tpcread",
            header: info => (responsive.md && !responsive.lg) ?  <TableSortUpDown name="T/R" column={info.column} stack />:
            <TableSortUpDown name="TPC/R" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-center">{info.getValue()}</P>,
            meta: shortstylepink,
        }),
    ]
    const responsive = useReponsiveHook()
    return (
        <NormalTable<RSEProtocol>
            tabledata={props.tableData.protocols || []}
            tablecolumns={tablecolumns}
            tablestyling={{
                visibility: {
                    "port": responsive.lg,
                    "prefix": responsive.lg,
                },
                pageSize: 5,
            } as TableStyling}
            tableselecting={{
                enableRowSelection: !responsive.lg,
                handleChange: (rows: RSEProtocol[]) => {},
            }
            }
        />
    );
};