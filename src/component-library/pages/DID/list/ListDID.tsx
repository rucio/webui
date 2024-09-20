import { DIDMetaViewModel, DIDViewModel } from '@/lib/infrastructure/data/view-model/did';
import React, { useEffect, useState } from 'react';
import { StreamingStatus } from '@/lib/infrastructure/hooks/useStreamReader';
import { SelectionChangedEvent } from 'ag-grid-community';
import { Heading } from '@/component-library/atoms/misc/Heading';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ListDIDTable } from '@/component-library/pages/DID/list/ListDIDTable';
import { BaseViewModelValidator } from '@/component-library/features/utils/BaseViewModelValidator';
import { ListDIDMeta } from '@/component-library/pages/DID/list/meta/ListDIDMeta';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { DIDSearchPanel } from '@/component-library/features/search/DIDSearchPanel';

export interface ListDIDProps {
    firstPattern?: string;
    initialData?: DIDViewModel[];
}

export const ListDID = (props: ListDIDProps) => {
    const { toast } = useToast();
    // A shared validator
    const validator = new BaseViewModelValidator(toast);

    // List handling
    const { onGridReady, streamingHook, startStreaming, stopStreaming } = useTableStreaming<DIDViewModel>(props.initialData);

    // Meta handling

    const [selectedItem, setSelectedItem] = useState<DIDViewModel | null>(null);

    // A function passed to the table
    const onSelectionChanged = (event: SelectionChangedEvent) => {
        const selectedRows = event.api.getSelectedRows();
        if (selectedRows.length === 1) {
            setSelectedItem(selectedRows[0] as DIDViewModel);
        } else {
            setSelectedItem(null);
        }
    };

    const queryMeta = async () => {
        if (selectedItem !== null) {
            const params = new URLSearchParams({ scope: selectedItem.scope, name: selectedItem.name });
            const url = '/api/feature/get-did-meta?' + params;

            const res = await fetch(url);
            if (!res.ok) throw new Error(res.statusText);

            const json = await res.json();
            if (validator.isValid(json)) return json;
        }
        return null;
    };

    const metaQueryKey = ['meta'];
    const {
        data: meta,
        error: metaError,
        isFetching: isMetaFetching,
        refetch: refetchMeta,
        remove: removeMeta,
    } = useQuery<DIDMetaViewModel>({
        queryKey: metaQueryKey,
        queryFn: queryMeta,
        enabled: false,
        retry: false,
    });
    const queryClient = useQueryClient();

    // When an item in the table is selected, update the meta
    useEffect(() => {
        const refetch = async () => {
            // Make sure the result is always fresh
            await queryClient.cancelQueries(metaQueryKey);
            refetchMeta();
        };

        if (selectedItem !== null) refetch();
    }, [selectedItem]);

    // Handle errors with loading the meta
    useEffect(() => {
        if (metaError === null) return;
        toast({
            variant: 'error',
            title: 'Fatal error',
            description: 'Cannot retrieve metadata.',
        });
    }, [metaError]);

    return (
        <div className="flex flex-col space-y-3 w-full grow">
            <Heading text="DIDs" />
            <DIDSearchPanel
                isRunning={streamingHook.status === StreamingStatus.RUNNING}
                startStreaming={startStreaming}
                stopStreaming={stopStreaming}
                initialPattern={props.firstPattern}
            />
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3 grow">
                <div className="flex flex-col md:flex-1">
                    <ListDIDTable streamingHook={streamingHook} onSelectionChanged={onSelectionChanged} onGridReady={onGridReady} />
                </div>
                <ListDIDMeta meta={meta} isLoading={isMetaFetching} hasError={metaError !== null} />
            </div>
        </div>
    );
};
