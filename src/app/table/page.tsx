'use client'

import { RSE } from "@/lib/core/entity/rucio"
import { proxy, Remote, wrap } from "comlink"
import { useMemo, useReducer, useRef, useState } from "react"
import type { IFetch } from "@/app/query/page"
import { wait } from "@/app/query/page"
import { createColumnHelper, useReactTable, getCoreRowModel, TableOptions, flexRender } from "@tanstack/react-table"
import '@/component-library/outputtailwind.css'
import { Query, QueryKey, useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const defaultData: RSE[] = []

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
    const [rses, setRSEs] = useState<RSE[]>(defaultData)
    const rerender = useReducer(() => ({}), {})[1]

    
    const Fetcher = useRef<Remote<IFetch<RSE>> | null>(null)
    const worker = useMemo<Worker>( () => { return new Worker('background-fetch.js')} , [])
    
    const startNewWorker = async () => {
        const fetchProxyWrapper = wrap<IFetch<RSE>>(worker)
        const fetcher = await new fetchProxyWrapper('http://localhost:3000/api/stream', null, null)
        Fetcher.current = fetcher
        // sleep for 2 seconds using setTImeout
        // await new Promise(resolve => setTimeout(resolve, 2000))

        // console.log('Status', await Fetcher.current.getStatus())
        // console.log('isDataAvailable', await Fetcher.current.isBatchAvailable())
        // const batch = await Fetcher.current.getNextBatch()
        // console.log('Batch', batch)
        // console.log('isDataAvailable', await Fetcher.current.isBatchAvailable())
        
    }

    const fetchRSEBatch = async () => {
        if (Fetcher.current === null) {
            const fetchProxyWrapper = wrap<IFetch<RSE>>(worker)
            const fetcher = await new fetchProxyWrapper('http://localhost:3000/api/stream', null, null)
            Fetcher.current = fetcher
        }
        let isWorkerFinished = await Fetcher.current.getStatus()
        let isBatchAvailable = await Fetcher.current.isBatchAvailable()
        while (!isWorkerFinished) {
            
        }
        const isNewBatchAvailable = await Fetcher.current.isBatchAvailable()
        if (!isNewBatchAvailable) {
            return []
        }
        const batch = await Fetcher.current.getNextBatch()
        console.log('Batch', batch.id, batch.data)
        return batch.data
    }

    const queryClient = useQueryClient()

    const rseQuery = useInfiniteQuery({
        queryKey: ['rse'],
        queryFn: fetchRSEBatch,
        keepPreviousData: true,
        refetchInterval: (data, query) => {
            console.log('DATA', data)
            console.log('QUERY', query)
            return Infinity
        }

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
            <button onClick={() => rerender()} className="border p-2">
                Rerender
            </button>
            <button onClick={() => startNewWorker()} className="border p-2">
                Fetch
            </button>
        </div>
    )



    // const fetchRSEs = async () => {
    //     const worker = new Worker('/fetch_stream.js')
    //     const Fetch = wrap<IFetch>(worker)
    //     const fetcher = await new Fetch(
    //         'http://localhost:3000/api/stream',
    //         proxy(setRSEs),
    //         () => false
    //     )

    // }
}