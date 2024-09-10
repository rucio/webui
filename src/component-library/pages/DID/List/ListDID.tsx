import { DIDMetaViewModel, DIDViewModel } from '@/lib/infrastructure/data/view-model/did';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { DIDType } from '@/lib/core/entity/rucio';
import useChunkedStream, { StreamingStatus } from '@/lib/infrastructure/hooks/useChunkedStream';
import { GridApi, GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community';
import { Heading } from '@/component-library/atoms/misc/Heading';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/component-library/atoms/form/select';
import { Input } from '@/component-library/atoms/form/input';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { useQuery } from '@tanstack/react-query';
import { ListDIDTable } from '@/component-library/pages/DID/List/ListDIDTable';
import { BaseViewModelValidator } from '@/component-library/utils';
import { SearchButton } from '@/component-library/features/search/SearchButton';
import { alreadyStreamingToast, noApiToast } from '@/component-library/features/utils/list-toasts';
import { DIDMetaView } from '@/component-library/pages/DID/List/DIDMetaView';

const SCOPE_DELIMITER = ':';
const emptyToastMessage = 'Please specify both scope and name before the search.';
const delimiterToastMessage = 'Neither scope nor name should contain ":".';

interface PatternInputProps {
    startStreaming: (pattern: string) => void;
    stopStreaming: () => void;
    firstPattern?: string;
    isRunning: boolean;
}

const PatternInput = (props: PatternInputProps) => {
    let firstScope: string | undefined, firstName: string | undefined;
    const firstPatternParts = props.firstPattern?.split(SCOPE_DELIMITER);
    if (firstPatternParts && firstPatternParts.length === 2) {
        [firstScope, firstName] = firstPatternParts;
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (props.firstPattern && !firstScope && !firstName) {
                toast({
                    variant: 'warning',
                    title: 'Invalid initial pattern',
                    description: `Could not resolve "${props.firstPattern}"`,
                });
            }
        }, 0);

        return () => clearTimeout(timeout);
    }, []);

    const [scope, setScope] = useState<string | null>(firstScope ?? null);
    const [name, setName] = useState<string | null>(firstName ?? null);

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
            const pattern = scope + SCOPE_DELIMITER + name;
            props.startStreaming(pattern);
        } else {
            toast(alreadyStreamingToast);
        }
    };

    const onStop = (event: any) => {
        event.preventDefault();
        props.stopStreaming();
    };

    return (
        <>
            <div className="w-full flex flex-row space-x-2 items-center">
                <Input
                    ref={scopeInputRef}
                    placeholder="scope"
                    className="max-w-[250px]"
                    defaultValue={firstScope}
                    onInput={(event: ChangeEvent<HTMLInputElement>) => {
                        setScope(event.target.value);
                    }}
                    onEnterKey={onSearch}
                />
                <span className="text-neutral-900 dark:text-neutral-100 font-bold">:</span>
                <Input
                    ref={nameInputRef}
                    placeholder="name"
                    defaultValue={firstName}
                    onInput={(event: ChangeEvent<HTMLInputElement>) => {
                        setName(event.target.value);
                    }}
                    onEnterKey={onSearch}
                />
            </div>
            <SearchButton isRunning={props.isRunning} onStop={onStop} onSearch={onSearch} />
        </>
    );
};

export interface ListDIDPageProps {
    firstPattern?: string;
    initialData?: DIDViewModel[];
    queryMeta: (scope: string, name: string) => Promise<DIDMetaViewModel>;
}

export const ListDID = (props: ListDIDPageProps) => {
    const streamingHook = useChunkedStream<DIDViewModel>();
    const [gridApi, setGridApi] = useState<GridApi<DIDViewModel> | null>(null);
    const { toast, dismiss } = useToast();
    const validator = new BaseViewModelValidator(toast);

    const [type, setType] = useState<DIDType>(DIDType.DATASET);

    const onGridReady = (event: GridReadyEvent) => {
        if (props.initialData) {
            event.api.applyTransactionAsync({ add: props.initialData });
        }
        setGridApi(event.api);
    };

    const onData = (data: DIDViewModel[]) => {
        const validData = data.filter(element => validator.isValid(element));
        gridApi?.applyTransactionAsync({ add: validData });
    };

    const startStreaming = (pattern: string) => {
        if (gridApi) {
            // Hide active toasts
            dismiss();
            gridApi.flushAsyncTransactions();
            gridApi.setGridOption('rowData', []);
            validator.reset();

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

    const [selected, setSelected] = useState<DIDViewModel | null>(null);

    const {
        data: meta,
        error: metaError,
        isLoading: isMetaLoading,
        refetch: refetchMeta,
    } = useQuery({
        queryKey: ['meta'],
        queryFn: () => {
            if (selected !== null) {
                return props.queryMeta(selected.scope, selected.name);
            }
        },
        enabled: false,
    });

    const onSelectionChanged = (event: SelectionChangedEvent) => {
        const selectedRows = event.api.getSelectedRows();
        if (selectedRows.length === 1) {
            setSelected(selectedRows[0] as DIDViewModel);
        } else {
            setSelected(null);
        }
    };

    useEffect(() => {
        if (selected !== null) {
            refetchMeta();
        }
    }, [selected]);

    return (
        <div className="flex flex-col space-y-3 w-full grow">
            <Heading text="DIDs" />
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
                    <PatternInput
                        isRunning={streamingHook.status === StreamingStatus.RUNNING}
                        startStreaming={startStreaming}
                        stopStreaming={stopStreaming}
                        firstPattern={props.firstPattern}
                    />
                </div>
            </div>
            <div className="flex flex-row space-x-3 grow">
                <div className="flex flex-col flex-1">
                    <ListDIDTable streamingHook={streamingHook} onSelectionChanged={onSelectionChanged} onGridReady={onGridReady} />
                </div>
                {meta ? <DIDMetaView data={meta} show={true} /> : <div className="flex-1"></div>}
            </div>
        </div>
    );
};
