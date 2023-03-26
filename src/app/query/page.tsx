'use client'
import {useQuery, useMutation, UseMutationResult, useQueryClient} from '@tanstack/react-query'
import { wrap, proxy, ProxyMarked } from 'comlink'
import { useEffect } from 'react'

type RSE = {
    id: number,
    name: string
}

const RSES: RSE[] = [
    { id: 1, name: 'RSE 1' },
    { id: 2, name: 'RSE 2' },
]


interface Fetch {
    constructor: (url: string, queryMutator: UseMutationResult) => void
    fetch: () => Promise<any>

}

type FetchWorker = {
    eventStream: (url: string) => Promise<RSE[]>
    Fetch: Fetch
}

function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export default function RSEList() {
    const queryClient = useQueryClient()
    const rseQuery = useQuery({
        queryKey: ['rse'], 
        queryFn: () => wait(1000).then(() => RSES),
    })
    

    const rseMutation = useMutation({
        mutationFn: (rse: any) => wait(1000).then(() => RSES.push(rse)),
        onSuccess: (rse) => {
            queryClient.invalidateQueries(['rse'])
        }
    })

    const usingAsyncFunction = async () => {
        const worker = new Worker(new URL('../../../public/fetch_stream.js', import.meta.url))

        const WrappedWorker = wrap<FetchWorker>(worker)

        const rses = await WrappedWorker.eventStream('http://localhost:3000/api/stream')
        rses.forEach((rse: RSE) => {
            rseMutation.mutate(rse)
        })
    }
    const onRequestData = async () => {
        usingAsyncFunction()
    }


    
    if (rseQuery.isLoading) {
        return <div>Loading...</div>
    }

    if(rseQuery.isError) {
        return <div>{JSON.stringify(rseQuery.error)}</div>
    }
    return (
        <div>
            {
                rseQuery.data.map((rse: any) => {
                    return <div key={rse.id}>{rse.name}
                    </div>
                })
            }
            {rseMutation.isLoading? <div>Loading...</div>:
                <button onClick={() => rseMutation.mutate({id: 3, name: 'RSE 3'})}>Add RSE</button>
            }
            <br></br>
            <button onClick={onRequestData}>fetch</button>
        </div>
    )
}

