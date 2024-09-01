import { RSEViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { ChangeEvent, useState } from 'react';
import useChunkedStream, { StreamingStatus } from '@/lib/infrastructure/hooks/useChunkedStream';
import { ListRSETable } from '@/component-library/Pages/RSE/List/ListRSETable';
import { useToast } from '@/component-library/hooks/use-toast';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Heading } from '@/component-library/ui/heading';
import { Input } from '@/component-library/ui/input';
import { HintLink } from '@/component-library/ui/hint-link';
import { HiPlay, HiStop } from 'react-icons/hi';
import { SearchButton } from '@/component-library/Pages/RSE/List/SearchButton';

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

    const feedInitialData = async (api: GridApi<RSEViewModel>) => {
        if (props.initialData) {
            // TODO: possibly handle huge arrays
            api.applyTransactionAsync({ add: props.initialData });
        }
    };

    const onGridReady = (event: GridReadyEvent) => {
        feedInitialData(event.api);
        setGridApi(event.api);
    };

    const onData = (data: RSEViewModel[]) => {
        // TODO: check for invalid models
        gridApi?.applyTransactionAsync({ add: data });
    };

    const startStreaming = () => {
        if (gridApi) {
            dismiss();
            gridApi.setGridOption('rowData', []);
            const url = `/api/feature/list-rses?rseExpression=${expression ?? defaultExpression}`;
            streamingHook.start({ url, onData });
        } else {
            toast({
                title: 'Warning',
                description: 'Cannot start the streaming while the grid is not ready.',
                variant: 'warning',
            });
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
            toast({
                title: 'Oops!',
                description: 'Please stop the streaming before trying to search again.',
                variant: 'info',
            });
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
                    <SearchButton
                        icon={isRunning ? <HiStop className="text-xl" /> : <HiPlay className="text-xl" />}
                        onClick={isRunning ? onStop : onSearch}
                        variant={isRunning ? 'error' : 'success'}
                    >
                        {isRunning ? 'Stop' : 'Search'}
                    </SearchButton>
                </div>
            </div>
            <ListRSETable streamingHook={streamingHook} onGridReady={onGridReady} />
        </div>
    );
};
