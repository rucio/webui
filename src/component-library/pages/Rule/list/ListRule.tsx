'use client';

import { ChangeEvent, useState } from 'react';
import { RuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { StreamingStatus } from '@/lib/infrastructure/hooks/useStreamReader';
import { Heading } from '@/component-library/atoms/misc/Heading';
import { Input } from '@/component-library/atoms/form/input';
import { SearchButton } from '@/component-library/features/search/SearchButton';
import { ListRuleTable } from '@/component-library/pages/Rule/list/ListRuleTable';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { Button } from '@/component-library/atoms/form/button';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2';
import { HiFilter } from 'react-icons/hi';

// Types
type SearchFilters = {
    scope: string;
    account: string;
    activity: string;
};

type FilterDropdownProps = {
    isExpanded: boolean;
    onToggle: () => void;
};

type ScopeInputProps = {
    value: string;
    onChange: (value: string) => void;
    onSearch: (event: any) => void;
    onFilterToggle: () => void;
    isFilterExpanded: boolean;
};

type FilterInputsProps = {
    account: string;
    activity: string;
    onAccountChange: (value: string) => void;
    onActivityChange: (value: string) => void;
};

type SearchFormProps = {
    filters: SearchFilters;
    onFiltersChange: (filters: Partial<SearchFilters>) => void;
    onSearch: (event: any) => void;
    onStop: (event: any) => void;
    isRunning: boolean;
};

type ListRuleProps = {
    initialData?: RuleViewModel[];
};

// Constants
const DEFAULT_SCOPE = '*';

// Components
const FilterDropdownButton = ({ isExpanded, onToggle }: FilterDropdownProps) => {
    return (
        <div className="relative">
            <Button className="px-3" variant="neutral" onClick={onToggle} aria-expanded={isExpanded} aria-label="Toggle filters">
                <HiFilter />
                {isExpanded ? <HiChevronUp className="ml-1" /> : <HiChevronDown className="ml-1" />}
            </Button>
        </div>
    );
};

const ScopeInput = ({ value, onChange, onSearch, onFilterToggle, isFilterExpanded }: ScopeInputProps) => {
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        onChange(inputValue !== '' ? inputValue : DEFAULT_SCOPE);
    };

    return (
        <div className="flex space-x-2">
            <Input
                className="w-full sm:flex-grow"
                onChange={handleInputChange}
                onEnterKey={onSearch}
                placeholder={DEFAULT_SCOPE}
                value={value === DEFAULT_SCOPE ? '' : value}
            />
            <FilterDropdownButton isExpanded={isFilterExpanded} onToggle={onFilterToggle} />
        </div>
    );
};

const FilterInputs = ({ account, activity, onAccountChange, onActivityChange }: FilterInputsProps) => {
    const handleAccountChange = (event: ChangeEvent<HTMLInputElement>) => {
        onAccountChange(event.target.value);
    };

    const handleActivityChange = (event: ChangeEvent<HTMLInputElement>) => {
        onActivityChange(event.target.value);
    };

    return (
        <div className="flex flex-col sm:flex-row w-full space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="grow">
                <div className="text-neutral-900 dark:text-neutral-100 mb-2">Account</div>
                <Input className="w-full" value={account} onChange={handleAccountChange} placeholder="Current Account" />
            </div>
            <div className="grow">
                <div className="text-neutral-900 dark:text-neutral-100 mb-2">Activity</div>
                <Input className="w-full" value={activity} onChange={handleActivityChange} placeholder="Any Activity" />
            </div>
        </div>
    );
};

const SearchForm = ({ filters, onFiltersChange, onSearch, onStop, isRunning }: SearchFormProps) => {
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);

    const handleScopeChange = (scope: string) => {
        onFiltersChange({ scope });
    };

    const handleAccountChange = (account: string) => {
        onFiltersChange({ account });
    };

    const handleActivityChange = (activity: string) => {
        onFiltersChange({ activity });
    };

    const handleFilterToggle = () => {
        setIsFilterExpanded(!isFilterExpanded);
    };

    return (
        <div className="space-y-2">
            <div className="text-neutral-900 dark:text-neutral-100">Scope</div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 items-center sm:items-start">
                <div className="flex flex-col w-full space-y-2">
                    <ScopeInput
                        value={filters.scope}
                        onChange={handleScopeChange}
                        onSearch={onSearch}
                        onFilterToggle={handleFilterToggle}
                        isFilterExpanded={isFilterExpanded}
                    />
                    {isFilterExpanded && (
                        <FilterInputs
                            account={filters.account}
                            activity={filters.activity}
                            onAccountChange={handleAccountChange}
                            onActivityChange={handleActivityChange}
                        />
                    )}
                </div>
                <SearchButton isRunning={isRunning} onStop={onStop} onSearch={onSearch} />
            </div>
        </div>
    );
};

// Main Component
export const ListRule = (props: ListRuleProps) => {
    const [filters, setFilters] = useState<SearchFilters>({
        scope: DEFAULT_SCOPE,
        account: '',
        activity: '',
    });

    const { onGridReady, streamingHook, startStreaming, stopStreaming } = useTableStreaming<RuleViewModel>(props.initialData);

    const handleFiltersChange = (newFilters: Partial<SearchFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const buildSearchUrl = (searchFilters: SearchFilters): string => {
        const params = new URLSearchParams();

        if (searchFilters.scope) {
            params.append('scope', searchFilters.scope);
        }

        if (searchFilters.account) {
            params.append('account', searchFilters.account);
        }

        if (searchFilters.activity) {
            params.append('activity', searchFilters.activity);
        }

        return `/api/feature/list-rules?${params.toString()}`;
    };

    const onSearch = (event: any) => {
        event.preventDefault();
        const searchUrl = buildSearchUrl(filters);
        startStreaming(searchUrl);
    };

    const onStop = (event: any) => {
        event.preventDefault();
        stopStreaming();
    };

    return (
        <div className="flex flex-col space-y-3 w-full grow">
            <Heading text="Rules" />
            <SearchForm
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onSearch={onSearch}
                onStop={onStop}
                isRunning={streamingHook.status === StreamingStatus.RUNNING}
            />
            <ListRuleTable streamingHook={streamingHook} onGridReady={onGridReady} />
        </div>
    );
};
