import { DIDMeta } from "@/lib/core/data/rucio-dto"
import { DIDName, DIDSearchResponse, DIDSearchQuery } from "@/lib/infrastructure/data/view-model/createRule"
import { useState } from "react"
import { twMerge } from "tailwind-merge"
import { TextInput } from "../../Input/TextInput"
import { Button } from "../../Button/Button"
import { Checkbox } from "../../Checkbox/Checkbox"

export interface ListDIDPageProps {
    didSearch: (didSearchQuery: DIDSearchQuery) => void,
    didResponse: DIDSearchResponse,
    didMetaQuery: (did: DIDName) => void,
    didMetaQueryResponse: DIDMeta,
}



export const ListDID = (
    props: ListDIDPageProps
) => {
    const [didSearchQuery, setDidSearchQuery] = useState<string>("")
    const [didTypesAllowed, setDidTypesAllowed] = useState<[boolean, boolean, boolean]>([true, true, false]) // [container, dataset, file]
    return (
        <div
            className={twMerge(
                "flex flex-col space-y-2 w-full"
            )}
        >
            <div
                className={twMerge(
                    "rounded-md w-full",
                    "border p-2",
                    "flex flex-col items-center space-y-2",
                    "bg-white"
                )}
            >
                <form
                    className={twMerge(
                        "flex flex-col sm:flex-row sm:space-x-2 sm:items-end w-full",
                    )}
                >
                    <label className='w-fit' htmlFor='did-search-pattern'>DID Search Pattern</label>
                    <div className='grow'>
                        <TextInput
                            onBlur={(event: any) => { setDidSearchQuery(event.target.value) }}
                            onEnterkey={(event: any) => { setDidSearchQuery(event.target.value) }}
                            id="did-search-pattern"
                        />
                    </div>
                    <div className="w-full mt-2 sm:mt-0 sm:w-24 sm:grow-0">
                        <Button type="submit" label="Search" onClick={(e: any) => { props.didSearch({ DIDSearchString: didSearchQuery }) }} id="did-button-search" />
                    </div>
                </form>
                <div
                    className={twMerge(
                            "w-full flex flex-col p-2 rounded",
                            "bg-gray-200",
                    )}
                >
                    <form
                        className={twMerge(
                            "flex flex-col md:flex-row md:space-x-2 justify-space-between",
                            "text-gray-800"
                        )}
                        id="query-for-didtype-form"
                    >
                        <label className={twMerge("mr-2")} htmlFor="query-for-didtype-form">Query for DID Types:</label>
                        <Checkbox
                            label="Containers" type="checkbox" id="did-checkbox-container"
                            isChecked={didTypesAllowed[0]}
                            handleChange={(event: any) => {setDidTypesAllowed([event.target.checked, didTypesAllowed[1], didTypesAllowed[2]])}}
                        />
                        <Checkbox
                            label="Datasets" type="checkbox" id="did-checkbox-dataset"
                            isChecked={didTypesAllowed[1]}
                            handleChange={(event: any) => {setDidTypesAllowed([didTypesAllowed[0], event.target.checked, didTypesAllowed[2]])}}
                        />
                        <Checkbox
                            label="Files (Warning: large query)" type="checkbox" id="did-checkbox-file"
                            isChecked={didTypesAllowed[2]}
                            handleChange={(event: any) => {setDidTypesAllowed([didTypesAllowed[0], didTypesAllowed[1], event.target.checked])}}
                        />
                    </form>
                </div>
            </div>
            <div
                className={twMerge(
                    "grid grid-cols-3 gap-x-2",
                    "bg-white border p-2 rounded-md"
                )}
            >
                <div
                    className={twMerge(
                        "bg-white",
                        "col-span-2"
                    )}
                >
                    Table
                </div>
                <div
                    className={twMerge(
                        "bg-white"
                    )}
                >
                    Metadata
                </div>
            </div>
        </div>
    )
}