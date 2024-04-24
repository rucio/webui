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

export const PageRSEProtocols = (
    props: {
        // TODO: data will not be streamed, but loaded in one go
        tableData: RSEProtocolViewModel
    }
) => {
    const shortstyleblue = { style: "w-20 sm:w-10 bg-blue-100 dark:bg-blue-900"}
    const shortstylepink = { style: "w-20 sm:w-10 bg-pink-100 dark:bg-pink-900"}
    const columnHelper = createColumnHelper<RSEProtocol>()
    const tablecolumns: any[] = [
        columnHelper.accessor("scheme", {
            id: "scheme",
            header: info => <H3>Scheme</H3>,
            cell: info => <P className="break-all pr-1">{info.getValue()}</P>,
            meta: { style: "w-20" }
        }),
        columnHelper.accessor("hostname", {
            id: "hostname",
            header: info => <H3>Hostname</H3>,
            cell: info => <P className="break-all pr-1">{info.getValue()}</P>,
            meta: { style: "w-26 lg:w-36" }
        }),
        columnHelper.accessor("port", {
            id: "port",
            header: info =>(
                <div>
                    <H3 >Port</H3>
                </div>
            ),
            cell: info => <P className="break-all pr-1 flex justify-center">{info.getValue()}</P>,
            meta: { style: "w-20" }
        }),
        columnHelper.accessor("prefix", {
            id: "prefix",
            header: info =>  (
                <div>
                    <H3>Prefix</H3>
                </div>
            ),
            cell: info => <P className="break-all pr-1">{info.getValue()}</P>,
            meta: { style: "w-24" }
        }),
        columnHelper.accessor("priorities_lan.read", {
            id: "priorities_lan.read",
            header: info =>  (<div className="flex flex-col">
            <H3 className="lg:hidden">L/R</H3>
            <H3 className="hidden lg:block">LAN/R</H3>
            <TableSortUpDown name="" column={info.column} stack />
          </div>
        ),
        cell: info => <P className="break-all pr-1 text-center">{info.getValue()}</P>,
        meta: shortstyleblue
      }),
        columnHelper.accessor("priorities_lan.write", {
            id: "priorities_lan.write",
            header: info =>  (<div className="flex flex-col">
            <H3 className="lg:hidden">L/W</H3>
            <H3 className="hidden lg:block">LAN/W</H3>
            <TableSortUpDown name="" column={info.column} stack />
          </div>
        ),
            cell: info => <P className="break-all pr-1 text-center">{info.getValue()}</P>,
            meta: shortstyleblue
        }),
        columnHelper.accessor("priorities_lan.delete", {
            id: "priorities_lan.delete",
            header: info =>  (<div className="flex flex-col">
            <H3 className="lg:hidden">L/D</H3>
            <H3 className="hidden lg:block">LAN/D</H3>
            <TableSortUpDown name="" column={info.column} stack />
          </div>
        ),
            cell: info => <P className="break-all pr-1 text-center">{info.getValue()}</P>,
            meta: shortstyleblue
        }),
        columnHelper.accessor("priorities_wan.read", {
            id: "priorities_wan.read",
            header: info =>  (<div className="flex flex-col">
            <H3 className="lg:hidden">W/R</H3>
            <H3 className="hidden lg:block">WAN/R</H3>
            <TableSortUpDown name="" column={info.column} stack />
          </div>
        ),
            cell: info => <P className="break-all pr-1 text-center">{info.getValue()}</P>,
            meta: shortstylepink
        }),
        columnHelper.accessor("priorities_wan.write", {
            id: "priorities_wan.write",
            header: info =>  <div className="flex flex-col">
            <H3 className="lg:hidden">W/W</H3>
            <H3 className="hidden lg:block">WAN/W</H3>
            <TableSortUpDown name="" column={info.column} stack />
          </div>
        ,
            cell: info => <P className="break-all pr-1 text-center">{info.getValue()}</P>,
            meta: shortstylepink
        }),
        columnHelper.accessor("priorities_wan.delete", {
            id: "priorities_wan.delete",
            header: info =>  (<div className="flex flex-col">
            <H3 className="lg:hidden">W/D</H3>
            <H3 className="hidden lg:block">WAN/D</H3>
            <TableSortUpDown name="" column={info.column} stack />
          </div>
        ),
            cell: info => <P className="break-all pr-1 text-center">{info.getValue()}</P>,
            meta: shortstylepink,
        }),
        columnHelper.accessor("priorities_wan.tpcwrite", {
            id: "priorities_wan.tpcwrite",
            header: info =>  (<div className="flex flex-col">
            <H3 className="lg:hidden">T/W</H3>
            <H3 className="hidden lg:block">TCP/W</H3>

            <TableSortUpDown name="" column={info.column} stack />
          </div>
        ),
            cell: info => <P className="break-all pr-1 text-center">{info.getValue()}</P>,
            meta: shortstylepink,
        }),
        columnHelper.accessor("priorities_wan.tpcread", {
            id: "priorities_wan.tpcread",
            header: info =>  (<div className="flex flex-col">
            <H3 className="lg:hidden">T/R</H3>
            <H3 className="hidden lg:block">TCP/R</H3>
            <TableSortUpDown name="" column={info.column} stack />
          </div>
        ),
            cell: info => <P className="break-all pr-1 text-center">{info.getValue()}</P>,
            meta: shortstylepink,
        }),
    ]

    return (
        <NormalTable<RSEProtocol>
            tabledata={props.tableData.protocols || []}
            tablecolumns={tablecolumns}
            tablestyling={{
                pageSize: 10,
            } as TableStyling}
            tableselecting={{
                enableRowSelection: true,
                handleChange: (rows: RSEProtocol[]) => {},
            }
            }
        />
    );
};