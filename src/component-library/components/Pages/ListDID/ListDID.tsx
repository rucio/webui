import { DID, DIDMeta } from "@/lib/core/entity/rucio"
import { DIDName, DIDSearchResponse, DIDSearchQuery } from "@/lib/infrastructure/data/view-model/create-rule"
import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"
import { TextInput } from "../../Input/TextInput"
import { Button } from "../../Button/Button"
import { Checkbox } from "../../Checkbox/Checkbox"
import { DIDMetaView } from "./DIDMetaView"
import { ListDIDTable } from "./ListDIDTable"

var format = require("date-format")

export interface ListDIDPageProps {
    didSearch: (didSearchQuery: DIDSearchQuery) => void,
    didResponse: DIDSearchResponse,
    didMetaQuery: (did: DIDName) => void,
    didMetaQueryResponse: DIDMeta,
}



export const ListDID = (
    props: ListDIDPageProps
) => {
    const meta = props.didMetaQueryResponse
    const [didSearchQuery, setDidSearchQuery] = useState<string>("")
    const [didTypesAllowed, setDidTypesAllowed] = useState<[boolean, boolean, boolean]>([true, true, false]) // [container, dataset, file]
    const [multipleDidTypes, setMultipleDidTypes] = useState<boolean>(true)
    useEffect(() => {
        setMultipleDidTypes(
            didTypesAllowed.reduce((accumulator, currentValue) => accumulator + (currentValue ? 1 : 0), 0) > 1
        )
    }, [didTypesAllowed])


    // selection
    const [selectedDID, setSelectedDID] = useState<DIDName | null>(null) // scope:name taken from table
    const [selection, setSelection] = useState<DID[]>([]) // list of objects from table
    useEffect(() => {
        if (selection.length === 1) {
            setSelectedDID(selection[0].scope + ":" + selection[0].name)
        }
        else {
            setSelectedDID(null)
        }
    }, [selection])

    return (
        <div
            className={twMerge(
                "flex flex-col space-y-2 w-full"
            )}
        >
            <div
                className={twMerge(
                    "rounded-md w-full",
                    "border dark:border-2 dark:border-gray-200 p-2",
                    "flex flex-col items-center space-y-2",
                    "bg-white dark:bg-gray-800"
                )}
            >
                <form
                    className={twMerge(
                        "flex flex-col sm:flex-row sm:space-x-2 sm:items-end w-full",
                    )}
                    aria-label="DID Search"
                >
                    <label
                        className={twMerge(
                            "w-fit",
                            "text-black dark:text-white"
                        )}
                        htmlFor='did-search-pattern'
                    >
                        DID Search Pattern
                    </label>
                    <div className='grow'>
                        <TextInput
                            onBlur={(event: any) => { setDidSearchQuery(event.target.value) }}
                            onEnterkey={(event: any) => { setDidSearchQuery(event.target.value) }}
                            id="did-search-pattern"
                        />
                    </div>
                    <div className="w-full mt-2 sm:mt-0 sm:w-24 sm:grow-0">
                        <Button type="button" label="Search" onClick={(e: any) => { props.didSearch({ DIDSearchString: didSearchQuery }) }} id="did-button-search" />
                    </div>
                </form>
                <div
                    className={twMerge(
                        "w-full flex flex-col p-2 rounded",
                        "bg-gray-200 dark:bg-gray-900",
                    )}
                >
                    <form
                        className={twMerge(
                            "flex flex-col md:flex-row md:space-x-2 justify-space-between",
                            "text-gray-800 dark:text-white"
                        )}
                        id="query-for-didtype-form"
                        aria-label="Select DID Types to Query"
                    >
                        <label className={twMerge("mr-2")} htmlFor="query-for-didtype-form">Query for DID Types:</label>
                        <Checkbox
                            label="Containers" type="checkbox" id="did-checkbox-container"
                            isChecked={didTypesAllowed[0]}
                            handleChange={(event: any) => { setDidTypesAllowed([event.target.checked, didTypesAllowed[1], didTypesAllowed[2]]) }}
                        />
                        <Checkbox
                            label="Datasets" type="checkbox" id="did-checkbox-dataset"
                            isChecked={didTypesAllowed[1]}
                            handleChange={(event: any) => { setDidTypesAllowed([didTypesAllowed[0], event.target.checked, didTypesAllowed[2]]) }}
                        />
                        <Checkbox
                            label="Files (Warning: large query)" type="checkbox" id="did-checkbox-file"
                            isChecked={didTypesAllowed[2]}
                            handleChange={(event: any) => { setDidTypesAllowed([didTypesAllowed[0], didTypesAllowed[1], event.target.checked]) }}
                        />
                    </form>
                </div>
            </div>
            <div
                className={twMerge(
                    "grid grid-rows-2 gap-y-2 lg:grid-rows-1 lg:grid-cols-3 lg:gap-y-0 lg:gap-x-2",
                    "bg-white dark:bg-gray-800 border dark:border-gray-200 dark:border-2",
                    "p-2 rounded-lg"
                )}
            >
                <div
                    className={twMerge(
                        "bg-white",
                        "min-w-0",
                        "lg:col-span-2"
                    )}
                >
                    <ListDIDTable
                        tableData={{
                            data: props.didResponse.data,
                            fetchStatus: "idle",
                            pageSize: 10,
                        }}
                        selectionFunc={(data: DID[]) => {
                            // pass data from child (table) into the component state
                            setSelection(data)
                        }}
                    />
                </div>
                <div
                    className={twMerge(
                        "bg-stone-100 dark:bg-gray-900",
                        "rounded-md p-2",
                        "flex flex-col space-y-2",
                    )}
                >
                    <DIDMetaView data={props.didMetaQueryResponse} show={selectedDID ? true : false} />
                    <div
                        className={twMerge(
                            "text-gray-800",
                            !selectedDID ? "block" : "hidden",
                        )}
                        aria-label="Notice: No DID selected"
                    >
                        <i className="dark:text-gray-200">No DID selected</i>
                    </div>
                    <div
                        className={twMerge(
                            selectedDID ? "block" : "hidden",
                        )}
                        aria-label="Go To DID Page"
                    >
                        <Button label="Go To DID Page" aria-label="Go To DID Page" />
                    </div>
                </div>
            </div>
        </div>
    )
}