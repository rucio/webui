'use client'

import { RSE } from "@/lib/core/entity/rucio"
import { Remote, wrap } from "comlink"
import { useReducer, useRef, useState } from "react"
import type { IFetch } from "@/app/query/page"
import { createColumnHelper, useReactTable, getCoreRowModel, TableOptions, flexRender } from "@tanstack/react-table"
import '@/component-library/outputtailwind.css'
import { Query, QueryKey, useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"



const columnHelper = createColumnHelper<RSE>()

const columns: any[] = [
    columnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('city', {
        header: 'City',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('country', {
        header: 'Country',
    }),
    columnHelper.accessor('continent', {
        header: 'Continent',
    }),
    columnHelper.accessor('latitude', {
        header: 'Latitude',
    }),
    columnHelper.accessor('longitude', {
        header: 'Longitude',
    }),
    columnHelper.accessor('rse_type', {
        header: 'RSE Type',
    }),
    columnHelper.accessor('volatile', {
        header: 'Volatile',
    }),
]

export default function RSETable() {
    // const [rses, setRSEs] = useState<RSE[]>(defaultData)
    const defaultData: RSE[] = []
    const rerender = useReducer(() => ({}), {})[1]
    const fetchingInterval = useRef<number>(200)
    const sleepInterval = useRef<number>(10000)
    const data = useRef<RSE[]>(defaultData)
    const [pollInterval, setPollInterval] = useState(sleepInterval.current)
    const Fetcher = useRef<Remote<IFetch<RSE>> | null>(null)
    const worker = useRef<Worker | null>(null)
    
    const launchWorker = async () => {
        worker.current = await new Worker('/background-fetch.js') 
        const fetchProxyWrapper = wrap<IFetch<RSE>>(worker.current)
        const fetcher = await new fetchProxyWrapper('http://localhost:3000/api/stream', null, null)
        Fetcher.current = fetcher
        data.current = []
        queryClient.setQueryData(['rse'], [])
        setPollInterval(fetchingInterval.current)
    }

    const pollForNextBatch = async () => {
        if (Fetcher.current === null) {
            return data.current
        }

        let isWorkerFinished = await Fetcher.current.getStatus()
        const isNewBatchAvailable = await Fetcher.current.isBatchAvailable()
        
        if (isWorkerFinished && !isNewBatchAvailable) {
            setPollInterval(sleepInterval.current)
            Fetcher.current = null
            if (worker.current !== null) {
                worker.current.terminate()
            }
            return data.current
        }
        
        if (!isNewBatchAvailable) {
            return data.current
        }

        const batch = await Fetcher.current.getNextBatch()
        console.log('Batch', batch.id, batch.data)
        data.current.push(...batch.data)
        return data.current
    }

    const queryClient = useQueryClient()
    const rseQuery = useQuery({
        queryKey: ['rse'],
        queryFn: pollForNextBatch,
        refetchInterval: pollInterval,
    })

    const table = useReactTable<RSE>({
        data: rseQuery.data || [],
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        debugTable: true,
    } as TableOptions<RSE>)

    
    return (
        <div>
            <h1 className="text-3xl font-bold underline">
                List RSEs
            </h1>
            <button onClick={() => rerender()} className="border p-2">
                Rerender
            </button>
            <button onClick={() => launchWorker()} className="border p-2">
                Fetch
            </button>
            <ReactQueryDevtools />
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