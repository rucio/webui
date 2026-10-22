'use client';

import React from 'react';
import { Input } from '@/component-library/atoms/form/input';
import { FieldSelect } from '@/component-library/features/mutations/FieldSelect';
import { SearchButton } from '@/component-library/features/search/SearchButton';
import { ACCOUNT_TYPES, ACCOUNT_TYPE_LABELS } from '@/lib/core/entity/rucio';
import { ACCOUNT_NAME_PATTERN_REGEX } from '@/lib/core/utils/account-validation';

export const ALL_TYPES = 'ALL';

const NAME_ERROR_ID = 'accounts-filter-name-error';

export type AccountFilters = {
    account: string;
    /** An `AccountType` value, or `ALL`. */
    type: string;
    identity: string;
};

export const EMPTY_FILTERS: AccountFilters = { account: '', type: ALL_TYPES, identity: '' };

export const isValidNameFilter = (account: string): boolean => account === '' || ACCOUNT_NAME_PATTERN_REGEX.test(account);

const TYPE_OPTIONS = [{ value: ALL_TYPES, label: 'All' }, ...ACCOUNT_TYPES.map(t => ({ value: t as string, label: ACCOUNT_TYPE_LABELS[t] }))];

export interface ListAccountsFiltersProps {
    filters: AccountFilters;
    onChange: (filters: AccountFilters) => void;
    onSearch: () => void;
    onStop: () => void;
    isRunning: boolean;
}

export const ListAccountsFilters = ({ filters, onChange, onSearch, onStop, isRunning }: ListAccountsFiltersProps) => {
    const nameInvalid = !isValidNameFilter(filters.account);
    const search = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!nameInvalid) onSearch();
    };
    const stop = (e: React.SyntheticEvent) => {
        e.preventDefault();
        onStop();
    };

    return (
        <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-3 md:flex-row md:items-end">
                <div className="flex-1 space-y-1">
                    <label htmlFor="accounts-filter-name" className="text-sm text-neutral-900 dark:text-neutral-100">
                        Name
                    </label>
                    <Input
                        id="accounts-filter-name"
                        value={filters.account}
                        onChange={e => onChange({ ...filters, account: e.target.value })}
                        onEnterKey={search}
                        placeholder="e.g., jdoe*"
                        error={nameInvalid}
                        aria-invalid={nameInvalid}
                        aria-describedby={nameInvalid ? NAME_ERROR_ID : undefined}
                    />
                </div>
                <div className="space-y-1 md:w-44">
                    <label htmlFor="accounts-filter-type" className="text-sm text-neutral-900 dark:text-neutral-100">
                        Type
                    </label>
                    <FieldSelect
                        id="accounts-filter-type"
                        value={filters.type}
                        onValueChange={type => onChange({ ...filters, type })}
                        options={TYPE_OPTIONS}
                    />
                </div>
                <div className="flex-1 space-y-1">
                    <label htmlFor="accounts-filter-identity" className="text-sm text-neutral-900 dark:text-neutral-100">
                        Identity
                    </label>
                    <Input
                        id="accounts-filter-identity"
                        value={filters.identity}
                        onChange={e => onChange({ ...filters, identity: e.target.value })}
                        onEnterKey={search}
                        placeholder="CN=... or username"
                    />
                </div>
                <SearchButton isRunning={isRunning} onSearch={search} onStop={stop} className="md:w-40" />
            </div>
            {/* Below the whole row, so the fields stay aligned while it shows. */}
            {nameInvalid && (
                <p id={NAME_ERROR_ID} role="alert" className="text-xs text-base-error-600 dark:text-base-error-400">
                    Use up to 25 lowercase letters, digits, hyphens, underscores or * wildcards
                </p>
            )}
        </div>
    );
};
