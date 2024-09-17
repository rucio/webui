import { RSEViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { ChangeEvent, useState } from 'react';
import { StreamingStatus } from '@/lib/infrastructure/hooks/useStreamReader';
import { ListRSETable } from '@/component-library/pages/RSE/list/ListRSETable';
import { Heading } from '@/component-library/atoms/misc/Heading';
import { Input } from '@/component-library/atoms/form/input';
import { HintLink } from '@/component-library/atoms/misc/HintLink';
import { SearchButton } from '@/component-library/features/search/SearchButton';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';

type ListRSEProps = {
    firstExpression?: string;
    initialData?: RSEViewModel[];
};

const DEFAULT_EXPRESSION = '*';

export const ListRSE = (props: ListRSEProps) => {
    const [expression, setExpression] = useState<string | null>(props.firstExpression ?? DEFAULT_EXPRESSION);

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setExpression(value !== '' ? value : DEFAULT_EXPRESSION);
    };

    const { onGridReady, streamingHook, startStreaming, stopStreaming } = useTableStreaming<RSEViewModel>(props.initialData);

    const onSearch = (event: any) => {
        event.preventDefault();
        startStreaming(`/api/feature/list-rses?rseExpression=${expression ?? DEFAULT_EXPRESSION}`);
    };

    const onStop = (event: any) => {
        event.preventDefault();
        stopStreaming();
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
                        placeholder={DEFAULT_EXPRESSION}
                    />
                    <SearchButton isRunning={streamingHook.status === StreamingStatus.RUNNING} onStop={onStop} onSearch={onSearch} />
                </div>
            </div>
            <ListRSETable streamingHook={streamingHook} onGridReady={onGridReady} />
        </div>
    );
};
