import { DIDMetaViewModel, DIDViewModel } from '@/lib/infrastructure/data/view-model/did';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { DIDType } from '@/lib/core/entity/rucio';
import useChunkedStream, { StreamingStatus } from '@/lib/infrastructure/hooks/useChunkedStream';
import { GridApi, GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community';
import { Heading } from '@/component-library/atoms/misc/Heading';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/component-library/atoms/form/select';
import { Input } from '@/component-library/atoms/form/input';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ListDIDTable } from '@/component-library/pages/DID/List/ListDIDTable';
import { BaseViewModelValidator } from '@/component-library/features/utils/BaseViewModelValidator';
import { SearchButton } from '@/component-library/features/search/SearchButton';
import { alreadyStreamingToast, noApiToast } from '@/component-library/features/utils/list-toasts';
import { ListDIDMeta } from '@/component-library/pages/DID/List/Meta/ListDIDMeta';

const SCOPE_DELIMITER = ':';
const emptyToastMessage = 'Please specify both scope and name before the search.';
const delimiterToastMessage = 'Neither scope nor name should contain ":".';

interface SearchPanelProps {
    startStreaming: (pattern: string, type: DIDType) => void;
    stopStreaming: () => void;
    initialPattern?: string;
    isRunning: boolean;
}

const SearchPanel = (props: SearchPanelProps) => {
    // Try retrieving initial search parameters
    let initialScope: string | undefined, initialName: string | undefined;
    const initialPatternParts = props.initialPattern?.split(SCOPE_DELIMITER);
    if (initialPatternParts && initialPatternParts.length === 2) {
        [initialScope, initialName] = initialPatternParts;
    }

    // Check the validity of the initial pattern
    useEffect(() => {
        // A short timeout is required for the toast context to initialize
        const timeout = setTimeout(() => {
            if (props.initialPattern && !initialScope && !initialName) {
                toast({
                    variant: 'warning',
                    title: 'Invalid initial pattern',
                    description: `Could not resolve "${props.initialPattern}"`,
                });
            }
        }, 0);

        return () => clearTimeout(timeout);
    }, []);

    const [scope, setScope] = useState<string | null>(initialScope ?? null);
    const [name, setName] = useState<string | null>(initialName ?? null);
    const [type, setType] = useState<DIDType>(DIDType.DATASET);

    const scopeInputRef = useRef<HTMLInputElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);

    const { toast } = useToast();

    const showToastAndFocus = (title: string, description: string, inputRef: React.RefObject<HTMLInputElement>) => {
        toast({
            variant: 'warning',
            title,
            description,
        });
        inputRef.current?.focus();
    };

    const validateField = (value: string | null, fieldName: string, inputRef: React.RefObject<HTMLInputElement>): boolean => {
        if (!value) {
            showToastAndFocus(`Empty ${fieldName}`, emptyToastMessage, inputRef);
            return false;
        } else if (value.includes(SCOPE_DELIMITER)) {
            showToastAndFocus(`":" in ${fieldName}`, delimiterToastMessage, inputRef);
            return false;
        }
        return true;
    };

    const validateScope = (): boolean => {
        return validateField(scope, 'scope', scopeInputRef);
    };

    const validateName = (): boolean => {
        return validateField(name, 'name', nameInputRef);
    };

    const onSearch = (event: any) => {
        event.preventDefault();

        if (!validateScope() || !validateName()) return;

        if (!props.isRunning) {
            props.startStreaming(`${scope}${SCOPE_DELIMITER}${name}`, type);
        } else {
            toast(alreadyStreamingToast);
        }
    };

    const onStop = (event: any) => {
        event.preventDefault();
        props.stopStreaming();
    };

    return (
        <div className="flex flex-col space-y-2 w-full md:items-start md:flex-row md:space-y-0 md:space-x-2">
            <div className="flex flex-col grow sm:flex-row space-y-2 sm:space-x-2 sm:space-y-0">
                <Select onValueChange={value => setType(value as DIDType)} defaultValue={type}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value={DIDType.CONTAINER}>Container</SelectItem>
                            <SelectItem value={DIDType.DATASET}>Dataset</SelectItem>
                            <SelectItem value={DIDType.FILE}>File</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <div className="w-full flex flex-row space-x-2 items-center">
                    <Input
                        ref={scopeInputRef}
                        placeholder="scope"
                        className="max-w-[250px]"
                        defaultValue={initialScope}
                        onInput={(event: ChangeEvent<HTMLInputElement>) => {
                            setScope(event.target.value);
                        }}
                        onEnterKey={onSearch}
                    />
                    <span className="text-neutral-900 dark:text-neutral-100 font-bold">:</span>
                    <Input
                        ref={nameInputRef}
                        placeholder="name"
                        defaultValue={initialName}
                        onInput={(event: ChangeEvent<HTMLInputElement>) => {
                            setName(event.target.value);
                        }}
                        onEnterKey={onSearch}
                    />
                </div>
            </div>
            <SearchButton isRunning={props.isRunning} onStop={onStop} onSearch={onSearch} />
        </div>
    );
};

export interface ListDIDProps {
    firstPattern?: string;
    initialData?: DIDViewModel[];
}

export const ListDID = (props: ListDIDProps) => {
    const { toast, dismiss } = useToast();
    // A shared validator
    const validator = new BaseViewModelValidator(toast);

    // List handling

    const streamingHook = useChunkedStream<DIDViewModel>();
    const [gridApi, setGridApi] = useState<GridApi<DIDViewModel> | null>(null);

    const onGridReady = (event: GridReadyEvent) => {
        setGridApi(event.api);
    };

    useEffect(() => {
        if (props.initialData) {
            onData(props.initialData);
        }
    }, [gridApi]);

    const onData = (data: DIDViewModel[]) => {
        const validData = data.filter(element => validator.isValid(element));
        gridApi?.applyTransactionAsync({ add: validData });
    };

    const startStreaming = (pattern: string, type: DIDType) => {
        if (gridApi) {
            // Hide active toasts
            dismiss();
            gridApi.flushAsyncTransactions();
            gridApi.setGridOption('rowData', []);
            validator.reset();
            removeMeta();

            const params = new URLSearchParams({
                query: pattern,
                type: type,
            });

            const url = '/api/feature/list-dids?' + params;
            streamingHook.start({ url, onData });
        } else {
            toast(noApiToast);
        }
    };

    const stopStreaming = () => {
        if (streamingHook.status === StreamingStatus.RUNNING) {
            streamingHook.stop();
        }
    };

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
            const params = new URLSearchParams({scope: selectedItem.scope, name: selectedItem.name});
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
            <SearchPanel
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
