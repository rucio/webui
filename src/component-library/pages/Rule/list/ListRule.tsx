import {ChangeEvent, useEffect, useState} from 'react';
import {RuleViewModel} from '@/lib/infrastructure/data/view-model/rule';
import useChunkedStream, {StreamingStatus} from "@/lib/infrastructure/hooks/useChunkedStream";
import {GridApi, GridReadyEvent} from "ag-grid-community";
import {useToast} from "@/lib/infrastructure/hooks/useToast";
import {BaseViewModelValidator} from "@/component-library/features/utils/BaseViewModelValidator";
import {alreadyStreamingToast, noApiToast} from "@/component-library/features/utils/list-toasts";
import {Heading} from "@/component-library/atoms/misc/Heading";
import {Input} from "@/component-library/atoms/form/input";
import {SearchButton} from "@/component-library/features/search/SearchButton";
import {ListRuleTable} from "@/component-library/pages/Rule/list/ListRuleTable";

type ListRuleProps = {
    initialData?: RuleViewModel[];
}

const DEFAULT_SCOPE = '*';

export const ListRule = (props: ListRuleProps) => {
    const streamingHook = useChunkedStream<RuleViewModel>();
    const [scope, setScope] = useState<string>(DEFAULT_SCOPE);
    const [gridApi, setGridApi] = useState<GridApi<RuleViewModel> | null>(null);

    const {toast, dismiss} = useToast();
    const validator = new BaseViewModelValidator(toast);

    const onGridReady = (event: GridReadyEvent) => {
        setGridApi(event.api);
    };

    useEffect(() => {
        if (props.initialData) {
            onData(props.initialData);
        }
    }, [gridApi]);

    const onData = (data: RuleViewModel[]) => {
        const validData = data.filter(element => validator.isValid(element));
        gridApi?.applyTransactionAsync({add: validData});
    };

    const startStreaming = () => {
        if (gridApi) {
            dismiss();
            gridApi.flushAsyncTransactions();
            gridApi.setGridOption('rowData', []);
            validator.reset();

            const url = `/api/feature/list-rules?scope=${scope}`;
            streamingHook.start({url, onData});
        } else {
            toast(noApiToast);
        }
    };

    const isRunning = streamingHook.status === StreamingStatus.RUNNING;

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setScope(value !== '' ? value : DEFAULT_SCOPE);
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
            <Heading text="Rules"/>
            <div className="space-y-2">
                <div className="text-neutral-900 dark:text-neutral-100">
                    Scope
                </div>
                <div
                    className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 items-center sm:items-start">
                    <Input
                        className="w-full sm:flex-grow"
                        onChange={onInputChange}
                        onEnterKey={onSearch}
                        placeholder={DEFAULT_SCOPE}
                    />
                    <SearchButton isRunning={isRunning} onStop={onStop} onSearch={onSearch}/>
                </div>
            </div>
            <ListRuleTable streamingHook={streamingHook} onGridReady={onGridReady}/>
        </div>
    );
};
