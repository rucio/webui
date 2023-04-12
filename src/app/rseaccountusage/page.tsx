'use client'
import { H3 } from "@/component-library/components/Text/Headings/H3"
import { P } from "@/component-library/components/Text/Content/P"

import { useEffect, useState } from "react"

import { RSEAccountUsageLimitDTO } from "@/lib/core/data/rucio-dto"
import useComDOM from "@/lib/infrastructure/hooks/useComDOM"
import { createColumnHelper, flexRender, getCoreRowModel, TableOptions, useReactTable } from "@tanstack/react-table"

const columnHelper = createColumnHelper<RSEAccountUsageLimitDTO>()



export default function RSEAccountUsage() {

    const [selectedRSEIDs, setSelectedRSEIDs] = useState<string[]>([])

    const columns: any[] = [
        {
            id: 'selection',
            header: () => <span className="w-8"/>,
            cell: (props) => {
                return <span className="w-8">
                    <input
                        type="checkbox"
                        disabled={
                            // if quota_bytes is less than used_bytes, disable checkbox
                            // TODO handle "askpermission" case
                            (props.row.original.quota_bytes && props.row.original.quota_bytes < props.row.original.used_bytes) ? true : false
                        }
                        checked={props.row.getIsSelected()}
                        onChange={(event: any) => {
                            if (event.target.checked) {
                                setSelectedRSEIDs([...selectedRSEIDs, props.row.original.rse_id])
                            }
                            else {
                                setSelectedRSEIDs(selectedRSEIDs.filter((did) => did !== props.row.original.rse_id))
                            }
                            props.row.getToggleSelectedHandler()(event)
                        }}
                    />
                </span>
            },
        },
        columnHelper.accessor('rse_id', {
            id: 'rse_id',
            header: 'ID',
            cell: (info) => { <P mono>{info.getValue()}</P> },
        }),
        columnHelper.accessor('rse', {
            id: 'rse',
            header: () => (
                <span className="w-1/2">
                    <H3>RSE Name</H3>
                </span>
            ),
            cell: (info) => <P mono>{info.getValue()}</P>,
        }),
        columnHelper.accessor('used_bytes', {
            id: 'used_bytes',
            header: () => <H3>Used</H3>,
            cell: (props) => {
                // if value is greater than quota bytes, print in red
                if (props.row.original.quota_bytes && props.row.original.quota_bytes < props.row.original.used_bytes) {
                    return <P mono className="text-red-500 dark:text-red-500 font-bold">{props.row.original.used_bytes}</P>
                }
                return <P mono>{props.row.original.used_bytes}</P>
            },
        }),
        columnHelper.accessor('quota_bytes', {
            id: 'quota_bytes',
            header: () => <H3>Quota</H3>,
            cell: (props) => {
                return <P mono>{props.row.original.quota_bytes}</P>
            }
        }),
        columnHelper.accessor('used_files', {
            id: 'used_files',
            header: 'Files',
        }),
        columnHelper.accessor('account', {
            id: 'account',
            header: 'Account',
        }),
    ]
    const {
        query,
        dataSink,
        status,
        comDOMStatus,
        start,
        stop,
        pause,
        resume,
        clean,
        pollInterval,
        errors,
        resolveError,
        resolveAllErrors
    } = useComDOM<RSEAccountUsageLimitDTO>(
        'http://localhost:3000/api/rseaccountusage',
        [],
        false,
        Infinity,
        200,
        true
    )
    const [columnVisibility, setColumnVisibility] = useState(
        {
            account: false,
            used_files: false,
            rse_id: false,
            rse: true,
            used_bytes: true,
            quota_bytes: true,
        }
    )

    const table = useReactTable<RSEAccountUsageLimitDTO>({
        data: query.data || [],
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        debugTable: true,
        enableRowSelection: true,
        state: {
            columnVisibility: columnVisibility,
        }
    } as TableOptions<RSEAccountUsageLimitDTO>)

    return (
        <div className="">
            <div className="flex-row">
                <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={async () => {
                    await start()
                }}>Start</button>
                <button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={async () => {
                    await stop()
                }}>Stop</button>
                <button className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900" onClick={async () => {
                    pause()
                }}>Pause</button>
                <button className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={resume}>Resume</button>
                <button className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900" onClick={clean}>Clean</button>
                <div className="flex flex-row">Poll Interval: {pollInterval}</div>
            </div>
            <div className="p-4">
                <div className={`h-72 overflow-y-auto border ${query.fetchStatus === "fetching" ? "hover:cursor-wait" : ""}`}>
                    <table className="table-fixed w-full text-left">
                        <thead className="w-full">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr
                                    key={headerGroup.id}
                                    className="w-full flex-row sticky top-0 bg-white shadow-md"
                                >
                                    <th className="w-8 grow-0"></th>
                                    <th className="w-1/2 flex-auto">RSE Name</th>
                                    <th className="flex-initial">Used Quota</th>
                                    <th className="hidden sm:table-cell sm:flex-initial">Total Quota</th>
                                </tr>
                            ))}
                        </thead>
                        <tbody
                            className="w-full"
                        >
                            {table.getRowModel().rows.map(row => (
                                <tr
                                    className="hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-900 w-full border-b hover:cursor-pointer"
                                    key={row.id}
                                    onClick={(event) => {
                                        let rse_id = row.original.rse_id
                                        if (selectedRSEIDs.includes(rse_id)) {
                                            setSelectedRSEIDs(selectedRSEIDs.filter(id => id !== rse_id))
                                        } else {
                                            setSelectedRSEIDs([...selectedRSEIDs, rse_id])
                                        }
                                        row.getToggleSelectedHandler()(event)
                                    }}
                                >
                                    {row.getVisibleCells().map(cell => (
                    
                                        <td
                                            key={cell.id}
                                            className={cell.column.id === "quota_bytes" ? "hidden sm:table-cell" : ""}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedRSEIDs.map((did, index) => <P key={index}>{did}</P>)}
            <P>{query.fetchStatus}</P>
        </div>
    )
}