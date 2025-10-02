'use client';

import { DIDMetaViewModel, DIDViewModel } from '@/lib/infrastructure/data/view-model/did';
import { DIDType } from '@/lib/core/entity/rucio';
import React, { useEffect, useRef, useState } from 'react';
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
    autoSearch?: boolean;
    initialType?: DIDType;
}

export const ListDID = (props: ListDIDProps) => {
    const { toast } = useToast();
    // A shared validator
    const validator = new BaseViewModelValidator(toast);

    // List handling
    const { onGridReady, streamingHook, startStreaming, stopStreaming, gridApi } = useTableStreaming<DIDViewModel>(props.initialData);

    // Track if auto-search has already been performed
    const hasAutoSearched = useRef(false);

    // Auto-search logic - trigger search when autoSearch=true and grid is ready (only once)
    useEffect(() => {
        if (!hasAutoSearched.current && props.autoSearch && gridApi && props.firstPattern) {
            hasAutoSearched.current = true;
            const SCOPE_DELIMITER = ':';
            const patternParts = props.firstPattern.split(SCOPE_DELIMITER);
            if (patternParts.length === 2) {
                const [scope, name] = patternParts;
                const params = new URLSearchParams({
                    query: props.firstPattern,
                    type: props.initialType ?? DIDType.DATASET,
                });
                const url = '/api/feature/list-dids?' + params;
                startStreaming(url);
            }
        }
    }, [gridApi]); // Only depend on gridApi

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
            await queryClient.cancelQueries({ queryKey: metaQueryKey });
            refetchMeta();
        };

        refetch();
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
                autoSearch={props.autoSearch}
                initialType={props.initialType}
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
