import { useCallback, useEffect, useRef, useState } from 'react';

type ThrottleArrayOptions = {
    interval: number;
    maxUpdateLength: number;
};

/**
 * A React hook that accepts data and flushes no more than {options.maxUpdateLength} elements each {options.interval} ms.
 * @param options
 * @returns data - a desired state of the array
 * @returns pushData - a function to enqueue an element for the state update
 */
export function useThrottleArray<T>(options: ThrottleArrayOptions): [T[], (item: T) => void] {
    const [data, setData] = useState<T[]>([]);
    const bufferRef = useRef<T[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Don't update the state with incoming data; push it to the buffer instead
    const pushData = useCallback((item: T) => {
        bufferRef.current.push(item);
    }, []);

    const flushBuffer = useCallback(() => {
        if (bufferRef.current.length === 0) return;

        if (bufferRef.current.length > options.maxUpdateLength) {
            // Remove the first {options.maxUpdateLength} elements from the buffer
            const newBuffer: T[] = bufferRef.current.splice(0, options.maxUpdateLength);
            setData(prevData => [...prevData, ...newBuffer]);
        } else {
            setData(prevData => [...prevData, ...bufferRef.current]);
            bufferRef.current = [];
        }
    }, []);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            flushBuffer();
        }, options.interval);

        // Cleanup interval on component unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [options.interval, flushBuffer]);

    return [data, pushData];
}
