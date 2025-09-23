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
import { ClickableCell } from '@/component-library/features/table/cells/ClickableCell';
import { CopyableLinkCell } from '@/component-library/features/table/cells/CopyableCell';
import { Button } from '@/component-library/atoms/form/button';
import { FTSLinkViewModel } from '@/lib/infrastructure/data/view-model/request';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { LoadingSpinner } from '@/component-library/atoms/loading/LoadingSpinner';
import { HiExternalLink } from 'react-icons/hi';

type DetailsRuleLocksTableProps = {
    streamingHook: UseStreamReader<ListRuleReplicaLockStatesViewModel>;
    onGridReady: (event: GridReadyEvent) => void;
};

const ClickableDID = (props: { value: string[] }) => {
    const [scope, name] = props.value;
    const didString = `${scope}:${name}`;
    return (
        <CopyableLinkCell
            text={didString}
            href={`/did/page/${encodeURIComponent(scope)}/${encodeURIComponent(name)}`}
        >
            {didString}
        </CopyableLinkCell>
    );
};

const ClickableRSE = (props: { value: string }) => {
    return <ClickableCell href={`/rse/page/${props.value}`}>{props.value}</ClickableCell>;
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

    const buttonClassName = 'my-2 h-7 w-full';

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

const LockStateDisplayNames: Record<LockState, string> = {
    [LockState.REPLICATING]: 'Replicating',
    [LockState.OK]: 'OK',
    [LockState.STUCK]: 'Stuck',
    [LockState.UNKNOWN]: 'Unknown',
};

const DetailsRuleLocksTable = (props: DetailsRuleLocksTableProps) => {
    const tableRef = useRef<AgGridReact<ListRuleReplicaLockStatesViewModel>>(null);

    const [columnDefs] = useState([
        {
            headerName: 'DID',
            valueGetter: (params: ValueGetterParams<ListRuleReplicaLockStatesViewModel>) => {
                return [params.data?.scope, params.data?.name];
            },
            minWidth: 150,
            flex: 1,
            filter: true,
            filterParams: DefaultTextFilterParams,
            cellRenderer: ClickableDID,
        },
        {
            headerName: 'RSE',
            field: 'rse',
            minWidth: 150,
            flex: 1,
            filter: true,
            filterParams: DefaultTextFilterParams,
            cellRenderer: ClickableRSE,
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
            filterParams: buildDiscreteFilterParams(Object.values(LockStateDisplayNames), Object.values(LockState)),
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
