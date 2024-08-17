import {BaseViewModel} from "@/lib/sdk/view-models";
import {useCallback, useState, useRef} from "react";

export enum StreamingStatus {
    STOPPED = 'stopped',
    RUNNING = 'running'
    // May be extended
}

export default function useChunkedStream<TData extends BaseViewModel>(
    onData: (data: TData) => void
) {
    const [status, setStatus] = useState<StreamingStatus>(StreamingStatus.STOPPED);
    const controllerRef = useRef<AbortController | null>(null);
    const isStreaming = useRef(false);

    const start = useCallback((url: string, options = {}) => {
        if (isStreaming.current) {
            throw new Error('Another request is currently running.');
        }
        isStreaming.current = true;
        setStatus(StreamingStatus.RUNNING);

        controllerRef.current = new AbortController();
        const { signal } = controllerRef.current;

        const fetchStream = async () => {
            try {
                const response = await fetch(url, { ...options, signal });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const reader = response.body!.getReader();
                const decoder = new TextDecoder();
                let partialData = '';

                const processStream = async () => {
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
                        parsedObjects.forEach((parsedObject) => onData(parsedObject))
                    }

                    // Process any remaining partial data after the stream ends
                    if (partialData) {
                        try {
                            const parsedObject: TData = JSON.parse(partialData);
                            onData(parsedObject);
                        } catch (e) {
                            console.error("Failed to parse remaining partial data", e);
                        }
                    }

                    reader.releaseLock(); // Release the reader lock when done
                };

                await processStream();

            } catch (e) {
                console.log(e);
            } finally {
                setStatus(StreamingStatus.STOPPED);
                isStreaming.current = false;
            }
        };

        fetchStream();
    }, [onData]);

    return { start, status };
}