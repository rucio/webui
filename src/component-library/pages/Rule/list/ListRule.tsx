'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/component-library/atoms/form/select';
import { RuleState } from '@/lib/core/entity/rucio';

// Types
type SearchFilters = {
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

const AccountInput = ({ value, onChange, onSearch, onFilterToggle, isFilterExpanded }: AccountInputProps) => {
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        onChange(inputValue);
    };

    return (
        <div className="flex space-x-2">
            <Input className="w-full sm:flex-grow" onChange={handleInputChange} onEnterKey={onSearch} placeholder="Current Account" value={value} />
            <FilterDropdownButton isExpanded={isFilterExpanded} onToggle={onFilterToggle} />
        </div>
    );
};

function FilterField({ children, label }: { children: React.ReactNode; label: string }) {
    return (
        <div className="grow flex-1">
            <div className="text-neutral-900 dark:text-neutral-100 mb-2">{label}</div>
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

    const formatDate = (date?: Date): string => {
        if (!date) return '';
        return date.toISOString().split('T')[0];
    };

    const onDateChange = (event: FormEvent<HTMLInputElement>, dateType: 'updatedAfter' | 'updatedBefore') => {
        const date = new Date(event.currentTarget.value);
        if (isNaN(date.getTime())) {
            onFiltersChange({ [dateType]: undefined });
            return;
        }
        onFiltersChange({ [dateType]: date });
    };

    const rootClass = 'flex flex-col sm:flex-row sm:items-center w-full space-y-2 sm:space-y-0 sm:space-x-2';

    return (
        <>
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
                    <Input
                        type="date"
                        value={formatDate(filters.updatedAfter)}
                        onInput={event => {
                            onDateChange(event, 'updatedAfter');
                        }}
                    />
                </FilterField>
                <FilterField label="Updated Before">
                    <Input
                        type="date"
                        value={formatDate(filters.updatedBefore)}
                        onInput={event => {
                            onDateChange(event, 'updatedBefore');
                        }}
                    />
                </FilterField>
            </div>
        </>
    );
};

const SearchForm = ({ filters, onFiltersChange, onSearch, onStop, isRunning }: SearchFormProps) => {
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);

    const handleFilterToggle = () => {
        setIsFilterExpanded(!isFilterExpanded);
    };

    return (
        <div className="space-y-2">
            <div className="text-neutral-900 dark:text-neutral-100">Account</div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 items-center sm:items-start">
                <div className="flex flex-col w-full space-y-2">
                    <AccountInput
                        value={filters.account}
                        onChange={(account: string) => onFiltersChange({ account })}
                        onSearch={onSearch}
                        onFilterToggle={handleFilterToggle}
                        isFilterExpanded={isFilterExpanded}
                    />
                    {isFilterExpanded && <FilterInputs filters={filters} onFiltersChange={onFiltersChange} />}
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
        state: undefined,
        name: '',
        updatedBefore: undefined,
        updatedAfter: undefined,
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
