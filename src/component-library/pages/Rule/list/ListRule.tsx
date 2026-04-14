'use client';

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { RuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { StreamingStatus } from '@/lib/infrastructure/hooks/useStreamReader';
import { Input } from '@/component-library/atoms/form/input';
import { DateInput } from '@/component-library/atoms/legacy/input/DateInput/DateInput';
import { SearchButton } from '@/component-library/features/search/SearchButton';
import { ListRuleTable } from '@/component-library/pages/Rule/list/ListRuleTable';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { Button } from '@/component-library/atoms/form/button';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2';
import { HiFilter } from 'react-icons/hi';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/component-library/atoms/form/select';
import { RuleState } from '@/lib/core/entity/rucio';

// Types
export type SearchFilters = {
    scope: string;
    name: string;
    account: string;
    activity: string;
    state?: RuleState;
    updatedBefore?: Date;
    updatedAfter?: Date;
};

type FilterDropdownProps = {
    isExpanded: boolean;
    onToggle: () => void;
};

type AccountInputProps = {
    value: string;
    onChange: (value: string) => void;
    onSearch: (event: any) => void;
    onFilterToggle: () => void;
    isFilterExpanded: boolean;
    id?: string;
};

type FilterInputsProps = {
    filters: SearchFilters;
    onFiltersChange: (filters: Partial<SearchFilters>) => void;
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
    autoSearch?: boolean;
    initialFilters?: Partial<SearchFilters>;
    onSearchStart?: (filters: SearchFilters) => void;
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

const AccountInput = ({ value, onChange, onSearch, onFilterToggle, isFilterExpanded, id }: AccountInputProps) => {
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        onChange(inputValue);
    };

    return (
        <div className="flex space-x-2">
            <Input
                id={id}
                className="w-full sm:flex-grow"
                onChange={handleInputChange}
                onEnterKey={onSearch}
                placeholder="Current Account"
                value={value}
            />
            <FilterDropdownButton isExpanded={isFilterExpanded} onToggle={onFilterToggle} />
        </div>
    );
};

function FilterField({ children, label }: { children: React.ReactNode; label: string }) {
    return (
        <div className="grow flex-1">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">{label}</label>
            {children}
        </div>
    );
}

const FilterInputs = ({ filters, onFiltersChange }: FilterInputsProps) => {
    const onActivityChange = (event: ChangeEvent<HTMLInputElement>) => {
        onFiltersChange({ activity: event.target.value });
    };

    const onStateChange = (value: string) => {
        if (value === RuleState.UNKNOWN) {
            onFiltersChange({ state: undefined });
        } else {
            onFiltersChange({ state: value as RuleState });
        }
    };

    const onScopeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newScope = event.target.value || DEFAULT_SCOPE;
        onFiltersChange({ scope: newScope });
    };

    const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        onFiltersChange({ name: event.target.value });
    };

    const onUpdatedAfterChange = (date: Date) => {
        onFiltersChange({ updatedAfter: date });
    };

    const onUpdatedBeforeChange = (date: Date) => {
        onFiltersChange({ updatedBefore: date });
    };

    const rootClass = 'flex flex-col sm:flex-row w-full gap-4';

    return (
        <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-6 space-y-6">
            <div className={rootClass}>
                <FilterField label="Activity">
                    <Input className="w-full" value={filters.activity} onChange={onActivityChange} placeholder="Any Activity" />
                </FilterField>
                <FilterField label="State">
                    <Select onValueChange={onStateChange} defaultValue={undefined} value={filters.state}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={RuleState.UNKNOWN}>Any</SelectItem>
                            {Object.values(RuleState).map(state => {
                                if (state === RuleState.UNKNOWN) return null;
                                // TODO: transform RuleState to a more user-friendly string
                                return (
                                    <SelectItem key={state} value={state}>
                                        {state}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </FilterField>
            </div>
            <div className={rootClass}>
                <FilterField label="Scope">
                    <Input
                        className="w-full"
                        value={filters.scope === DEFAULT_SCOPE ? '' : filters.scope}
                        onChange={onScopeChange}
                        placeholder={DEFAULT_SCOPE}
                    />
                </FilterField>
                <FilterField label="Name">
                    <Input className="w-full" value={filters.name} onChange={onNameChange} />
                </FilterField>
            </div>
            <div className={rootClass}>
                <FilterField label="Updated After">
                    <DateInput onchange={onUpdatedAfterChange} initialdate={filters.updatedAfter} placeholder="Select date" />
                </FilterField>
                <FilterField label="Updated Before">
                    <DateInput onchange={onUpdatedBeforeChange} initialdate={filters.updatedBefore} placeholder="Select date" />
                </FilterField>
            </div>
        </div>
    );
};

const SearchForm = ({ filters, onFiltersChange, onSearch, onStop, isRunning }: SearchFormProps) => {
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);

    const handleFilterToggle = () => {
        setIsFilterExpanded(!isFilterExpanded);
    };

    return (
        <div className="flex flex-col space-y-6 w-full">
            {/* Search Panel */}
            <div className="rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm p-6">
                <label htmlFor="account-input" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 block">
                    Account
                </label>
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-2 items-start">
                    <div className="flex flex-col w-full space-y-4">
                        <AccountInput
                            id="account-input"
                            value={filters.account}
                            onChange={(account: string) => onFiltersChange({ account })}
                            onSearch={onSearch}
                            onFilterToggle={handleFilterToggle}
                            isFilterExpanded={isFilterExpanded}
                        />
                        {isFilterExpanded && <FilterInputs filters={filters} onFiltersChange={onFiltersChange} />}
                    </div>
                    <SearchButton className="sm:w-48" isRunning={isRunning} onStop={onStop} onSearch={onSearch} />
                </div>
            </div>
        </div>
    );
};

// Main Component
export const ListRule = (props: ListRuleProps) => {
    const [filters, setFilters] = useState<SearchFilters>({
        scope: props.initialFilters?.scope ?? DEFAULT_SCOPE,
        account: props.initialFilters?.account ?? '',
        activity: props.initialFilters?.activity ?? '',
        state: props.initialFilters?.state ?? undefined,
        name: props.initialFilters?.name ?? '',
        updatedBefore: undefined,
        updatedAfter: undefined,
    });

    const { onGridReady, streamingHook, startStreaming, stopStreaming, gridApi } = useTableStreaming<RuleViewModel>(props.initialData);

    // Track if auto-search has already been performed
    const hasAutoSearched = useRef(false);

    // Auto-trigger search if autoSearch is true and gridApi is available (only once)
    useEffect(() => {
        if (!hasAutoSearched.current && props.autoSearch && gridApi) {
            hasAutoSearched.current = true;
            const searchUrl = buildSearchUrl(filters);
            startStreaming(searchUrl);
        }
    }, [gridApi]); // Only depend on gridApi

    const handleFiltersChange = (newFilters: Partial<SearchFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const buildSearchUrl = (searchFilters: SearchFilters): string => {
        const params = new URLSearchParams();

        if (searchFilters.scope) {
            params.append('scope', searchFilters.scope);
        }

        if (searchFilters.name) {
            params.append('name', searchFilters.name);
        }

        if (searchFilters.account) {
            params.append('account', searchFilters.account);
        }

        if (searchFilters.activity) {
            params.append('activity', searchFilters.activity);
        }

        if (searchFilters.state) {
            params.append('state', searchFilters.state);
        }

        if (searchFilters.updatedBefore) {
            params.append('updated_before', searchFilters.updatedBefore.toISOString());
        }

        if (searchFilters.updatedAfter) {
            params.append('updated_after', searchFilters.updatedAfter.toISOString());
        }

        return `/api/feature/list-rules?${params.toString()}`;
    };

    const onSearch = (event: any) => {
        event.preventDefault();

        // Call onSearchStart callback if provided
        if (props.onSearchStart) {
            props.onSearchStart(filters);
        }

        const searchUrl = buildSearchUrl(filters);
        startStreaming(searchUrl);
    };

    const onStop = (event: any) => {
        event.preventDefault();
        stopStreaming();
    };

    return (
        <div className="flex flex-col space-y-6 w-full">
            <SearchForm
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onSearch={onSearch}
                onStop={onStop}
                isRunning={streamingHook.status === StreamingStatus.RUNNING}
            />

            {/* Results Section */}
            <div className="rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden h-[calc(100vh-24rem)]">
                <ListRuleTable streamingHook={streamingHook} onGridReady={onGridReady} />
            </div>
        </div>
    );
};
