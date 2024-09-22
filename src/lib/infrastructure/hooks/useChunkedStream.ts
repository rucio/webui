import { useCallback, useState, useRef, useEffect } from 'react';

export enum StreamingErrorType {
    BAD_METHOD_CALL = 'bad_method_call',
    NETWORK_ERROR = 'network_error',
    BAD_REQUEST = 'bad_request',
    NOT_FOUND = 'not_found',
    INVALID_RESPONSE = 'invalid_response',
    PARSING_ERROR = 'parsing_error',
    UNKNOWN_ERROR = 'unknown_error',
}

export interface StreamingError {
    type: StreamingErrorType;
    message: string;
}

export enum StreamingStatus {
    STOPPED = 'stopped',
    RUNNING = 'running',
}

type StreamingCallback<TData> = (data: TData[]) => void;

/**
 * @param url - A path to the streamed resource
 * @param fetchOptions - A set of options to configure the request
 * @param onData - A callback that accepts each resulting object. Throws an error if the object is invalid
 */
export type StreamingSettings<TData> = {
    url: string;
    fetchOptions?: RequestInit;
    onData: StreamingCallback<TData>;
    updateDelay?: number;
    maxUpdateLength?: number;
};

export interface UseChunkedStream<TData> {
    status: StreamingStatus;
    error: StreamingError | undefined;
    start: (options: StreamingSettings<TData>) => void;
    stop: () => void;
}

/**
 * @description A React hook that fetches and parses NDJSON from a streamable endpoint
 * @template TData - The expected type of received objects
 * @returns status - An indication if there is ongoing streaming
 * @returns start - A function which begins the fetching if there was none prior to the call
 * @returns stop - A function which interrupts the fetching while deleting its state
 * @returns error - A string with explanation of the error
 */
export default function useChunkedStream<TData>(): UseChunkedStream<TData> {
    const [status, setStatus] = useState<StreamingStatus>(StreamingStatus.STOPPED);
    const [error, setError] = useState<StreamingError | undefined>(undefined);
    // These refs are required for the correct state handling during fetching
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        // Cleanup function to terminate the worker
        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
                workerRef.current = null;
            }
        };
    }, []);

    const start = useCallback((settings: StreamingSettings<TData>) => {
        if (workerRef.current) {
            setError({ type: StreamingErrorType.BAD_METHOD_CALL, message: 'Another request is currently running.' });
            return;
        }

        setStatus(StreamingStatus.RUNNING);
        setError(undefined);

        const worker = new Worker('/streamWorker.js');
        workerRef.current = worker;

        worker.onmessage = event => {
            const { type, data, error } = event.data;

            if (type === 'data') {
                settings.onData(data);
            } else if (type === 'error') {
                setError(error);
                if (error.type !== StreamingErrorType.PARSING_ERROR) {
                    stop();
                }
            } else if (type === 'finish') {
                stop();
            }
        };

        worker.postMessage({
            url: settings.url,
            fetchOptions: settings.fetchOptions,
            updateDelay: settings.updateDelay,
            maxUpdateLength: settings.maxUpdateLength,
        });
    }, []);

    const stop = useCallback(() => {
        if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
            setStatus(StreamingStatus.STOPPED);
        } else {
            setError({ type: StreamingErrorType.BAD_METHOD_CALL, message: 'There is no active fetching.' });
        }
    }, []);

    return { stop, start, status, error };
}
