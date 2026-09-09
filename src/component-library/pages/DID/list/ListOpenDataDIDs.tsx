'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';

import { AgGridReact } from 'ag-grid-react';
import { ColDef, SelectionChangedEvent, ValueGetterParams } from 'ag-grid-community';

import { HiFilter, HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

import { HiChevronDown, HiChevronUp } from 'react-icons/hi2';

import { Button } from '@/component-library/atoms/form/button';
import { Input } from '@/component-library/atoms/form/input';

import { SearchButton } from '@/component-library/features/search/SearchButton';

import { RegularTable } from '@/component-library/features/table/RegularTable/RegularTable';

import { DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';

import { ListDIDMeta } from '@/component-library/pages/DID/list/meta/ListDIDMeta';

import { DIDMetaViewModel } from '@/lib/infrastructure/data/view-model/did';

type OpenDataDIDListItem = {
    scope: string;
    name: string;
    state?: string;
    created_at?: string;
    updated_at?: string;
};

type ListOpenDataDIDsResponse = {
    status: 'success' | 'error';
    message?: string;
    total: number;
    offset: number;
    dids: OpenDataDIDListItem[];
};

type GetOpenDataDIDResponse = {
    status: 'success' | 'error';
    message?: string;
    scope: string;
    name: string;
    state?: string;
};

const DEFAULT_LIMIT = 50;

const OpenDataFilterField = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col grow">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{label}</label>

        {children}
    </div>
);

export const ListOpenDataDIDs = () => {
    const [dids, setDids] = useState<OpenDataDIDListItem[]>([]);

    const [selectedDID, setSelectedDID] = useState<OpenDataDIDListItem | null>(null);

    const [meta, setMeta] = useState<DIDMetaViewModel>();

    const [isMetaLoading, setIsMetaLoading] = useState(false);

    const [hasMetaError, setHasMetaError] = useState(false);

    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);

    const [scope, setScope] = useState('');
    const [name, setName] = useState('');
    const [state, setState] = useState('');

    const [limit, setLimit] = useState(String(DEFAULT_LIMIT));

    const [appliedState, setAppliedState] = useState('');

    const [appliedLimit, setAppliedLimit] = useState(DEFAULT_LIMIT);

    const [isFilterExpanded, setIsFilterExpanded] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const tableRef = useRef<AgGridReact<OpenDataDIDListItem>>(null);

    const [columnDefs] = useState<ColDef<OpenDataDIDListItem>[]>([
        {
            headerName: 'Identifier',
            valueGetter: (params: ValueGetterParams<OpenDataDIDListItem>) => {
                if (!params.data) {
                    return '';
                }

                return `${params.data.scope}:${params.data.name}`;
            },
            flex: 1,
            minWidth: 250,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'State',
            field: 'state',
            minWidth: 140,
            maxWidth: 200,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
    ]);

    const loadDIDs = async (requestedOffset: number, requestedState: string, requestedLimit: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                limit: String(requestedLimit),
                offset: String(requestedOffset),
            });

            if (requestedState.trim()) {
                params.set('state', requestedState.trim());
            }

            const response = await fetch(`/api/feature/list-opendata-dids?${params.toString()}`);

            const data = (await response.json()) as ListOpenDataDIDsResponse;

            if (!response.ok || data.status === 'error') {
                throw new Error(data.message ?? 'Failed to retrieve OpenData DIDs');
            }

            setDids(data.dids);
            setTotal(data.total);
            setOffset(data.offset);
            setSelectedDID(null);
        } catch (error) {
            setDids([]);
            setTotal(0);
            setOffset(0);
            setSelectedDID(null);

            setError(error instanceof Error ? error.message : 'Failed to retrieve OpenData DIDs');
        } finally {
            setIsLoading(false);
        }
    };

    const loadSingleDID = async (requestedScope: string, requestedName: string, requestedState: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                scope: requestedScope,
                name: requestedName,
            });

            const response = await fetch(`/api/feature/get-opendata-did?${params.toString()}`);

            const data = (await response.json()) as GetOpenDataDIDResponse;

            if (!response.ok || data.status === 'error') {
                throw new Error(data.message ?? 'OpenData DID not found');
            }

            if (requestedState && data.state?.toLowerCase() !== requestedState.toLowerCase()) {
                setDids([]);
                setTotal(0);
                setOffset(0);
                setSelectedDID(null);
                return;
            }

            setDids([
                {
                    scope: data.scope,
                    name: data.name,
                    state: data.state,
                },
            ]);

            setTotal(1);
            setOffset(0);
            setSelectedDID(null);
        } catch (error) {
            setDids([]);
            setTotal(0);
            setOffset(0);
            setSelectedDID(null);

            setError(error instanceof Error ? error.message : 'Failed to retrieve OpenData DID');
        } finally {
            setIsLoading(false);
        }
    };

    const onSelectionChanged = (event: SelectionChangedEvent<OpenDataDIDListItem>) => {
        const selectedRows = event.api.getSelectedRows();

        if (selectedRows.length === 1) {
            setSelectedDID(selectedRows[0]);
        } else {
            setSelectedDID(null);
        }
    };

    /*
     * Retrieve the normal Rucio DID metadata for the
     * selected OpenData DID.
     *
     * This allows the right-hand panel to reuse the
     * exact same ListDIDMeta component used by /dids.
     */
    useEffect(() => {
        if (selectedDID === null) {
            setMeta(undefined);
            setHasMetaError(false);
            setIsMetaLoading(false);
            return;
        }

        const abortController = new AbortController();

        const loadMeta = async () => {
            setIsMetaLoading(true);
            setHasMetaError(false);

            try {
                const params = new URLSearchParams({
                    scope: selectedDID.scope,
                    name: selectedDID.name,
                });

                const response = await fetch(`/api/feature/get-did-meta?${params.toString()}`, {
                    signal: abortController.signal,
                });

                if (!response.ok) {
                    throw new Error(response.statusText);
                }

                const data = (await response.json()) as DIDMetaViewModel;

                setMeta(data);
            } catch (error) {
                if (error instanceof DOMException && error.name === 'AbortError') {
                    return;
                }

                setMeta(undefined);
                setHasMetaError(true);
            } finally {
                if (!abortController.signal.aborted) {
                    setIsMetaLoading(false);
                }
            }
        };

        void loadMeta();

        return () => {
            abortController.abort();
        };
    }, [selectedDID]);

    useEffect(() => {
        void loadDIDs(0, '', DEFAULT_LIMIT);
    }, []);

    const applyFilters = () => {
        const requestedScope = scope.trim();
        const requestedName = name.trim();
        const requestedState = state.trim();

        const hasScope = requestedScope.length > 0;

        const hasName = requestedName.length > 0;

        if (hasScope !== hasName) {
            setError('Scope and name must be provided together.');
            return;
        }

        const requestedLimit = Number(limit);

        if (!Number.isInteger(requestedLimit) || requestedLimit <= 0) {
            setError('Limit must be a positive integer.');
            return;
        }

        setAppliedState(requestedState);
        setAppliedLimit(requestedLimit);

        if (hasScope && hasName) {
            void loadSingleDID(requestedScope, requestedName, requestedState);

            return;
        }

        void loadDIDs(0, requestedState, requestedLimit);
    };

    const onSearch = (event: FormEvent) => {
        event.preventDefault();
        applyFilters();
    };

    const onStop = (event: FormEvent) => {
        event.preventDefault();
    };

    const previousPage = () => {
        const nextOffset = Math.max(0, offset - appliedLimit);

        void loadDIDs(nextOffset, appliedState, appliedLimit);
    };

    const nextPage = () => {
        void loadDIDs(offset + appliedLimit, appliedState, appliedLimit);
    };

    const hasPreviousPage = offset > 0;

    const hasNextPage = offset + dids.length < total;

    const totalPages = total === 0 ? 0 : Math.ceil(total / appliedLimit);

    const currentPage = total === 0 ? 0 : Math.floor(offset / appliedLimit) + 1;

    const goToFirstPage = () => {
        if (!hasPreviousPage || isLoading) {
            return;
        }

        void loadDIDs(0, appliedState, appliedLimit);
    };

    const goToLastPage = () => {
        if (!hasNextPage || isLoading || total === 0) {
            return;
        }

        const lastOffset = Math.floor((total - 1) / appliedLimit) * appliedLimit;

        void loadDIDs(lastOffset, appliedState, appliedLimit);
    };

    const paginationButtonClasses = [
        'text-l',
        'px-1',
        'text-neutral-800',
        'dark:text-neutral-100',
        'disabled:text-neutral-400',
        'disabled:dark:text-neutral-500',
    ].join(' ');

    return (
        <div className="flex flex-col space-y-6 w-full">
            {/* Search Panel */}
            <div className="rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm p-6">
                <div className="flex flex-col space-y-4 w-full">
                    <div className="flex flex-col md:flex-row md:flex-wrap md:items-start gap-y-4 md:gap-x-2">
                        {/* scope:name */}
                        <div className="order-1 flex flex-col md:flex-1 min-w-0 sm:flex-row space-y-2 sm:space-x-2 sm:space-y-0">
                            <div className="w-full flex flex-row space-x-2 items-center">
                                <Input
                                    placeholder="scope"
                                    className="max-w-[250px]"
                                    value={scope}
                                    onChange={event => setScope(event.target.value)}
                                    onEnterKey={onSearch}
                                />

                                <span className="text-neutral-900 dark:text-neutral-100 font-bold">:</span>

                                <Input placeholder="name" value={name} onChange={event => setName(event.target.value)} onEnterKey={onSearch} />

                                <Button
                                    className="px-3"
                                    variant="neutral"
                                    onClick={() => setIsFilterExpanded(previous => !previous)}
                                    aria-expanded={isFilterExpanded}
                                    aria-label="Toggle filters"
                                >
                                    <HiFilter />

                                    {isFilterExpanded ? <HiChevronUp className="ml-1" /> : <HiChevronDown className="ml-1" />}
                                </Button>
                            </div>
                        </div>

                        {/* OpenData Filters */}
                        {isFilterExpanded && (
                            <div className="order-2 md:order-3 md:basis-full rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-6 space-y-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <OpenDataFilterField label="State">
                                        <Input
                                            value={state}
                                            onChange={event => setState(event.target.value)}
                                            onEnterKey={onSearch}
                                            placeholder="OpenData state"
                                            className="w-full"
                                        />
                                    </OpenDataFilterField>

                                    <OpenDataFilterField label="Limit">
                                        <Input
                                            type="number"
                                            value={limit}
                                            onChange={event => setLimit(event.target.value)}
                                            onEnterKey={onSearch}
                                            placeholder="Maximum number of DIDs returned"
                                            className="w-full"
                                        />
                                    </OpenDataFilterField>
                                </div>
                            </div>
                        )}

                        <SearchButton className="order-3 md:order-2 sm:w-full md:w-48" isRunning={false} onStop={onStop} onSearch={onSearch} />
                    </div>
                </div>
            </div>

            {/* API / validation error */}
            {error && (
                <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-4 text-sm text-red-700 dark:text-red-300">
                    {error}
                </div>
            )}

            {/* Results Section */}
            <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-20rem)]">
                {/* OpenData Table */}
                <div className="lg:flex-1 rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden h-[60vh] lg:h-full">
                    <div className="flex flex-col h-full">
                        {/*
                         * RegularTable is reused unchanged.
                         *
                         * Its own client-side pagination
                         * panel is hidden only in this
                         * OpenData page because pagination
                         * is performed server-side through
                         * Rucio limit/offset.
                         */}
                        <div className="flex-1 min-h-0 [&>div>div:last-child]:hidden">
                            <RegularTable
                                tableRef={tableRef}
                                rowData={dids}
                                columnDefs={columnDefs}
                                rowSelection={{
                                    mode: 'singleRow',
                                    enableClickSelection: true,
                                }}
                                onSelectionChanged={onSelectionChanged}
                                paginationPageSize={Math.max(dids.length, 1)}
                                getRowId={params => `${params.data.scope}:${params.data.name}`}
                            />
                        </div>

                        {/* Server-side pagination */}
                        <div className="flex items-center justify-center text-neutral-800 dark:text-neutral-100 py-2 !m-0 bg-neutral-200 dark:bg-neutral-700 border border-solid border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10 rounded-b-md">
                            <div className="flex justify-center items-center">
                                <button
                                    type="button"
                                    disabled={!hasPreviousPage || isLoading}
                                    onClick={goToFirstPage}
                                    className={paginationButtonClasses}
                                >
                                    <HiOutlineChevronDoubleLeft />
                                </button>

                                <button
                                    type="button"
                                    disabled={!hasPreviousPage || isLoading}
                                    onClick={previousPage}
                                    className={paginationButtonClasses}
                                >
                                    <HiOutlineChevronLeft />
                                </button>

                                <span className="px-3">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button type="button" disabled={!hasNextPage || isLoading} onClick={nextPage} className={paginationButtonClasses}>
                                    <HiOutlineChevronRight />
                                </button>

                                <button type="button" disabled={!hasNextPage || isLoading} onClick={goToLastPage} className={paginationButtonClasses}>
                                    <HiOutlineChevronDoubleRight />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Same metadata panel used by /dids */}
                <div className="w-full lg:w-96 shrink-0 lg:h-full">
                    <ListDIDMeta meta={meta} isLoading={isMetaLoading} hasError={hasMetaError} />
                </div>
            </div>
        </div>
    );
};
