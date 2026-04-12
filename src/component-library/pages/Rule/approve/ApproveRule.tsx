'use client';

import { ChangeEvent, useState } from 'react';
import { UseStreamReader, StreamingStatus } from '@/lib/infrastructure/hooks/useStreamReader';
import { ApproveRuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { GridReadyEvent } from 'ag-grid-community';
import ApproveRuleTable from '@/component-library/pages/Rule/approve/ApproveRuleTable';
import { Button } from '@/component-library/atoms/form/button';
import { HiOutlineCheckCircle, HiOutlineBan, HiInformationCircle } from 'react-icons/hi';
import { HiFilter } from 'react-icons/hi';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2';
import { cn } from '@/component-library/utils';
import { DenyRuleDialog } from '@/component-library/features/mutations/DenyRuleDialog';
import { Input } from '@/component-library/atoms/form/input';
import { DateInput } from '@/component-library/atoms/legacy/input/DateInput/DateInput';
import { SearchButton } from '@/component-library/features/search/SearchButton';

export type ApproveRuleFilters = {
    account: string;
    activity: string;
    scope: string;
    name: string;
    updatedBefore?: Date;
    updatedAfter?: Date;
};

export type ApproveRuleProps = {
    streamingHook: UseStreamReader<ApproveRuleViewModel>;
    onGridReady: (event: GridReadyEvent) => void;
    onApprove: (ruleId: string) => void;
    onDeny: (ruleId: string, comment?: string) => void;
    approvingRuleId: string | null;
    denyingRuleId: string | null;
    onSearch: (filters: ApproveRuleFilters) => void;
    onStop: () => void;
    initialFilters?: Partial<ApproveRuleFilters>;
};

export const ApproveRule = (props: ApproveRuleProps) => {
    const { streamingHook, onGridReady, onApprove, onDeny, approvingRuleId, denyingRuleId, onSearch, onStop, initialFilters } = props;

    const [selectedRuleIds, setSelectedRuleIds] = useState<string[]>([]);
    const [bulkDenyDialogOpen, setBulkDenyDialogOpen] = useState(false);
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);
    const [isTipsOpen, setIsTipsOpen] = useState(false);
    const [filters, setFilters] = useState<ApproveRuleFilters>({
        account: initialFilters?.account ?? '',
        activity: initialFilters?.activity ?? '',
        scope: initialFilters?.scope ?? '*',
        name: initialFilters?.name ?? '',
        updatedBefore: initialFilters?.updatedBefore,
        updatedAfter: initialFilters?.updatedAfter,
    });

    const handleBulkApprove = () => {
        selectedRuleIds.forEach(id => onApprove(id));
    };

    const handleBulkDeny = () => {
        setBulkDenyDialogOpen(true);
    };

    const handleBulkDenyConfirm = (comment?: string) => {
        setBulkDenyDialogOpen(false);
        selectedRuleIds.forEach(id => onDeny(id, comment));
    };

    const handleFiltersChange = (newFilters: Partial<ApproveRuleFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleSearch = (event: any) => {
        event.preventDefault();
        onSearch(filters);
    };

    const handleStop = (event: any) => {
        event.preventDefault();
        onStop();
    };

    const isRunning = streamingHook.status === StreamingStatus.RUNNING;

    return (
        <div className="flex flex-col space-y-6 w-full">
            {/* Page header */}
            <header>
                <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Approve Rules</h1>
                <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
                    Review and approve or deny replication rules that are waiting for administrator approval.
                </p>
            </header>

            {/* Tips */}
            <div className="rounded-md bg-base-info-50 dark:bg-base-info-900 text-sm text-base-info-700 dark:text-base-info-200">
                <button
                    type="button"
                    className="flex w-full items-center gap-2 p-3 text-left"
                    onClick={() => setIsTipsOpen(prev => !prev)}
                    aria-expanded={isTipsOpen}
                >
                    <HiInformationCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="font-medium flex-1">Tips</span>
                    <HiChevronDown
                        className={cn('h-4 w-4 shrink-0 transition-transform duration-200', isTipsOpen && 'rotate-180')}
                        aria-hidden="true"
                    />
                </button>
                {isTipsOpen && (
                    <ul className="list-disc list-inside space-y-0.5 px-3 pb-3 pl-10">
                        <li>
                            <span className="font-medium">Approve:</span> Moves the rule from &quot;Waiting Approval&quot; to active replication.
                        </li>
                        <li>
                            <span className="font-medium">Deny:</span> Rejects the rule. You can optionally add a comment explaining why.
                        </li>
                        <li>
                            <span className="font-medium">Bulk actions:</span> Select multiple rows with checkboxes, then approve or deny all at once.
                        </li>
                        <li>
                            <span className="font-medium">View:</span> Opens the full rule detail page in a new tab for more information.
                        </li>
                        <li>
                            <span className="font-medium">Filters:</span> Use the filter panel to narrow results by account, scope, activity, or date
                            range.
                        </li>
                    </ul>
                )}
            </div>

            {/* Search / Filter Panel */}
            <div className="rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm p-6">
                <label htmlFor="approve-account-input" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 block">
                    Account
                </label>
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-2 items-start">
                    <div className="flex flex-col w-full space-y-4">
                        <div className="flex space-x-2">
                            <Input
                                id="approve-account-input"
                                className="w-full sm:flex-grow"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleFiltersChange({ account: e.target.value })}
                                onEnterKey={handleSearch}
                                placeholder="Filter by account"
                                value={filters.account}
                            />
                            <Button
                                className="px-3"
                                variant="neutral"
                                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                                aria-expanded={isFilterExpanded}
                                aria-label="Toggle filters"
                            >
                                <HiFilter />
                                {isFilterExpanded ? <HiChevronUp className="ml-1" /> : <HiChevronDown className="ml-1" />}
                            </Button>
                        </div>
                        {isFilterExpanded && (
                            <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-6 space-y-6">
                                <div className="flex flex-col sm:flex-row w-full gap-4">
                                    <div className="grow flex-1">
                                        <label
                                            htmlFor="filter-activity"
                                            className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block"
                                        >
                                            Activity
                                        </label>
                                        <Input
                                            id="filter-activity"
                                            className="w-full"
                                            value={filters.activity}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleFiltersChange({ activity: e.target.value })}
                                            placeholder="Any Activity"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row w-full gap-4">
                                    <div className="grow flex-1">
                                        <label
                                            htmlFor="filter-scope"
                                            className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block"
                                        >
                                            Scope
                                        </label>
                                        <Input
                                            id="filter-scope"
                                            className="w-full"
                                            value={filters.scope === '*' ? '' : filters.scope}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleFiltersChange({ scope: e.target.value || '*' })}
                                            placeholder="*"
                                        />
                                    </div>
                                    <div className="grow flex-1">
                                        <label
                                            htmlFor="filter-name"
                                            className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block"
                                        >
                                            Name
                                        </label>
                                        <Input
                                            id="filter-name"
                                            className="w-full"
                                            value={filters.name}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleFiltersChange({ name: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row w-full gap-4">
                                    <div className="grow flex-1">
                                        <label
                                            htmlFor="filter-updated-after"
                                            className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block"
                                        >
                                            Updated After
                                        </label>
                                        <DateInput
                                            id="filter-updated-after"
                                            onchange={(date: Date) => handleFiltersChange({ updatedAfter: date })}
                                            initialdate={filters.updatedAfter}
                                            placeholder="Select date"
                                        />
                                    </div>
                                    <div className="grow flex-1">
                                        <label
                                            htmlFor="filter-updated-before"
                                            className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block"
                                        >
                                            Updated Before
                                        </label>
                                        <DateInput
                                            id="filter-updated-before"
                                            onchange={(date: Date) => handleFiltersChange({ updatedBefore: date })}
                                            initialdate={filters.updatedBefore}
                                            placeholder="Select date"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <SearchButton className="sm:w-48" isRunning={isRunning} onStop={handleStop} onSearch={handleSearch} />
                </div>
            </div>

            {/* Bulk deny confirmation dialog */}
            <DenyRuleDialog
                open={bulkDenyDialogOpen}
                onOpenChange={setBulkDenyDialogOpen}
                ruleId={`${selectedRuleIds.length} selected rule${selectedRuleIds.length !== 1 ? 's' : ''}`}
                onConfirm={handleBulkDenyConfirm}
            />

            {/* Bulk actions toolbar — visible only when rows are selected */}
            {selectedRuleIds.length > 0 && (
                <div className="flex items-center gap-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-4 py-3">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {selectedRuleIds.length} rule{selectedRuleIds.length !== 1 ? 's' : ''} selected
                    </span>
                    <div className="flex gap-2 ml-auto">
                        <Button variant="success" size="sm" onClick={handleBulkApprove}>
                            <HiOutlineCheckCircle className="mr-1.5 h-4 w-4" aria-hidden="true" />
                            Approve Selected
                        </Button>
                        <Button variant="error" size="sm" onClick={handleBulkDeny}>
                            <HiOutlineBan className="mr-1.5 h-4 w-4" aria-hidden="true" />
                            Deny Selected
                        </Button>
                    </div>
                </div>
            )}

            {/* Rules table */}
            <div className="rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden h-[calc(100vh-24rem)]">
                <ApproveRuleTable
                    streamingHook={streamingHook}
                    onGridReady={onGridReady}
                    onApprove={onApprove}
                    onDeny={onDeny}
                    approvingRuleId={approvingRuleId}
                    denyingRuleId={denyingRuleId}
                    onSelectionChanged={setSelectedRuleIds}
                />
            </div>
        </div>
    );
};
