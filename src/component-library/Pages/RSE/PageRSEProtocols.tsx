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
            id: "priorities_wan.read",
            header: info => <TableSortUpDown name="WAN/R" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-right">{info.getValue()}</P>,
            meta: shortstylepink
        }),
        columnHelper.accessor("priorities_wan.write", {
            id: "priorities_wan.write",
            header: info => <TableSortUpDown name="WAN/W" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-right">{info.getValue()}</P>,
            meta: shortstylepink
        }),
        columnHelper.accessor("priorities_wan.delete", {
            id: "priorities_wan.delete",
            header: info => <TableSortUpDown name="WAN/D" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-right">{info.getValue()}</P>,
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
            header: info => <TableSortUpDown name="TPC/W" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-right">{info.getValue()}</P>,
            meta: shortstylepink,
        }),
        columnHelper.accessor("priorities_wan.tpcread", {
            id: "priorities_wan.tpcread",
            header: info => <TableSortUpDown name="TPC/R" column={info.column} stack />,
            cell: info => <P className="break-all pr-1 text-right">{info.getValue()}</P>,
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
                    "priorities_lan.read": responsive.lg,
                    "priorities_lan.write": responsive.lg,
                    "priorities_lan.delete": responsive.lg,
                    "priorities_wan.read": responsive.lg,
                    "priorities_wan.write": responsive.lg,
                    "priorities_wan.delete": responsive.lg,
                    "priorities_wan.tpcwrite": responsive.lg,
                    "priorities_wan.tpcread": responsive.lg,
                    "port": responsive.md,
                    "prefix": responsive.md,
                },
                pageSize: 5,
            } as TableStyling}
            tableselecting={{
                enableRowSelection: !responsive.lg,
                handleChange: (rows: RSEProtocol[]) => {},
                breakOut: {
                    breakoutVisibility: !responsive.lg,
                    keys: responsive.md ? {
                        "priorities_lan.read": "LAN/R",
                        "priorities_lan.write": "LAN/W",
                        "priorities_lan.delete": "LAN/D",
                        "priorities_wan.read": "WAN/R",
                        "priorities_wan.write": "WAN/W",
                        "priorities_wan.delete": "WAN/D",
                        "priorities_wan.tpcwrite": "TPC/W",
                        "priorities_wan.tpcread": "TPC/R",
                    } : {
                        "port": "Port",
                        "prefix": "Prefix",
                        "priorities_lan.read": "LAN/R",
                        "priorities_lan.write": "LAN/W",
                        "priorities_lan.delete": "LAN/D",
                        "priorities_wan.read": "WAN/R",
                        "priorities_wan.write": "WAN/W",
                        "priorities_wan.delete": "WAN/D",
                        "priorities_wan.tpcwrite": "TPC/W",
                        "priorities_wan.tpcread": "TPC/R",
                    }
                }
            }
            }
        />
    );
};