import {twMerge} from "tailwind-merge";
import {Heading} from "../Helpers/Heading";
import {RSEViewModel} from "@/lib/infrastructure/data/view-model/rse";
import {TextInput} from "@/component-library/Input/TextInput";
import {useEffect, useRef, useState} from "react";
import {Button} from "@/component-library/Button/Button";
import {useSearchParams} from "next/navigation";
import {StreamingStatus, UseChunkedStream} from "@/lib/infrastructure/hooks/useChunkedStream";
import {AgGridReact} from "ag-grid-react";
import {ListRSETable} from "@/component-library/Pages/RSE/ListRSETable";

type ListRSEProps = {
    streamingHook: UseChunkedStream<RSEViewModel>
}

const defaultExpression = "*";
export const ListRSE = (props: ListRSEProps) => {
    const searchParams = useSearchParams()
    const firstExpression = searchParams?.get('expression')
    const [expression, setExpression] = useState<string | null>(firstExpression ?? null);

    const tableRef = useRef<AgGridReact>(null);

    const onData = (data: RSEViewModel) => {
        tableRef.current?.api.applyTransaction({add: [data]});
    }

    const startStreaming = () => {
        if (tableRef.current?.api) {
            const api = tableRef.current!.api;
            api.setGridOption('rowData', []);
        }

        const url = `/api/feature/list-rses?rseExpression=${expression ?? defaultExpression}`;
        props.streamingHook.start({url, onData});
    };

    useEffect(() => {
        if (expression === null) return;

        startStreaming();
    }, []);

    const updateExpression = (value: string) => {
        setExpression(value !== '' ? value : defaultExpression);
    }

    const onSearch = (event: any) => {
        event.preventDefault();
        if (props.streamingHook.status !== StreamingStatus.RUNNING) {
            startStreaming();
        } else {
            // TODO: display an error message (toast?) if there's streaming already
        }
    }

    return (
        <div
            className={twMerge(
                "flex flex-col space-y-2 w-full grow"
            )}
        >
            <Heading
                title="List RSEs"
            >
                <form
                    className={twMerge(
                        "flex flex-col sm:flex-row sm:space-x-2 sm:items-end w-full",
                    )}
                    aria-label="RSE Search"
                >
                    <label
                        className={twMerge(
                            "w-fit flex-none",
                            "text-text-1000 dark:text-text-0"
                        )}
                        htmlFor='rse-search-pattern'
                    >
                        RSE Search Pattern
                    </label>
                    <TextInput
                        onEnterkey={onSearch}
                        onChange={(e) => {
                            updateExpression(e.target.value);
                        }}
                        id="rse-search-pattern"
                        defaultValue={firstExpression ?? ''}
                        placeholder={defaultExpression}
                    />
                    {props.streamingHook.status === StreamingStatus.STOPPED ?
                        <Button
                            type="button"
                            label="Search"
                            onClick={onSearch}
                            className={twMerge(
                                "w-full mt-2 sm:mt-0 sm:w-24 sm:grow-0"
                            )}
                            id="rse-button-search"
                        /> :
                        <Button
                            type="button"
                            label="Stop"
                            onClick={() => {
                                props.streamingHook.stop();
                            }}
                            className={twMerge(
                                "w-full mt-2 sm:mt-0 sm:w-24 sm:grow-0",
                                "bg-base-error-500 hover:bg-base-error-600"
                            )}
                        />
                    }
                </form>
            </Heading>
            <ListRSETable tableRef={tableRef} streamingHook={props.streamingHook}/>
        </div>
    );
};
