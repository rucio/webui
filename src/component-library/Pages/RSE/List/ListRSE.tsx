import { twMerge } from 'tailwind-merge';
import { Heading } from '../../Helpers/Heading';
import { RSEViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { TextInput } from '@/component-library/Input/TextInput';
import { useState } from 'react';
import { Button } from '@/component-library/Button/Button';
import useChunkedStream, { StreamingStatus } from '@/lib/infrastructure/hooks/useChunkedStream';
import { ListRSETable } from '@/component-library/Pages/RSE/List/ListRSETable';
import { useToast } from '@/component-library/hooks/use-toast';
import { GridApi, GridReadyEvent } from 'ag-grid-community';

type ListRSEProps = {
    firstExpression?: string;
    initialData?: RSEViewModel[];
};

const defaultExpression = '*';
export const ListRSE = (props: ListRSEProps) => {
    const streamingHook = useChunkedStream<RSEViewModel>();
    const [expression, setExpression] = useState<string | null>(props.firstExpression ?? defaultExpression);

    const { toast } = useToast();

    const [gridApi, setGridApi] = useState<GridApi<RSEViewModel> | null>(null);

    const onData = (data: RSEViewModel[]) => {
        // TODO: check for invalid models
        gridApi?.applyTransactionAsync({ add: data });
    };

    const startStreaming = () => {
        if (gridApi) {
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

    const onGridReady = (event: GridReadyEvent) => {
        if (props.initialData) {
            event.api.setGridOption('rowData', props.initialData);
        }
        setGridApi(event.api);
    };

    const updateExpression = (value: string) => {
        setExpression(value !== '' ? value : defaultExpression);
    };

    const onSearch = (event: any) => {
        event.preventDefault();
        if (streamingHook.status !== StreamingStatus.RUNNING) {
            startStreaming();
        } else {
            toast({
                title: 'Oops!',
                description: 'Please stop the streaming before trying to search again.',
                variant: 'info',
            });
        }
    };

    return (
        <div className={twMerge('flex flex-col space-y-2 w-full grow')}>
            <Heading title="List RSEs">
                <form className={twMerge('flex flex-col sm:flex-row sm:space-x-2 sm:items-end w-full')} aria-label="RSE Search">
                    <label className={twMerge('w-fit flex-none', 'text-text-1000 dark:text-text-0')} htmlFor="rse-search-pattern">
                        RSE Search Pattern
                    </label>
                    <TextInput
                        onEnterkey={onSearch}
                        onChange={e => {
                            updateExpression(e.target.value);
                        }}
                        id="rse-search-pattern"
                        defaultValue={props.firstExpression ?? ''}
                        placeholder={defaultExpression}
                    />
                    {streamingHook.status === StreamingStatus.STOPPED ? (
                        <Button
                            type="button"
                            label="Search"
                            onClick={onSearch}
                            className={twMerge('w-full mt-2 sm:mt-0 sm:w-24 sm:grow-0')}
                            id="rse-button-search"
                        />
                    ) : (
                        <Button
                            type="button"
                            label="Stop"
                            onClick={() => {
                                streamingHook.stop();
                            }}
                            className={twMerge('w-full mt-2 sm:mt-0 sm:w-24 sm:grow-0', 'bg-base-error-500 hover:bg-base-error-600')}
                        />
                    )}
                </form>
            </Heading>
            <ListRSETable streamingHook={streamingHook} onGridReady={onGridReady} />
        </div>
    );
};
