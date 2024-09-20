import { BaseViewModel } from '@/lib/sdk/view-models';
import useStreamReader, { StreamingStatus } from '@/lib/infrastructure/hooks/useStreamReader';
import { useEffect, useState } from 'react';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { BaseViewModelValidator } from '@/component-library/features/utils/BaseViewModelValidator';
import { alreadyStreamingToast, noApiToast } from '@/component-library/features/utils/list-toasts';

/**
 * Custom hook to handle streaming data into an AG Grid table.
 *
 * @template T - The type of data model to be used in the grid, extending {@link BaseViewModel}.
 * @param {T[]} [initialData] - Optional initial data to populate the grid with.
 * @returns {Object} An object containing the following properties:
 * - `streamingHook` - The hook used for streaming data.
 * - `onGridReady` - Callback function to be used as an event handler for when the grid is ready.
 * - `startStreaming` - Function to start streaming data from a specified URL.
 * - `stopStreaming` - Function to stop the streaming of data.
 */
export default function useTableStreaming<T extends BaseViewModel>(initialData?: T[]) {
    const streamingHook = useStreamReader<T>();
    const [gridApi, setGridApi] = useState<GridApi<T> | null>(null);

    const { toast, dismiss } = useToast();
    const validator = new BaseViewModelValidator(toast);

    const onGridReady = (event: GridReadyEvent) => {
        setGridApi(event.api);
    };

    useEffect(() => {
        if (gridApi && initialData) {
            onData(initialData);
        }
    }, [gridApi]);

    const onData = (data: T[]) => {
        const validData = data.filter(element => validator.isValid(element));
        gridApi?.applyTransactionAsync({ add: validData });
    };

    const isRunning = streamingHook.status === StreamingStatus.RUNNING;

    const startStreaming = (url: string) => {
        if (isRunning) {
            toast(alreadyStreamingToast);
            return;
        }

        if (gridApi) {
            // Hide active toasts
            dismiss();

            // Make sure there are no pending transactions
            gridApi.flushAsyncTransactions();

            // Empty the grid
            gridApi.setGridOption('rowData', []);

            // Reset the validator
            validator.reset();

            streamingHook.start({ url, onData });
        } else {
            toast(noApiToast);
        }
    };

    const stopStreaming = () => {
        if (isRunning) {
            streamingHook.stop();
        }
    };

    return { streamingHook, onGridReady, startStreaming, stopStreaming, gridApi };
}
