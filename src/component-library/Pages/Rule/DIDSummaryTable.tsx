import { NormalTable } from "@/component-library/StreamedTables/NormalTable"
import { createColumnHelper } from "@tanstack/react-table"
import { BasicStatusTag, BasicStatusTagProps } from "@/component-library/Tags/BasicStatusTag"
import { P } from "@/component-library/Text/Content/P"
import { TableSortUpDown } from "@/component-library/StreamedTables/TableSortUpDown"
import { Number } from "@/component-library/Text/Content/Number"
import { twMerge } from "tailwind-merge"


export type  TDIDSummaryTableRowProps = {
    name: string
    copies: number
    size: number | '-'
    requestedSize: number | '-'
    tags: BasicStatusTagProps[]
}
export const DIDSummaryTable = (props: {
    numSamples: number,
    tabledata: TDIDSummaryTableRowProps[]
}) => {
    const totalSize: number | '-' = props.tabledata.reduce((sum, row) => {
        return typeof row.size === 'number' ? sum + row.size : sum;
    }, 0);
    const totalRequestedSize: number | '-' = props.tabledata.reduce((sum, row) => {
        return typeof row.requestedSize === 'number' ? sum + row.requestedSize : sum;
    }, 0);

    const columnHelper = createColumnHelper<TDIDSummaryTableRowProps>()
    const tablecolumns: any[] = [
        columnHelper.accessor("name", {
            id: "did",
            header: info => { return (
            <div className="text-xl text-left dark:text-white">
                <span>DID</span>
            </div>
            )
            },
            cell: info => (
                <div className="flex flex-col items-left px-2">
                    <P className="break-all pr-1">{info.getValue()}</P>
                </div>
            ),
            meta: {
                style: "min-w-100"
            }
        }),
        columnHelper.accessor("copies", {
            id: "copies",
            header: info => <span className="text-xl dark:text-white">Copies</span>,
            cell: info => (
                <div className="flex flex-col items-center w-36 px-2">
                    <span className="text-center w-36 dark:text-white">{info.getValue()}</span>
                </div>
            ),
            meta: {
                style: "w-36"
            }
        }),
        columnHelper.accessor("size", {
            id: "size",
            header: info => {
                return (
                    <TableSortUpDown
                        name="Size"
                        column={info.column}
                        className="px-2"
                    />
                )
            },
            cell: (info) => {
                const value = info.getValue()
                if(value === '-') {
                    return <span className="text-center dark:text-white px-2">-</span>
                }
                return <Number className="text-center dark:text-white px-2" number={value} />
            },
            meta: {
                style: "w-24"
            }
        }),
        columnHelper.accessor("requestedSize", {
            id: "requestedSize",
            header: info => {
                return (
                    <div className="flex flex-row items-center">
                        <TableSortUpDown
                            name="Requested Size"
                            column={info.column}
                            className="px-2"
                        />
                    </div>
                )
            },
            cell: info => {
                const value = info.getValue()
                if(value === '-') {
                    return (
                    <div className="flex flex-col items-center text-center dark:text-white px-2">
                        <span className="">-</span>
                    </div>
                    )
                }
                return (
                <div className="flex flex-col items-left">
                    <Number className="text-center dark:text-white" number={value} />
                </div>
                )
            },
            meta: {
                style: "w-64"
            }
        }),
        columnHelper.accessor("tags", {
            id: "tags",
            header: info => {
                return ( 
                    <span className="text-xl dark:text-white">Tags</span>
                )
            },
            cell: (info) => {
                return <div className="flex flex-col items-center">
                    {info.getValue().map((tagProps, idx) => {
                        return <BasicStatusTag  key={idx} {...tagProps} />
                    })}
                </div>
            }
        }),
    ]

    return (
        <div className="flex flex-col space-y-4">
            <NormalTable<TDIDSummaryTableRowProps>
                className="w-full rounded-md"
                tabledata={props.tabledata}
                tablecolumns={tablecolumns}
                tablestyling={{
                    "tableHeadRowStyle": "bg-gray-700 dark:bg-gray-800",
                    "tableBodyRowStyle": "border border-gray-300 bg-gray-700 dark:bg-gray-800",
                }}
            />
            <div
                    className=""
                >
                    <table className={twMerge(
                        "w-full rounded-md table-fixed relative",
                        "bg-white dark:bg-gray-700",
                        "text-gray-800 dark:text-gray-100"
                    )}
                    >
                        <tbody>
                            <tr className="text-black dark:text-white">
                                <th className="w-56 pl-2 py-2 text-left">Parameter</th>
                                <th className="pl-2 py-2 text-left">Value</th>
                            </tr>
                            <tr className="border-t dark:border-gray-400">
                                <td className="w-56 pl-2 py-1">Total Files</td>
                                <td className="pl-2 py-1">{100}</td>
                            </tr>
                            <tr className="border-t dark:border-gray-400">
                                <td className="w-56 pl-2 py-1">Total Size</td>
                                <td className="pl-2 py-1">{
                                    typeof totalSize === 'number' ? <Number number={totalSize} /> : totalSize
                                }</td>
                            </tr>
                            <tr className="border-t dark:border-gray-400">
                                <td className="w-56 pl-2 py-1">Total Requested Size</td>
                                <td className="pl-2 py-1">
                                    {
                                        typeof totalRequestedSize === 'number' ? <Number number={totalRequestedSize} /> : totalRequestedSize
                                    }
                                </td>
                            </tr>
                            {/* <tr className="border-t dark:border-gray-400">
                                <OptionTD>Expiry Date</OptionTD>
                                <td className="select-all py-1">{format("yyyy-MM-dd", props.data.expirydate)}</td>
                            </tr>
                            <tr className="border-t dark:border-gray-400">
                                <OptionTD>Enable Notifications</OptionTD>
                                <td><BoolTag val={props.data.notifications} /></td>
                            </tr>
                            <tr className="border-t dark:border-gray-400">
                                <OptionTD>Asynchronous Mode</OptionTD>
                                <td><BoolTag val={props.data.asynchronousMode} /></td>
                            </tr>
                            <tr className="border-t dark:border-gray-400">
                                <OptionTD>Group By</OptionTD>
                                <td><DIDTypeTag didtype={props.data.groupby} /></td>
                            </tr>
                            <tr className="border-t dark:border-gray-400">
                                <OptionTD>Number of Copies</OptionTD>
                                <td className="select-all py-1">{props.data.numcopies}</td>
                            </tr>
                            <tr className="border-t dark:border-gray-400">
                                <OptionTD>Comment</OptionTD>
                                <td className="select-all py-1">{props.data.comment}</td>
                            </tr> */}
                        </tbody>
                    </table>
                </div>
        </div>
    )
}