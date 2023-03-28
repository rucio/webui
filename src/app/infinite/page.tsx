'use client'

import { RSE } from "@/lib/core/entity/rucio"
import { Remote, wrap } from "comlink"
import { Fragment, useReducer, useRef, useState } from "react"
import type { BatchResponse, IFetch } from "@/app/query/page"
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
    const dataRef = useRef<RSE[]>(defaultData)
    const [pollInterval, setPollInterval] = useState(sleepInterval.current)
    const Fetcher = useRef<Remote<IFetch<RSE>> | null>(null)
    const worker = useRef<Worker | null>(null)

    const launchWorker = async () => {
        worker.current = await new Worker('/background-fetch.js')
        const fetchProxyWrapper = wrap<IFetch<RSE>>(worker.current)
        const fetcher = await new fetchProxyWrapper('http://localhost:3000/api/stream', null, null)
        Fetcher.current = fetcher
        dataRef.current = []
        queryClient.setQueryData(['rse'], [])
        setPollInterval(fetchingInterval.current)
    }

    const pollForNextBatch = async () => {
        if (Fetcher.current === null) {
            return dataRef.current
        }

        let isWorkerFinished = await Fetcher.current.getStatus()
        const isNewBatchAvailable = await Fetcher.current.isBatchAvailable()

        if (isWorkerFinished && !isNewBatchAvailable) {
            setPollInterval(sleepInterval.current)
            Fetcher.current = null
            if (worker.current !== null) {
                worker.current.terminate()
            }
            return dataRef.current
        }

        if (!isNewBatchAvailable) {
            return dataRef.current
        }

        const batch = await Fetcher.current.getNextBatch()
        console.log('Batch', batch.id, batch.data)
        dataRef.current.push(...batch.data)
        return dataRef.current
    }

    const getNextPageParam = (lastPage: unknown, allPages: unknown) => {
        console.log('getNextPageParam', lastPage, allPages)
        debugger
        return allPages.length + 1
        const fetcher = Fetcher.current
        if (fetcher === null) {
            return undefined
        }
        // const cachedPagesLength = allPages.length
        // const isWorkerFinished = await fetcher.getStatus()

    }

    // const getPreviousPageParam = (firstPage: unknown, allPages: unknown) => {
    //     console.log('getPreviousPageParam', firstPage, allPages)
    //     return 1
    // }

    const getBatch = async (pageParam: number = 0) => {
        const fetcher = Fetcher.current
        console.log('getBatch: ', pageParam)
        if (fetcher === null) {
            return Promise.reject('Fetcher is null')
        }
        return [
            {
                id: Math.floor(Math.random()*100),
            }
        ]
        const availableBatches = await fetcher.getBatches()
        const isWorkerFinished = await fetcher.getStatus()
        const totalBatches = availableBatches.length
        if (pageParam > totalBatches && isWorkerFinished) {
            // error
            return undefined
        }
        if (pageParam < totalBatches) {
            // get batch with id == pageParam
            const batch = availableBatches.find(b => b.id === pageParam)
            if (batch === undefined) {
                return undefined
            }
            return batch
        }
    }
    const queryClient = useQueryClient()
    const {
        status,
        data,
        error,
        isFetching,
        isFetchingNextPage,
        isFetchingPreviousPage,
        fetchNextPage,
        fetchPreviousPage,
        hasNextPage,
        hasPreviousPage,
    } = useInfiniteQuery({
        queryKey: ['rse'],
        queryFn: async ({ pageParam }) => await getBatch(pageParam),
        getNextPageParam: getNextPageParam,
        getPreviousPageParam: getPreviousPageParam,
    })

    const table = useReactTable<RSE>({
        data: data || [],
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        debugTable: true,
    } as TableOptions<RSE>)


    return (
        <div>
            <h1>Infinite Loading</h1>
            {status === 'loading' ? (
                <p>Loading...</p>
            ) : status === 'error' ? (
                <span>Error: {error.message}</span>
            ) : (
                <>
                    <div>
                        <button
                            onClick={() => fetchPreviousPage()}
                            disabled={!hasPreviousPage || isFetchingPreviousPage}
                        >
                            {isFetchingPreviousPage
                                ? 'Loading more...'
                                : hasPreviousPage
                                    ? 'Load Older'
                                    : 'Nothing more to load'}
                        </button>
                    </div>
                    {/* {data.pages.map((page) => (
                        <Fragment key={page?.nextId}>
                            {page.data.map((rse: RSE) => (
                                <p
                                    style={{
                                        border: '1px solid gray',
                                        borderRadius: '5px',
                                        padding: '10rem 1rem',
                                        background: `hsla(${rse.id * 30}, 60%, 80%, 1)`,
                                    }}
                                    key={rse.id}
                                >
                                    {rse.name}
                                </p>
                            ))}
                        </Fragment>
                    ))} */}
                    <div>
                        <button
                            //   ref={ref}
                            onClick={() => fetchNextPage()}
                            disabled={!hasNextPage || isFetchingNextPage}
                        >
                            {isFetchingNextPage
                                ? 'Loading more...'
                                : hasNextPage
                                    ? 'Load Newer'
                                    : 'Nothing more to load'}
                        </button>
                    </div>
                    <div>
                        {isFetching && !isFetchingNextPage
                            ? 'Background Updating...'
                            : null}
                    </div>
                </>
            )}
            <hr />
            <ReactQueryDevtools initialIsOpen />
        </div>
    )
}