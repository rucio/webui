import {DIDMetaViewModel, DIDViewModel} from "@/lib/infrastructure/data/view-model/did"
import {useEffect, useRef, useState} from "react"
import {twMerge} from "tailwind-merge"
import {TextInput} from "../../Input/TextInput"
import {Button} from "../../Button/Button"
import {DIDMetaView} from "./DIDMetaView"
import {ListDIDTable} from "./ListDIDTable"
import {Heading} from "../Helpers/Heading"
import {Body} from "../Helpers/Body"
import {DIDType} from "@/lib/core/entity/rucio"
import {Checkbox} from "../../Button/Checkbox"
import Link from "next/link"
import {useSearchParams} from "next/navigation";
import {StreamingStatus, UseChunkedStream} from "@/lib/infrastructure/hooks/useChunkedStream";
import {AgGridReact} from "ag-grid-react";
import {SelectionChangedEvent} from "ag-grid-community";

export interface ListDIDPageProps {
    streamingHook: UseChunkedStream<DIDViewModel>,
    metaQuery: (scope: string, name: string) => Promise<DIDMetaViewModel>,
}

export const ListDID = (
    props: ListDIDPageProps
) => {
    const searchParams = useSearchParams()
    const firstPattern = searchParams?.get('pattern')

    const tableRef = useRef<AgGridReact>(null);

    const [meta, setMeta] = useState<DIDMetaViewModel>({status: "pending"} as DIDMetaViewModel)
    const [pattern, setPattern] = useState<string | null>(firstPattern ?? null);
    const [type, setType] = useState<DIDType>(DIDType.DATASET);

    const [selected, setSelected] = useState<DIDViewModel | null>(null);

    const getMeta = async () => {
        // TODO: handle multiple ongoing requests for metadata
        const newMeta = await props.metaQuery(selected!.scope, selected!.name);
        setMeta(newMeta);
    }

    useEffect(() => {
        if (selected !== null) {
            getMeta();
        }
    }, [selected])

    const onData = (data: DIDViewModel) => {
        tableRef.current?.api.applyTransactionAsync({add: [data]});
    }

    const startStreaming = () => {
        if (tableRef.current?.api) {
            const api = tableRef.current!.api;
            api.setGridOption('rowData', []);
        }

        const url = '/api/feature/list-dids?' + new URLSearchParams({
            'query': pattern!,
            'type': type
        });
        props.streamingHook.start({url, onData});
    };

    useEffect(() => {
        if (pattern === null) return;

        startStreaming();
    }, []);

    const onSearch = (event: any) => {
        event.preventDefault();
        // TODO: display a warning message
        if (pattern === null || pattern === '') return;
        // TODO: possibly check for semicolon on the client side as well

        if (props.streamingHook.status !== StreamingStatus.RUNNING) {
            startStreaming();
        } else {
            // TODO: display an error message
        }
    }

    const onSelectionChanged = (event: SelectionChangedEvent) => {
        const selectedRows = event.api.getSelectedRows();
        if (selectedRows.length === 1) {
            setSelected(selectedRows[0] as DIDViewModel);
        } else {
            setSelected(null);
        }
    };

    return (
        <div
            className={twMerge(
                "flex flex-col space-y-2 w-full grow"
            )}
        >
            <Heading
                title="List DIDs"
            >
                <form
                    className={twMerge(
                        "flex flex-col sm:flex-row sm:space-x-2 sm:items-end w-full ",
                    )}
                    aria-label="DID Search"
                >
                    <label
                        className={twMerge(
                            "w-fit",
                            "text-text-1000 dark:text-text-0 "
                        )}
                        htmlFor='did-search-pattern'
                    >
                        DID Search Pattern
                    </label>
                    <div className='grow'>
                        <TextInput
                            onChange={(event) => {
                                setPattern(event.target.value);
                            }}
                            onEnterkey={onSearch}
                            id="did-search-pattern"
                            defaultValue={firstPattern ?? ''}
                        />
                    </div>

                    <div className="w-full mt-2 sm:mt-0 sm:w-24 sm:grow-0">
                        {props.streamingHook.status === StreamingStatus.STOPPED ? <Button
                            type="button"
                            label="Search"
                            onClick={onSearch}
                            id="did-button-search"
                        /> : <Button
                            type="button"
                            label="Stop"
                            onClick={() => {
                                props.streamingHook.stop();
                            }}
                            className={twMerge(
                                "w-full mt-2 sm:mt-0 sm:w-24 sm:grow-0",
                                "bg-base-error-500 hover:bg-base-error-600"
                            )}
                        />}
                    </div>
                </form>
                <div
                    className={twMerge(
                        "w-full flex flex-col p-2 rounded",
                        "bg-neutral-200 dark:bg-neutral-900",
                    )}
                >
                    <form
                        className={twMerge(
                            "flex flex-col md:flex-row md:space-x-4 justify-space-between",
                            "text-text-800 dark:text-text-0"
                        )}
                        id="query-for-didtype-form"
                        aria-label="Select DID Types to Query"
                    >
                        <label className={twMerge("mr-2 text-text-1000 dark:text-text-0")}
                               htmlFor="query-for-didtype-form">Query for DID Types:</label>
                        <Checkbox
                            label="Container"
                            type="radio"
                            name="query-for-didtype-form"
                            onChange={(e: any) => {
                                setType(e.target.id as DIDType)
                            }}
                            id={DIDType.CONTAINER}
                        />
                        <Checkbox
                            label="Dataset"
                            type="radio"
                            name="query-for-didtype-form"
                            onChange={(e: any) => {
                                setType(e.target.id as DIDType)
                            }}
                            checked={type === DIDType.DATASET} // default to dataset
                            id={DIDType.DATASET}
                        />
                        <Checkbox
                            label="File"
                            type="radio"
                            name="query-for-didtype-form"
                            onChange={(e: any) => {
                                setType(e.target.id as DIDType)
                            }}
                            id={DIDType.FILE}
                        />
                    </form>
                </div>
            </Heading>
            <Body
                className={twMerge(
                    "grid grid-rows-2 gap-y-2 lg:grid-rows-1 lg:grid-cols-3 lg:gap-y-0 lg:gap-x-2",
                    "grow"
                )}
            >
                <div
                    className={twMerge(
                        "bg-neutral-0 dark:bg-neutral-900",
                        "min-w-0",
                        "lg:col-span-2",
                        "flex flex-col h-[800px]"
                    )}
                >
                    <ListDIDTable
                        streamingHook={props.streamingHook}
                        tableRef={tableRef}
                        onSelectionChanged={onSelectionChanged}
                    />
                </div>
                <div
                    className={twMerge(
                        "bg-neutral-100 dark:bg-neutral-900",
                        "rounded-md p-2",
                        "flex flex-col space-y-2",
                    )}
                >
                    <DIDMetaView data={meta} show={selected !== null}/>
                    <div
                        className={twMerge(
                            "text-text-800 dark:text-text-100",
                            selected === null ? "block" : "hidden",
                        )}
                        aria-label="Notice: No DID selected"
                    >
                        <i className="dark:text-text-200 text-text-1000">No DID selected</i>
                    </div>
                    <div
                        className={twMerge(
                            selected !== null ? "" : "hidden",
                        )}
                        aria-label="Go To DID Page"
                    >
                        <Link
                            className={twMerge(
                                "py-1 px-3 rounded w-full block",
                                "bg-brand-500 hover:bg-brand-600 text-text-0",
                                "cursor-pointer",
                                "text-center font-bold",
                            )}
                            href={`/did/page/${meta.scope}/${meta.name}`}>
                            Go To DID Page
                        </Link>
                    </div>
                </div>
            </Body>
        </div>
    )
}