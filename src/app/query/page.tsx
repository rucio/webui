'use client'
import { useQuery, useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { wrap, proxy, ProxyMarked } from 'comlink'
import { useEffect, useState } from 'react'


type RSE = {
    id: number,
    name: string,
    city: string,
    country: string,
    continent: string,
    latitude: number,
    longitude: number,
    rse_type: string,
    volatile: boolean,
}

const RSES: RSE[] = []

export type BatchResponse<T> = {
    id: number,
    data: T[]
}
export interface IFetch<T> {
    new(url: string, queryMutator: UseMutationResult<void, unknown, T[], unknown> | null, status: (() => boolean) | null): IFetch<T>
    fetch: () => Promise<any>
    getNextBatch: () => Promise<BatchResponse<T>>
    getStatus: () => Promise<boolean>
    isBatchAvailable: () => Promise<boolean>
}

type FetchWorker = {
    eventStream: (url: string) => Promise<RSE[]>
    Fetch: IFetch<RSE>
}

export function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function extendRSERows(rses: RSE[]) {
    rses.forEach((rse: RSE) => {
        RSES.push(rse)
    })
}

export default function RSEList() {
    const [isLoading, setIsLoading] = useState(true)
    const columns: string[] = ['id', 'name', 'city', 'country', 'continent', 'latitude', 'longitude', 'rse_type', 'volatile']
    useEffect(() => {
        setIsLoading(false)
    }, [])


    const queryClient = useQueryClient()
    const rseQuery = useQuery({
        queryKey: ['rse'],
        queryFn: () => wait(1000).then(() => RSES),
    })


    const rseMutation = useMutation({
        mutationFn: extendRSERows,
        // onSuccess: () => {
        //     queryClient.invalidateQueries(['rse'])
        // }
    })

    const qyeryIsReadyToFetch = () => {
        return rseQuery.fetchStatus === 'idle'
    }
    const usingAsyncFunction = async () => {
        const worker = new Worker('/fetch_stream.js')

        const WrappedWorker = wrap<FetchWorker>(worker)

        const rses = await WrappedWorker.eventStream('http://localhost:3000/api/stream')
        rseMutation.mutate(rses)
    }

    const usingFetchClass = async () => {
        const worker = new Worker('/fetch_stream.js')
        const Fetch = wrap<IFetch<RSE>>(worker)
        const fetcher = await new Fetch(
            'http://localhost:3000/api/stream',
            proxy(rseMutation),
            proxy(qyeryIsReadyToFetch)
        )
        await fetcher.fetch()
        console.log(await fetcher.getBatches())
    }
    const onRequestData = async () => {
        // usingAsyncFunction()
        usingFetchClass()
    }



    // if (rseQuery.isLoading) {
    //     return <div>Loading...</div>
    // }

    // if(rseQuery.isError) {
    //     return <div>{JSON.stringify(rseQuery.error)}</div>
    // }
    return (
        <div>
            {isLoading ? <div>Component is Loading...</div> : <div>Component has been Loaded</div>}
            {/* {rseMutation.isLoading? <div>RSE Mutation is Loading...</div>:
                <button onClick={() => rseMutation.mutate([{id: -3, name: 'RSE -3'}])}>Add RSE</button>
            } */}
            <div>RSE Query: {rseQuery.fetchStatus}</div>
            <br></br>
            <div>RSE Mutation: {rseMutation.status}</div>
            <br></br>
            <div>Component: {isLoading ? 'true' : 'false'}</div>
            <br></br>
            <button onClick={onRequestData}>fetch</button>
            <br></br>
            <table>
                <thead>
                    <tr>
                    {
                        columns.map((column: string) => {
                            return <th key={column}>{column}</th>
                        })
                    }
                    </tr>
                </thead>
                <tbody>
                    {
                        rseQuery.data && rseQuery.data.map((rse: RSE) => {
                            return ( 
                                <tr key={rse.id}>
                                    <td>{rse.id}</td>
                                    <td>{rse.name}</td>
                                    <td>{rse.city}</td>
                                    <td>{rse.country}</td>
                                    <td>{rse.continent}</td>
                                    <td>{rse.latitude}</td>
                                    <td>{rse.longitude}</td>
                                    <td>{rse.rse_type}</td>
                                    <td>{rse.volatile? "True": "False"}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>

            </table>


        </div>
    )
}

