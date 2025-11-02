import React, { useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { RegularTable } from '@/component-library/features/table/RegularTable/RegularTable';
import { DIDKeyValuePair } from '@/lib/core/entity/rucio';
import { DefaultTextFilterParams } from '@/component-library/features/utils/filter-parameters';
import { AttributeCell } from '@/component-library/features/table/cells/AttributeCell';
import { DIDKeyValuePairsDataViewModel } from '@/lib/infrastructure/data/view-model/did';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { BaseViewModelValidator } from '@/component-library/features/utils/BaseViewModelValidator';
import { DetailsDIDView, DetailsDIDProps } from '@/component-library/pages/DID/details/views/DetailsDIDView';
import { WarningField } from '@/component-library/features/fields/WarningField';
import { LoadingSpinner } from '@/component-library/atoms/loading/LoadingSpinner';
import { Checkbox } from '@/component-library/atoms/form/checkbox';
import { NullBadge } from '@/component-library/features/badges/NullBadge';

type DetailsDIDAttributesTableProps = {
    viewModel: DIDKeyValuePairsDataViewModel;
};

const excludeNullValuesKey = 'excludeNullValues';

export const DetailsDIDAttributesTable = (props: DetailsDIDAttributesTableProps) => {
    const tableRef = useRef<AgGridReact<DIDKeyValuePair>>(null);
    const [excludeNull, setExcludeNull] = useState(() => {
        const saved = localStorage.getItem(excludeNullValuesKey);
        return saved !== null ? JSON.parse(saved) : false;
    });

    const [columnDefs] = useState([
        {
            headerName: 'Key',
            field: 'key',
            flex: 1,
            pinned: 'left' as const,
            sortable: true,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'Value',
            field: 'value',
            cellRenderer: AttributeCell,
            flex: 1,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
    ]);

    const handleExcludeNullChange = () => {
        const newValue = !excludeNull;
        setExcludeNull(newValue);
        localStorage.setItem(excludeNullValuesKey, JSON.stringify(newValue));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleExcludeNullChange();
        }
    };

    return (
        <div className="flex flex-col grow">
            <div className="flex items-center justify-end px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 rounded-t-lg">
                <div
                    className="flex space-x-2 items-center cursor-pointer rounded px-2 py-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-neutral-100 dark:focus:ring-offset-neutral-800 transition-colors"
                    onClick={handleExcludeNullChange}
                    onKeyDown={handleKeyDown}
                    role="checkbox"
                    aria-checked={excludeNull}
                    tabIndex={0}
                >
                    <Checkbox checked={excludeNull} />
                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        Exclude <NullBadge />
                    </span>
                </div>
            </div>
            <RegularTable
                isExternalFilterPresent={() => excludeNull}
                doesExternalFilterPass={node => {
                    if (!excludeNull) return true;
                    return node.data.value !== undefined && node.data.value !== null;
                }}
                columnDefs={columnDefs}
                tableRef={tableRef}
                rowData={props.viewModel.data}
            />
        </div>
    );
};

export const DetailsDIDAttributes: DetailsDIDView = ({ scope, name }: DetailsDIDProps) => {
    const { toast } = useToast();
    const validator = new BaseViewModelValidator(toast);

    const queryKeyValuePairs = async () => {
        const url = '/api/feature/get-did-keyvaluepairs?' + new URLSearchParams({ scope, name });

        const res = await fetch(url);
        if (!res.ok) {
            const json = await res.json();
            throw new Error(json.message);
        }

        const json = await res.json();
        if (validator.isValid(json)) return json;

        return null;
    };

    const keyValuePairsQueryKey = ['key-value-pairs'];
    const {
        data: keyValuePairs,
        error: keyValuePairsError,
        isFetching: areKeyValuePairsFetching,
    } = useQuery<DIDKeyValuePairsDataViewModel>({
        queryKey: keyValuePairsQueryKey,
        queryFn: queryKeyValuePairs,
        retry: false,
        refetchOnWindowFocus: false,
    });

    if (keyValuePairsError) {
        return (
            <WarningField>
                <span>Could not load DID attributes.</span>
            </WarningField>
        );
    }

    const isLoading = keyValuePairs === undefined || areKeyValuePairsFetching;
    if (isLoading) {
        return (
            <div className="flex grow items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return <DetailsDIDAttributesTable viewModel={keyValuePairs} />;
};
