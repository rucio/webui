import React, { useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { UseStreamReader } from '@/lib/infrastructure/hooks/useStreamReader';
import { StreamedTable } from '@/component-library/features/table/StreamedTable/StreamedTable';
import { badgeCellClasses, badgeCellWrapperStyle } from '@/component-library/features/table/cells/badge-cell';
import { DefaultTextFilterParams, buildDiscreteFilterParams } from '@/component-library/features/utils/filter-parameters';
import { GridReadyEvent, ValueGetterParams } from 'ag-grid-community';
import { ListRuleReplicaLockStatesViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { LockState } from '@/lib/core/entity/rucio';
import { LockStateBadge } from '@/component-library/features/badges/Rule/LockStateBadge';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { Button } from '@/component-library/atoms/form/button';
import { FTSLinkViewModel } from '@/lib/infrastructure/data/view-model/request';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { LoadingSpinner } from '@/component-library/atoms/loading/LoadingSpinner';

type DetailsRuleLocksTableProps = {
    streamingHook: UseStreamReader<ListRuleReplicaLockStatesViewModel>;
    onGridReady: (event: GridReadyEvent) => void;
};

const FTSLinkButton = (props: any) => {
    const data = props.data as ListRuleReplicaLockStatesViewModel;
    const { toast } = useToast();
    const [isFetching, setIsFetching] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [viewModel, setViewModel] = useState<FTSLinkViewModel | null>(null);

    const getFTSLink = async () => {
        setIsFetching(true);
        try {
            const response = await fetch(`/api/feature/get-fts-link?scope=${data.scope}&name=${data.name}&rse=${data.rse}`);
            const json = await response.json();
            setViewModel(json);
        } catch (_) {
            setHasError(true);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        if (hasError) {
            toast({
                title: 'FTS link generation failed',
                description: 'An unknown exception occurred.',
                variant: 'error',
            });
        }

        if (viewModel?.status === 'error') {
            toast({
                title: 'FTS link generation failed',
                description: viewModel.message,
                variant: 'error',
            });
        }

        if (viewModel?.status === 'success') {
            const url = viewModel.url;
            if (url) {
                window.open(url, '_blank');
            } else {
                toast({
                    title: 'FTS link generation failed',
                    description: 'No URL returned from the server.',
                    variant: 'error',
                });
            }
        }
    }, [hasError, viewModel, toast]);

    if (data.state === LockState.OK) {
        return;
    }

    const buttonClassName = 'h-8 w-full';

    if (isFetching) {
        return (
            <Button className={buttonClassName} variant="neutral">
                <LoadingSpinner className="h-5 w-5" />
            </Button>
        );
    }
    return (
        <Button className={buttonClassName} variant="neutral" onClick={getFTSLink}>
            Generate link
        </Button>
    );
};

const DetailsRuleLocksTable = (props: DetailsRuleLocksTableProps) => {
    const tableRef = useRef<AgGridReact<ListRuleReplicaLockStatesViewModel>>(null);

    const [columnDefs] = useState([
        {
            headerName: 'DID',
            valueGetter: (params: ValueGetterParams<ListRuleReplicaLockStatesViewModel>) => {
                return params.data?.scope + ':' + params.data?.name;
            },
            minWidth: 150,
            flex: 1,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'RSE',
            field: 'rse',
            minWidth: 150,
            flex: 1,
            filter: true,
            filterParams: DefaultTextFilterParams,
        },
        {
            headerName: 'State',
            field: 'state',
            minWidth: 200,
            cellStyle: badgeCellWrapperStyle,
            cellRenderer: LockStateBadge,
            cellRendererParams: {
                className: badgeCellClasses,
            },
            filter: true,
            sortable: false,
            // TODO: fix the string values
            filterParams: buildDiscreteFilterParams(Object.values(LockState)),
        },
        {
            headerName: 'FTS Monitoring',
            cellRenderer: FTSLinkButton,
            minWidth: 200,
        },
    ]);

    return <StreamedTable columnDefs={columnDefs} tableRef={tableRef} {...props} />;
};

export const DetailsRuleLocks = ({ id }: { id: string }) => {
    const { gridApi, onGridReady, streamingHook, startStreaming, stopStreaming } = useTableStreaming<ListRuleReplicaLockStatesViewModel>();

    useEffect(() => {
        if (gridApi) {
            const url = '/api/feature/list-rule-replica-lock-states?' + new URLSearchParams({ id });
            startStreaming(url);
        }
    }, [gridApi]);

    return <DetailsRuleLocksTable streamingHook={streamingHook} onGridReady={onGridReady} />;
};
