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
}

/**
 * @description The status of the useComDOM hook, derived from the status of the query and the web worker.
 * @enum string STOPPED - The ComDOM web worker does not exist
 * @enum PAUSED - The query has been paused, but the ComDOM web worker is still exists
 * @enum RUNNING - The query is running
 * @enum DONE - The query is done, ComDOM web worker has also finished fetching all data.
 */
export enum UseComDOMStatus {
    STOPPED = 'stopped',
    PAUSED = 'paused',
    RUNNING = 'running',
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
    const dataSink = useRef<TData[]>(initialData)
    const comDOMWrapper: IComDOMWrapper<TData> = useMemo(() => {
        return new ComDOMWrapper<TData>(requestURL, fetchOnCreate, debug)
    }, [requestURL, fetchOnCreate, debug])
    const [comDOMStatus, setComDOMStatus] = useState<ComDOMStatus>(
        ComDOMStatus.UNKNOWN,
    )

    const [errors, setErrors] = useState<ComDOMError[]>([])
    const errorId = useRef(0)
    const [pollInterval, setPollInterval] = useState(
        fetchOnCreate ? fetchInterval : Infinity,
    )
    const [status, setStatus] = useState<UseComDOMStatus>(
        UseComDOMStatus.STOPPED,
    )
    const queryClient = useQueryClient()
    const queryKey = [requestURL.hostname, requestURL.pathname]

    useEffect(() => {
        if (fetchOnCreate) {
            start()
        }
    }, [fetchOnCreate])

    const _log = (...args: any[]) => {
        if (debug) {
            console.log(
                'useComDOM Hook: ',
                new Date().toTimeString(),
                ':',
                ...args,
            )
        }
    }

    const resolveError = (id: number) => {
        setErrors(errors => errors.filter(error => error.id !== id))
    }

    const resolveAllErrors = () => {
        setErrors([])
    }

    const reportError = (message: string, cause: string) => {
        // setStatus(UseComDOMStatus.ERROR)
        _log('Error', message, cause)
        errorId.current += 1
        const error = {
            id: errorId.current ,
            message: message,
            cause: cause,
        }
        setErrors([...errors, error])
    }
    const comDOMStatusQueryFn = async () => {
        try {
            const status = await comDOMWrapper.getComDOMStatus()
            setComDOMStatus(status)
            return status
        } catch (error: any) {
            reportError(error, 'Error fetching ComDOM status')
        }
    }

    const queryFn = async () => {
        if (
            comDOMStatus !== ComDOMStatus.RUNNING &&
            comDOMStatus !== ComDOMStatus.DONE
        ) {
            _log(
                'ComDOM Web Worker is not running. The query will not fetch any data',
                'ComDOM Status:',
                comDOMStatus,
            )
            return Promise.reject(
                'ComDOM Web Worker has not been created or it is not running. The query will not fetch any data',
            )
        }
        try {
            setStatus(UseComDOMStatus.RUNNING)
            const batchResponse: BatchResponse<TData> | null =
                await comDOMWrapper.next()
            if (batchResponse == null || !batchResponse.next) {
                setPollInterval(restInterval)
                setStatus(UseComDOMStatus.DONE)
                return Promise.reject('ComDOM has finished fetching all data')
            }
            dataSink.current.push(...batchResponse.data)
            return dataSink.current
        } catch (error: any) {
            reportError(error, 'Error fetching data from background thread')
            setStatus(UseComDOMStatus.ERROR)
            return Promise.reject(error)
        }
    }

    const query = useQuery({
        queryKey: queryKey,
        queryFn: queryFn,
        initialData: initialData,
        refetchInterval: pollInterval,
        refetchOnWindowFocus: fetchOnCreate,
        refetchOnMount: fetchOnCreate,
    })

    const comDOMStatusQuery = useQuery({
        queryKey: [...queryKey, 'comdom-status'],
        queryFn: comDOMStatusQueryFn,
        refetchInterval: pollInterval,
    })

    const start = async () => {
        try {
            _log('Resetting data sink')
            dataSink.current = initialData
            _log('Starting ComDOM')
            const status = await comDOMWrapper.start()
            if (!status) {
                throw new Error('Error starting ComDOM')
            }
            setPollInterval(fetchInterval)
            const workerStatus = await comDOMWrapper.getComDOMStatus()
            if (workerStatus === ComDOMStatus.UNKNOWN) {
                throw new Error('Unknown ComDOM Web Worker status')
            }
            setComDOMStatus(workerStatus)
            return true
        } catch (error: any) {
            _log('Error starting ComDOM', error)
            reportError(error.message, error.cause)
            return false
        }
    }

    const stop = async () => {
        _log('Stopping ComDOM')
        setPollInterval(Infinity)
        const success = comDOMWrapper.destroy()
        if (success) {
            setStatus(UseComDOMStatus.STOPPED)
        } else {
            reportError('Error stopping ComDOM', 'Error Destroying ComDOM')
            setStatus(UseComDOMStatus.ERROR)
        }
        return success
    }

    const pause = () => {
        setPollInterval(Infinity)
        if (comDOMStatus !== ComDOMStatus.RUNNING) {
            _log('Cannot pause a non-running ComDOM')
            return false
        }
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
        dataSink,
        status,
        start,
        stop,
        pause,
        resume,
        clean,
        comDOMStatus,
        pollInterval,
        errors,
        resolveError,
        resolveAllErrors,
    }
}
