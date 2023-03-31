import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, useRef, useMemo, useEffect } from 'react'
import ComDOMWrapper, {
    BatchResponse,
    ComDOMStatus,
    IComDOMWrapper,
} from '../web-worker/comdom-wrapper'

export type ComDOMError = {
    id: number
    message: string
    cause: string
    resolved: boolean
}

export enum UseComDOMStatus {
    NOT_STARTED = 'not_started',
    PAUSED = 'paused',
    FETCHING = 'fetching',
    DONE = 'done',
    ERROR = 'error',
}


export default function useComDOM<TData>(
    url: string,
    initialData: TData[] = [],
    fetchOnCreate: boolean = false,
    restInterval: number = Infinity,
    fetchInterval: number = 200,
    debug: boolean = false,
) {
    const requestURL = useMemo(() => new URL(url), [url])
    const comDOM: IComDOMWrapper<TData> = useMemo(() => {
        return new ComDOMWrapper<TData>(requestURL, fetchOnCreate, debug)
    }, [requestURL, fetchOnCreate, debug])
    const [comDOMStatus, setComDOMStatus] = useState<ComDOMStatus>(ComDOMStatus.NOT_STARTED)

    const errors = useRef<ComDOMError[]>([])
    const [errorSignal, setErrorSignal] = useState(false)
    const [pollInterval, setPollInterval] = useState(fetchOnCreate ? fetchInterval : Infinity)
    const [status, setStatus] = useState<UseComDOMStatus>(UseComDOMStatus.NOT_STARTED)
    const queryClient = useQueryClient()
    const queryKey = [requestURL.hostname, requestURL.pathname]
    
    const _log = (...args: any[]) => {
        if (debug) {
            console.log(...args)
        }
    }

    
    const resolveError = (id: number) => {
        const error = errors.current.find(error => error.id === id)
        if (error) {
            error.resolved = true
        }
        // if all errors are resolved, reset the error signal
        if (errors.current.every(error => error.resolved)) {
            setErrorSignal(false)
        }
    }

    const resolveAllErrors = () => {
        errors.current.forEach(error => (error.resolved = true))
        setErrorSignal(false)
    }

    const getResolvedErrors = () => {
        return errors.current.filter(error => error.resolved)
    }

    const getUnresolvedErrors = () => {
        return errors.current.filter(error => !error.resolved)
    }

    const setError = (message: string, cause: string) => {
        setStatus(UseComDOMStatus.ERROR)
        errors.current.push({
            id: errors.current.length + 1,
            message: message,
            cause: cause,
            resolved: false,
        })
        setErrorSignal(true)
    }

    const queryFn = async () => {
        
        const comDOMStatus = await comDOM.getComDOMStatus()
        if (comDOMStatus === ComDOMStatus.NOT_STARTED) {
            await comDOM.start()
        }
        setStatus(UseComDOMStatus.FETCHING)
        try {
            const batchResponse: BatchResponse<TData> | null =
                await comDOM.next()
            if (batchResponse == null || !batchResponse.next) {
                setPollInterval(restInterval)
                setStatus(UseComDOMStatus.DONE)
                return undefined
            }
            return batchResponse.data
        } catch (error: any) {
            setError(error.message, error.cause)
            return undefined
        }
    }

    const query = useQuery({
        queryKey: queryKey,
        queryFn: queryFn,
        initialData: initialData,
        refetchInterval: pollInterval,
    })

    const comDOMStatusQuery = useQuery({
        queryKey: [...queryKey, 'comdom-status'],
        queryFn: async () => {
            const status = await comDOM.getComDOMStatus()
            setComDOMStatus(status)
            return status
        },
        refetchInterval: pollInterval,
    })

    const start = async () => {
        _log('Starting ComDOM')
        setStatus(UseComDOMStatus.FETCHING)
        try {
            await comDOM.start()
            setPollInterval(fetchInterval)
            return true
        } catch (error: any) {
            _log('Error starting ComDOM', error)
            setError(error.message, error.cause)
            return false
        }
    }

    const stop = async () => {
        _log('Stopping ComDOM')
        const success = comDOM.destroy()
        if (success){
            setPollInterval(Infinity)
        }
        return success
    }

    const pause = () => {
        setPollInterval(Infinity)
        setStatus(UseComDOMStatus.PAUSED)
        return true
    }

    const resume = () => {
        setPollInterval(fetchInterval)
        return true
    }

    const clean = () => {
        try {
            queryClient.setQueriesData(queryKey, initialData)
        } catch (error: any) {
            _log('Error cleaning ComDOM', error)
            return false
        }
        return true
    }

    return {
        query,
        status,
        start,
        stop,
        pause,
        resume,
        clean,
        comDOMStatus,
        errors: {
            signal: errorSignal,
            all: errors.current,
            resolved: getResolvedErrors(),
            unresolved: getUnresolvedErrors(),
            resolve: resolveError,
            resolveAll: resolveAllErrors,
        },
    }
}
