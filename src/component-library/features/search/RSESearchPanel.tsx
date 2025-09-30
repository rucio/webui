import { HintLink } from '@/component-library/atoms/misc/HintLink';
import { Input } from '@/component-library/atoms/form/input';
import { SearchButton } from '@/component-library/features/search/SearchButton';
import { ChangeEvent, Ref, useEffect, useState } from 'react';
import { GridApi } from 'ag-grid-community';

const DEFAULT_EXPRESSION = '*';

interface SearchPanelProps {
    onSearch: (expression: string) => void;
    stopStreaming: () => void;
    initialExpression?: string;
    isRunning: boolean;
    gridApi?: GridApi;
    autoSearch?: boolean;
}

export const RSESearchPanel = (props: SearchPanelProps) => {
    const [expression, setExpression] = useState<string | null>(props.initialExpression ?? DEFAULT_EXPRESSION);

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setExpression(value !== '' ? value : DEFAULT_EXPRESSION);
    };

    useEffect(() => {
        if (props.gridApi && props.autoSearch) {
            props.onSearch(expression ?? DEFAULT_EXPRESSION);
        }
    }, [props.gridApi]); // Only depend on gridApi - autoSearch won't change after mount

    const onSearch = (event: any) => {
        event.preventDefault();
        props.onSearch(expression ?? DEFAULT_EXPRESSION);
    };

    const onStop = (event: any) => {
        event.preventDefault();
        props.stopStreaming();
    };

    return (
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
                    placeholder={DEFAULT_EXPRESSION}
                    defaultValue={props.initialExpression ?? ''}
                />
                <SearchButton isRunning={props.isRunning} onStop={onStop} onSearch={onSearch} />
            </div>
        </div>
    );
};
