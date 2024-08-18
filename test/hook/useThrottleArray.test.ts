import {act, cleanup, renderHook} from "@testing-library/react-hooks";
import {useThrottleArray} from "@/lib/infrastructure/hooks/useThrottleArray";

describe('useThrottleArray', () => {
    afterEach(() => {
        cleanup();
    });

    it('Should delay updating the state', async () => {
        const {result, waitForNextUpdate} = renderHook(() => useThrottleArray<string>({
            interval: 50,
            maxUpdateLength: 10
        }));

        act(() => {
            const pushData = result.current[1];
            pushData('test1');
            pushData('test2');
            pushData('test3');
        });

        await new Promise(resolve => setTimeout(resolve, 25));

        const data1 = result.current[0];
        expect(data1).toEqual([]);

        await waitForNextUpdate();

        const data2 = result.current[0];
        expect(data2).toEqual(['test1', 'test2', 'test3']);
    });

    it('Should only update the state by maxUpdateLength', async () => {
        const {result, waitForNextUpdate} = renderHook(() => useThrottleArray<string>({
            interval: 50,
            maxUpdateLength: 2
        }));

        act(() => {
            const pushData = result.current[1];
            pushData('test1');
            pushData('test2');
            pushData('test3');
            pushData('test4');
            pushData('test5');
        });

        await waitForNextUpdate();

        const data1 = result.current[0];
        expect(data1).toEqual(['test1', 'test2']);

        await waitForNextUpdate();

        const data2 = result.current[0];
        expect(data2).toEqual(['test1', 'test2', 'test3', 'test4']);

        await waitForNextUpdate();

        const data3 = result.current[0];
        expect(data3).toEqual(['test1', 'test2', 'test3', 'test4', 'test5']);
    });

    it('Does not keep updating the state on unmount', async () => {
        const {result, waitForNextUpdate, unmount} = renderHook(() => useThrottleArray<string>({
            interval: 50,
            maxUpdateLength: 2
        }));

        act(() => {
            const pushData = result.current[1];
            pushData('test1');
            pushData('test2');
            pushData('test3');
            pushData('test4');
            pushData('test5');
        });

        await waitForNextUpdate();

        const data1 = result.current[0];
        expect(data1).toEqual(['test1', 'test2']);

        unmount();

        await new Promise(resolve => setTimeout(resolve, 300));

        const data2 = result.current[0];
        expect(data2).toEqual(['test1', 'test2']);
    });
});