import { RSEViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { ChangeEvent, useState } from 'react';
import useChunkedStream, { StreamingStatus } from '@/lib/infrastructure/hooks/useChunkedStream';
import { ListRSETable } from '@/component-library/pages/RSE/List/ListRSETable';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Heading } from '@/component-library/atoms/misc/Heading';
import { Input } from '@/component-library/atoms/form/input';
import { HintLink } from '@/component-library/atoms/misc/HintLink';
import { BaseViewModelValidator } from '@/component-library/features/utils/BaseViewModelValidator';
import { SearchButton } from '@/component-library/features/search/SearchButton';
import { alreadyStreamingToast, noApiToast } from '@/component-library/features/utils/list-toasts';

type ListRSEProps = {
    firstExpression?: string;
    initialData?: RSEViewModel[];
};

const defaultExpression = '*';

export const ListRSE = (props: ListRSEProps) => {
    const streamingHook = useChunkedStream<RSEViewModel>();
    const [expression, setExpression] = useState<string | null>(props.firstExpression ?? defaultExpression);

    const [gridApi, setGridApi] = useState<GridApi<RSEViewModel> | null>(null);

    const { toast, dismiss } = useToast();
    const validator = new BaseViewModelValidator(toast);

    const onGridReady = (event: GridReadyEvent) => {
        if (props.initialData) {
            // TODO: possibly handle huge arrays
            event.api.applyTransactionAsync({ add: props.initialData });
        }
        setGridApi(event.api);
    };

    const onData = (data: RSEViewModel[]) => {
        const validData = data.filter(element => validator.isValid(element));
        gridApi?.applyTransactionAsync({ add: validData });
    };

    const startStreaming = () => {
        if (gridApi) {
            // Hide active toasts
            dismiss();

            // Make sure there are no pending transactions
            gridApi.flushAsyncTransactions();

            // Empty the grid
            gridApi.setGridOption('rowData', []);

            // Reset the validator
            validator.reset();

            const url = `/api/feature/list-rses?rseExpression=${expression ?? defaultExpression}`;
            streamingHook.start({ url, onData });
        } else {
            toast(noApiToast);
        }
    };

    const isRunning = streamingHook.status === StreamingStatus.RUNNING;

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setExpression(value !== '' ? value : defaultExpression);
    };

    const onSearch = (event: any) => {
        event.preventDefault();
        if (!isRunning) {
            startStreaming();
        } else {
            toast(alreadyStreamingToast);
        }
    };

    const onStop = (event: any) => {
        event.preventDefault();
        if (isRunning) {
            streamingHook.stop();
        }
    };

    return (
        <div className="flex flex-col space-y-3 w-full grow">
            <Heading text="RSEs" />
            <div className="space-y-2">
                <div className="text-neutral-900 dark:text-neutral-100">
                    Expression
                    <HintLink href="https://rucio.github.io/documentation/started/concepts/rse_expressions" className="pl-2" />
                </div>
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 items-center sm:items-start">
                    <Input
                        className="w-full sm:flex-grow"
                        onChange={onInputChange}
                        onEnterKey={onSearch}
                        defaultValue={props.firstExpression ?? ''}
                        placeholder={defaultExpression}
                    />
                    <SearchButton isRunning={streamingHook.status === StreamingStatus.RUNNING} onStop={onStop} onSearch={onSearch} />
                </div>
            </div>
            <ListRSETable streamingHook={streamingHook} onGridReady={onGridReady} />
        </div>
    );
};
