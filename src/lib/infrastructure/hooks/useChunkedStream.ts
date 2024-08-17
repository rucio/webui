import {useCallback, useState, useRef} from "react";

export enum StreamingStatus {
    STOPPED = 'stopped',
    RUNNING = 'running'
    // May be extended
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

/**
 * @description A React hook that fetches and parses NDJSON from a streamable endpoint
 * @template TData - The expected type of received objects
 * @param onData - A callback function which subscribes to streaming updates
 * @returns status - An indication if there is ongoing streaming
 * @returns start - A function which begins the fetching if there was none prior to the call
 * @returns stop - A function which interrupts the fetching
 * @returns error - A string with explanation of the error
 */
export default function useChunkedStream<TData>(
    onData: (data: TData) => void
) {
    const [status, setStatus] = useState<StreamingStatus>(StreamingStatus.STOPPED);
    const [error, setError] = useState<string | undefined>(undefined);
    const controllerRef = useRef<AbortController | null>(null);
    const isStreaming = useRef(false);

    const start = useCallback((url: string, options = {}) => {
        if (isStreaming.current) {
            throw new Error('Another request is currently running.');
        }
        isStreaming.current = true;
        setStatus(StreamingStatus.RUNNING);
        setError(undefined);

        controllerRef.current = new AbortController();
        const {signal} = controllerRef.current;

        const fetchStream = async () => {
            const response = await fetch(url, {...options, signal});

            if (!response.ok) {
                throw new Error(`The response has sent a ${response.status} status code. ${response.statusText}`);
            }

            const reader = response.body!.getReader();
            for await (const data of processStream<TData>(reader)) {
                if (signal.aborted) {
                    return;
                }
                onData(data);
            }
        };

        fetchStream()
            .catch((e: any) => {
                setError(e.toString());
            })
            .then(() => {
                setStatus(StreamingStatus.STOPPED);
                isStreaming.current = false;
            });
    }, [onData]);

    const stop = useCallback(() => {
        if (controllerRef.current) {
            controllerRef.current.abort();
            setStatus(StreamingStatus.STOPPED);
        }
    }, []);

    return {stop, start, status, error};
}