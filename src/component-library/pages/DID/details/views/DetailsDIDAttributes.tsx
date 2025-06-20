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

type DetailsDIDAttributesTableProps = {
    viewModel: DIDKeyValuePairsDataViewModel;
};

export const DetailsDIDAttributesTable = (props: DetailsDIDAttributesTableProps) => {
    const tableRef = useRef<AgGridReact<DIDKeyValuePair>>(null!);

    const [columnDefs] = useState([
        {
            headerName: 'Key',
            field: 'key',
            flex: 1,
            sortable: true,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'Value',
            field: 'value',
            cellRenderer: AttributeCell,
            flex: 1,
            sortable: false,
        },
    ]);

    return <RegularTable columnDefs={columnDefs} tableRef={tableRef} rowData={props.viewModel.data} />;
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
