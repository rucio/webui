import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { useThrottleArray } from '@/lib/infrastructure/hooks/useThrottleArray';

describe('useThrottleArray', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it('Should delay updating the state', async () => {
        const { result } = renderHook(() =>
            useThrottleArray<string>({
                interval: 50,
                maxUpdateLength: 10,
            }),
        );

        act(() => {
            const pushData = result.current[1];
            pushData('test1');
            pushData('test2');
            pushData('test3');
        });

        act(() => {
            jest.advanceTimersByTime(25);
        });

        const data1 = result.current[0];
        expect(data1).toEqual([]);

        await act(async () => {
            jest.advanceTimersByTime(30);
        });

        const data2 = result.current[0];
        expect(data2).toEqual(['test1', 'test2', 'test3']);
    });

    it('Should only update the state by maxUpdateLength', async () => {
        const { result } = renderHook(() =>
            useThrottleArray<string>({
                interval: 50,
                maxUpdateLength: 2,
            }),
        );

        act(() => {
            const pushData = result.current[1];
            pushData('test1');
            pushData('test2');
            pushData('test3');
            pushData('test4');
            pushData('test5');
        });

        // First flush after 50ms
        await act(async () => {
            jest.advanceTimersByTime(50);
        });
        expect(result.current[0]).toEqual(['test1', 'test2']);

        // Second flush after another 50ms
        await act(async () => {
            jest.advanceTimersByTime(50);
        });
        const data2 = result.current[0];
        expect(data2).toEqual(['test1', 'test2', 'test3', 'test4']);

        // Verify that no more than maxUpdateLength items are added per interval
        // The test verifies throttling behavior, not exact final state
        expect(data2.length).toBe(4);
        expect(data2).toContain('test1');
        expect(data2).toContain('test4');
    });

    it('Does not keep updating the state on unmount', async () => {
        const { result, unmount } = renderHook(() =>
            useThrottleArray<string>({
                interval: 50,
                maxUpdateLength: 2,
            }),
        );

        act(() => {
            const pushData = result.current[1];
            pushData('test1');
            pushData('test2');
            pushData('test3');
            pushData('test4');
            pushData('test5');
        });

        // First flush
        await act(async () => {
            jest.advanceTimersByTime(50);
        });

        const data1 = result.current[0];
        expect(data1).toEqual(['test1', 'test2']);

        // Unmount before next flush
        unmount();

        // Advance time but no more updates should occur
        act(() => {
            jest.advanceTimersByTime(300);
        });

        // Should still be the same as before unmount
        const data2 = result.current[0];
        expect(data2).toEqual(['test1', 'test2']);
    });
});
