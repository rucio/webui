'use client'
import { RSEAccountUsageLimitDTO} from "@/lib/core/data/rucio-dto"
import useComDOM from "@/lib/infrastructure/hooks/useComDOM"
import { createColumnHelper, flexRender, getCoreRowModel, TableOptions, useReactTable } from "@tanstack/react-table"

const columnHelper = createColumnHelper<RSEAccountUsageLimitDTO>()

const columns: any[] = [
    columnHelper.accessor('rse_id', {
        header: 'ID',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('rse', {
        header: 'Name',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('account', {
        header: 'Account',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('used_files', {
        header: 'Files',
    }),
    columnHelper.accessor('used_bytes', {
        header: 'Used',
    }),
    columnHelper.accessor('quota_bytes', {
        header: 'Quota',
    }),
]


export default function RSEAccountUsage() {
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
    
    const table = useReactTable<RSEAccountUsageLimitDTO>({
        data: query.data || [],
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        debugTable: true,
    } as TableOptions<RSEAccountUsageLimitDTO>)

    return ( 
        <div className="bg-slate-800">
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={async () => {
                await start()
                
            }}>Start</button>
            <button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={async() => {
                await stop()
            }}>Stop</button>
            <button className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900" onClick={ async() => {
                pause()
            }}>Pause</button>
            <button className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={resume}>Resume</button>
            <button className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900" onClick={clean}>Clean</button>
            <div className="flex flex-row">Poll Interval: {pollInterval}</div>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}