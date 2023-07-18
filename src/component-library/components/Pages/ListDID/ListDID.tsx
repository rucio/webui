import { DIDViewModel, DIDMetaViewModel } from "@/lib/infrastructure/data/view-model/did"
import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"
import { TextInput } from "../../Input/TextInput"
import { Button } from "../../Button/Button"
import { Checkbox } from "../../Checkbox/Checkbox"
import { DIDMetaView } from "./DIDMetaView"
import { ListDIDTable } from "./ListDIDTable"
import { UseComDOM } from "@/lib/infrastructure/hooks/useComDOM"
import { Heading } from "../Helpers/Heading"
import { Body } from "../Helpers/Body"

var format = require("date-format")

export interface ListDIDPageProps {
    comdom: UseComDOM<DIDViewModel>,
    didMetaQuery: (scope: string, name: string) => void,
    didMetaQueryResponse: DIDMetaViewModel,
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
    const [selectedDID, setSelectedDID] = useState<string | null>(null) // scope:name taken from table
    const [selection, setSelection] = useState<DIDViewModel[]>([]) // list of objects from table
    useEffect(() => {
        if (selection.length === 1) {
            setSelectedDID(selection[0].scope + ":" + selection[0].name)
            props.didMetaQuery(selection[0].scope, selection[0].name)
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
            <Heading
                title="List DIDs"
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
                        <Button
                            type="button"
                            label="Search"
                            onClick={async (e: any) => {
                                // deal with comDOM here
                                // call `props.comDOM.setQuery` with the query
                                // and start query
                                props.comdom.start()
                            }}
                            id="did-button-search"
                        />
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
            </Heading>
            <Body
                className={twMerge(
                    "grid grid-rows-2 gap-y-2 lg:grid-rows-1 lg:grid-cols-3 lg:gap-y-0 lg:gap-x-2",
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
                        comdom={props.comdom}
                        selectionFunc={(data: DIDViewModel[]) => {
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
            </Body>
        </div>
    )
}