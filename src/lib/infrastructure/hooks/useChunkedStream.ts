import {useCallback, useState, useRef} from "react";

const PAUSE_POLLING_INTERVAL = 100;

export enum StreamingErrorType {
    BAD_METHOD_CALL,
    NETWORK_ERROR,
    BAD_REQUEST,
    NOT_FOUND,
    INVALID_RESPONSE,
    PARSING_ERROR,
}

export interface StreamingError {
    type: StreamingErrorType,
    message: string
}

const getResponseError = async (response: Response) => {
    let message = response.statusText;

    try {
        const jsonResponse = await response.json();
        message = jsonResponse.message ?? message;
    } catch (e) {
    }

    const error: StreamingError = {type: StreamingErrorType.INVALID_RESPONSE, message: message};
    if (response.status === 404) {
        error.type = StreamingErrorType.NOT_FOUND;
    } else if (response.status === 400) {
        error.type = StreamingErrorType.BAD_REQUEST;
    }
    return error;
}

export enum StreamingStatus {
    STOPPED = 'stopped',
    RUNNING = 'running',
    PAUSED = 'paused'
}

/**
 * @description An asynchronous generator which reads an NDJSON stream and yields TData objects
 * @template TData - The expected type of received objects
 * @param reader - A reader of the readable stream
 */
async function* processStream<TData>(reader: ReadableStreamDefaultReader<Uint8Array>): AsyncGenerator<TData> {
    const decoder = new TextDecoder();
    let partialData = '';

    while (true) {
        const {done, value} = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, {stream: true});
        partialData += chunk;

        // Split on newline characters to process complete lines
        const lines = partialData.split('\n');

        // The last element might be a partial line, so save it
        partialData = lines.pop() ?? '';

        // Parse and add complete JSON lines
        const parsedObjects: TData[] = lines.map(line => JSON.parse(line));
        for (const parsedObject of parsedObjects) {
            yield parsedObject;
        }
    }

    // Process any remaining partial data after the stream ends
    if (partialData) {
        yield JSON.parse(partialData);
    }

    reader.releaseLock(); // Release the reader lock when done
}

type StreamingCallback<TData> = (data: TData) => void;

/**
 * @param url - A path to the streamed resource
 * @param fetchOptions - A set of options to configure the request
 * @param onData - A callback that accepts each resulting object. Throws an error if the object is invalid
 */
export type StreamingSettings<TData> = {
    url: string,
    fetchOptions?: RequestInit,
    onData: StreamingCallback<TData>
}

export interface UseChunkedStream<TData> {
    status: StreamingStatus,
    error: StreamingError | undefined,
    start: (options: StreamingSettings<TData>) => void,
    stop: () => void,
    pause: () => void,
    resume: () => void,
}

/**
 * @description A React hook that fetches and parses NDJSON from a streamable endpoint
 * @template TData - The expected type of received objects
 * @returns status - An indication if there is ongoing streaming
 * @returns start - A function which begins the fetching if there was none prior to the call
 * @returns stop - A function which interrupts the fetching while deleting its state
 * @returns error - A string with explanation of the error
 * @returns pause - A function which interrupts the fetching while preserving its state
 * @returns resume - A function that continues paused fetching
 */
export default function useChunkedStream<TData>(): UseChunkedStream<TData> {
    const [status, setStatus] = useState<StreamingStatus>(StreamingStatus.STOPPED);
    const [error, setError] = useState<StreamingError | undefined>(undefined);
    const controllerRef = useRef<AbortController | null>(null);
    // These refs are required for the correct state handling during fetching
    const isStreaming = useRef(false);
    const isPaused = useRef(false);

    const start = useCallback((settings: StreamingSettings<TData>) => {
        if (isStreaming.current) {
            setError({type: StreamingErrorType.BAD_METHOD_CALL, message: 'Another request is currently running.'});
            return;
        }
        isStreaming.current = true;
        isPaused.current = false;
        setStatus(StreamingStatus.RUNNING);
        setError(undefined);

        controllerRef.current = new AbortController();
        const {signal} = controllerRef.current;

        // Boolean flags to determine a NOT_FOUND error
        let isDataReceived = false;
        let hadFatalError = false;

        const fetchStream = async () => {
            let response: Response;

            try {
                const finalOptions = settings.fetchOptions ? {...settings.fetchOptions, signal} : {signal}
                response = await fetch(settings.url, finalOptions);
            } catch (e: any) {
                hadFatalError = true;
                setError({type: StreamingErrorType.NETWORK_ERROR, message: e.toString()});
                return;
            }

            if (!response.ok) {
                hadFatalError = true;
                setError(await getResponseError(response));
                return;
            }

            const reader = response.body!.getReader();
            for await (const data of processStream<TData>(reader)) {
                // Handle stopping
                if (signal.aborted) {
                    return;
                }
                // Handle pausing
                if (isPaused.current) {
                    while (isPaused.current) {
                        await new Promise(resolve => setTimeout(resolve, PAUSE_POLLING_INTERVAL));
                    }
                }
                // Handle passing invalid data
                try {
                    settings.onData(data);
                    isDataReceived = true;
                } catch (_) {
                    // Data has been rejected
                }
            }
        };

        fetchStream()
            .catch((e: any) => {
                if (e.name !== 'AbortError') {
                    hadFatalError = true;
                    setError({type: StreamingErrorType.PARSING_ERROR, message: e.toString()});
                }
            })
            .then(() => {
                setStatus(StreamingStatus.STOPPED);
                isStreaming.current = false;
                if (!hadFatalError && !isDataReceived) {
                    setError({type: StreamingErrorType.NOT_FOUND, message: 'Received an empty response.'});
                }
            });
    }, []);

    const stop = useCallback(() => {
        if (!isStreaming.current) {
            setError({type: StreamingErrorType.BAD_METHOD_CALL, message: 'There is no active fetching.'});
        } else if (controllerRef.current) {
            controllerRef.current.abort();
            setStatus(StreamingStatus.STOPPED);
            isPaused.current = false;
        }
    }, []);

    const pause = useCallback(() => {
        if (isStreaming.current) {
            isPaused.current = true;
            setStatus(StreamingStatus.PAUSED);
        } else {
            setError({type: StreamingErrorType.BAD_METHOD_CALL, message: 'There is no active fetching.'});
        }
    }, []);

    const resume = useCallback(() => {
        if (isPaused.current) {
            isPaused.current = false;
            setStatus(StreamingStatus.RUNNING);
        } else {
            setError({type: StreamingErrorType.BAD_METHOD_CALL, message: 'There is no active fetching.'});
        }
    }, []);

    return {stop, start, status, error, pause, resume};
}