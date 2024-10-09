'use client';

import { ChangeEvent, useState } from 'react';
import { RuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { StreamingStatus } from '@/lib/infrastructure/hooks/useStreamReader';
import { Heading } from '@/component-library/atoms/misc/Heading';
import { Input } from '@/component-library/atoms/form/input';
import { SearchButton } from '@/component-library/features/search/SearchButton';
import { ListRuleTable } from '@/component-library/pages/Rule/list/ListRuleTable';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';

type ListRuleProps = {
    initialData?: RuleViewModel[];
};

const DEFAULT_SCOPE = '*';

export const ListRule = (props: ListRuleProps) => {
    const [scope, setScope] = useState<string>(DEFAULT_SCOPE);

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setScope(value !== '' ? value : DEFAULT_SCOPE);
    };

    const { onGridReady, streamingHook, startStreaming, stopStreaming } = useTableStreaming<RuleViewModel>(props.initialData);

    const onSearch = (event: any) => {
        event.preventDefault();
        startStreaming(`/api/feature/list-rules?scope=${scope}`);
    };

    const onStop = (event: any) => {
        event.preventDefault();
        stopStreaming();
    };

    return (
        <div className="flex flex-col space-y-3 w-full grow">
            <Heading text="Rules" />
            <div className="space-y-2">
                <div className="text-neutral-900 dark:text-neutral-100">Scope</div>
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 items-center sm:items-start">
                    <Input className="w-full sm:flex-grow" onChange={onInputChange} onEnterKey={onSearch} placeholder={DEFAULT_SCOPE} />
                    <SearchButton isRunning={streamingHook.status === StreamingStatus.RUNNING} onStop={onStop} onSearch={onSearch} />
                </div>
            </div>
            <ListRuleTable streamingHook={streamingHook} onGridReady={onGridReady} />
        </div>
    );
};
