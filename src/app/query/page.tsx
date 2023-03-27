'use client'
import {useQuery, useMutation, UseMutationResult, useQueryClient} from '@tanstack/react-query'
import { wrap, proxy, ProxyMarked } from 'comlink'
import { useEffect, useState } from 'react'

type RSE = {
    id: number,
    name: string
}

const RSES: RSE[] = [
    { id: -1, name: 'RSE -1' },
    { id: -2, name: 'RSE -2' },
]


interface Fetch {
    new(url: string, queryMutator: UseMutationResult, status: UseMutationResult): Fetch
    fetch: () => Promise<any>

}

type FetchWorker = {
    eventStream: (url: string) => Promise<RSE[]>
    Fetch: Fetch
}

function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function extendRSERows(rses: RSE[]) {
    rses.forEach((rse: RSE) => {
        RSES.push(rse)
    })
}

export default function RSEList() {
    const [isLoading, setIsLoading] = useState(true)

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
        onSuccess: () => {
            queryClient.invalidateQueries(['rse'])
        }
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
        const Fetch = wrap<Fetch>(worker)
        const fetcher = await new Fetch(
            'http://localhost:3000/api/stream', 
            proxy(rseMutation), 
            proxy(qyeryIsReadyToFetch)
        )
        await fetcher.fetch()
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
            {isLoading? <div>Component is Loading...</div>: <div>Component has been Loaded</div>}
            {rseMutation.isLoading? <div>RSE Mutation is Loading...</div>:
                <button onClick={() => rseMutation.mutate([{id: -3, name: 'RSE -3'}])}>Add RSE</button>
            }
            <div>RSE Query: {rseQuery.fetchStatus}</div>
            <br></br>
            <div>RSE Mutation: {rseMutation.status}</div>
            <br></br>
            <div>Component: {isLoading? 'true': 'false'}</div>
            <br></br>
            <button onClick={onRequestData}>fetch</button>
            <br></br>
            {
                rseQuery.data && rseQuery.data.map((rse: any) => {
                    return <div key={rse.id}>{rse.name}
                    </div>
                })
            }
            
        </div>
    )
}

