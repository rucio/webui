'use client'
import { H3 } from "@/component-library/components/Text/Headings/H3"
import { P } from "@/component-library/components/Text/Content/P"

import { useEffect, useState } from "react"

import { RSEAccountUsageLimitDTO } from "@/lib/core/data/rucio-dto"
import useComDOM from "@/lib/infrastructure/hooks/useComDOM"
import { createColumnHelper, flexRender, getCoreRowModel, TableOptions, useReactTable, Row } from "@tanstack/react-table"

const columnHelper = createColumnHelper<RSEAccountUsageLimitDTO>()



export default function RSEAccountUsage() {
    const isNoQuotaLeftFunction = (row: Row<RSEAccountUsageLimitDTO>) => {
        return (row.original.quota_bytes && row.original.quota_bytes < row.original.used_bytes)
    }

    const [selectedRSEIDs, setSelectedRSEIDs] = useState<string[]>([])

    const columns: any[] = [
        {
            id: 'selection',
            header: () => <span className="w-8" />,
            cell: (props: any) => {
                return <span className="ml-2 w-8">
                    <input
                        type="checkbox"
                        disabled={
                            // if quota_bytes is less than used_bytes, disable checkbox
                            // TODO handle "askpermission" case
                            isNoQuotaLeftFunction(props.row) ? true : false
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
                if (isNoQuotaLeftFunction(props.row)) {
                    return <P mono className="text-red-500 dark:text-red-500 font-bold">{props.row.original.used_bytes}</P>
                }
                return <P mono>{props.row.original.used_bytes}</P>
            },
        }),
        columnHelper.accessor(row => row.quota_bytes - row.used_bytes, {
            id: 'remaining_bytes',
            header: () => <H3>Remaining</H3>,
            cell: (props) => {
                // if value is greater than quota bytes, print in red
                if (isNoQuotaLeftFunction(props.row)) {
                    return <P mono className="text-red-500 dark:text-red-500 font-bold">{props.row.original.quota_bytes - props.row.original.used_bytes}</P>
                }
                return <P mono>{props.row.original.quota_bytes - props.row.original.used_bytes}</P>
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
            used_bytes: false,
            remaining_bytes: true,
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
        <div className="dark:bg-gray-900">
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
                <div className={`h-72 overflow-y-auto border dark:border-2 rounded-md ${query.fetchStatus === "fetching" ? "hover:cursor-wait" : ""}`}>
                    <table className="table-fixed w-full text-left">
                        <thead className="w-full">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr
                                    key={headerGroup.id}
                                    className="w-full flex-row sticky top-0 bg-white dark:bg-gray-700 shadow-md dark:shadow-none h-12"
                                >
                                    <th className="w-8 grow-0"></th>
                                    <th className="w-1/2 flex-auto"><H3>RSE Name</H3></th>
                                    <th className="flex-initial"><H3>Remaining Quota</H3></th>
                                    <th className="hidden sm:table-cell sm:flex-initial"><H3>Total Quota</H3></th>
                                </tr>
                            ))}
                        </thead>
                        <tbody
                            className="w-full"
                        >
                            {table.getRowModel().rows.map((row) => {
                                const classes = "w-full border-b dark:border-gray-200 hover:cursor-pointer h-8 "  // maybe handle spinnywheel here
                                const classesNormal = classes + "hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-900 "
                                const classesSelected = classes + "bg-blue-200 hover:bg-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600"
                                const rse_id = row.original.rse_id
                                const isRSESelected = selectedRSEIDs.includes(rse_id)
                                return (
                                    <tr
                                        className={isRSESelected ? classesSelected : classesNormal}
                                        key={row.id}
                                        onClick={(event) => {
                                            // if there is no more quota remaining, do nothing on click
                                            if (isNoQuotaLeftFunction(row)) {
                                                console.log(isNoQuotaLeftFunction(row))
                                                return
                                            }
                                            if (isRSESelected) {
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
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedRSEIDs.map((did, index) => <P key={index}>{did}</P>)}
            <P>{query.fetchStatus}</P>
        </div>
    )
}