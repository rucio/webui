import { CreateRuleQuery } from "@/lib/infrastructure/data/view-model/createRule"
import { DIDType } from "@/lib/core/data/rucio-dto"
import { twMerge } from "tailwind-merge"

export const TabularSummary = (
    props: {
        data: string[],
        title: string,
    }
) => {
    const id = "summary-table-" + props.title.toLowerCase()
    return (
        <div
            className={twMerge(
                "bg-white rounded-md overflow-hidden border",
                "h-96 flex flex-col"
            )}
        >
            <label htmlFor={id}>
                <h3
                    className="text-xl font-bold p-2"
                >
                    {props.title}, TODO make this tanstack and searchable
                </h3>
            </label>
            <div
                className={twMerge("h-full overflow-y-auto")}
                id={id}
            >
                <table className="w-full border">
                    {props.data.map((elem, index) => {
                        return (
                            <tr
                                key={index}
                                className="odd:bg-stone-100"
                            >
                                <td
                                    className="break-all md:break-normal pl-2 py-1"
                                >
                                    {elem}
                                </td>
                                <td
                                    className="w-8 text-center"
                                >
                                    ?
                                </td>
                            </tr>
                        )
                    })
                    }
                </table>
            </div>
        </div>
    )
}

export const SummaryPage = (
    props: {
        data: CreateRuleQuery
    }
) => {
    return (
        <div
            className={twMerge(
                "flex flex-col space-y-2",
                "p-2",
                "bg-white dark:bg-gray-800"
            )}
        >
            <h1>Summary Page</h1>
            <div
                className={twMerge(
                    "bg-gray-100",
                    "grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 gap-4",
                    "p-2",
                    "rounded-md border"
                )}
            >
                <TabularSummary data={props.data.DIDList} title="DIDs" />
                <TabularSummary data={props.data.RSEList} title="RSEs"/>
            </div>
            <div
                className={twMerge(
                    "bg-amber-400",
                    "col-span-full"
                )}
            >
                Options
            </div>
        </div>
    )
}