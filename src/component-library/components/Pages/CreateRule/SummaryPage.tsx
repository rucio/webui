import { CreateRuleQuery } from "@/lib/infrastructure/data/view-model/createRule"
import { BoolTag } from "../../Tags/BoolTag"
import { twMerge } from "tailwind-merge"
import FC from "react"
import { DIDTypeTag } from "../../Tags/DIDTypeTag"
import { HiQuestionMarkCircle } from "react-icons/hi"

var format = require("date-format")

const TabularSummary = (
    props: {
        data: string[],
        title: string,
    }
) => {
    const id = "summary-table-" + props.title.toLowerCase()
    return (
        <div
            className={twMerge(
                "bg-white rounded-md overflow-hidden",
                "h-96 flex flex-col"
            )}
        >
            <label htmlFor={id}>
                <h3
                    className={twMerge(
                        "text-xl font-bold p-2",
                        "bg-white dark:bg-gray-800",
                        "text-black dark:text-white"
                    )}
                >
                    {props.title // TODO: make this searchable
                    }
                </h3>
            </label>
            <div
                className={twMerge(
                    "h-full overflow-y-auto rounded-md",
                    "dark:bg-gray-800"
                )}
                id={id}
            >
                <table className="w-full border dark:border-2 rounded-md">
                    {props.data.map((elem, index) => {
                        return (
                            <tr
                                key={index}
                                className={twMerge(
                                    "bg-white odd:bg-stone-100 text-black",
                                    "dark:bg-gray-700 odd:dark:bg-gray-800 dark:text-gray-100"
                                )}
                            >
                                <td
                                    className="break-all md:break-normal pl-2 py-1 select-all"
                                >
                                    {elem}
                                </td>
                                <td
                                    className="w-8 text-center"
                                >
                                    <button>
                                        <HiQuestionMarkCircle/>
                                    </button>
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

const OptionTD = (props: {children: any}): JSX.Element =>  
        <td
            className="pl-2 py-1"
        >
            {props.children}
        </td>

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
            <h1
                className={twMerge("text-2xl font-bold text-black dark:text-white")}
            >
                Summary Page
            </h1>
            <div
                className={twMerge(
                    "grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 gap-4",
                    "p-2",
                    "rounded-md border",
                    "dark:border-2"
                )}
            >
                <TabularSummary data={props.data.DIDList} title="DIDs" />
                <TabularSummary data={props.data.RSEList} title="RSEs" />
            </div>
            <div
                className={twMerge(
                    "bg-gray-100 dark:bg-gray-800",
                    "border dark:border-2",
                    "rounded-md",
                    "flex flex-col",
                    "pb-2"
                )}
            >
                <div className="flex flex-row">
                    <h3
                        className="text-xl font-bold p-2 text-gray-800 dark:text-white"
                    >
                        Options
                    </h3>
                </div>
                <div
                    className="px-2"
                >
                    <table className={twMerge(
                            "w-full rounded-md table-fixed", 
                            "bg-white dark:bg-gray-700",
                            "text-gray-800 dark:text-gray-100"
                        )}
                    >
                        <tr className="text-black dark:text-white">
                            <th className="w-56 pl-2 py-2 text-left">Parameter</th>
                            <th className="pl-2 py-2 text-left">Value</th>
                        </tr>
                        <tr className="border-t dark:border-gray-400">
                            <OptionTD>Expiry Date</OptionTD>
                            <td className="select-all py-1">{format("yyyy-MM-dd", props.data.expirydate)}</td>
                        </tr>
                        <tr className="border-t dark:border-gray-400">
                            <OptionTD>Enable Notifications</OptionTD>
                            <td><BoolTag val={props.data.notifications}/></td>
                        </tr>
                        <tr className="border-t dark:border-gray-400">
                            <OptionTD>Asynchronous Mode</OptionTD>
                            <td><BoolTag val={props.data.asynchronousMode}/></td>
                        </tr>
                        <tr className="border-t dark:border-gray-400">
                            <OptionTD>Group By</OptionTD>
                            <td><DIDTypeTag didtype={props.data.groupby}/></td>
                        </tr>
                        <tr className="border-t dark:border-gray-400">
                            <OptionTD>Number of Copies</OptionTD>
                            <td className="select-all py-1">{props.data.numcopies}</td>
                        </tr>
                        <tr className="border-t dark:border-gray-400">
                            <OptionTD>Comment</OptionTD>
                            <td className="select-all py-1">{props.data.comment}</td>
                        </tr>
                    </table>
                </div>
                <div>
                    <h3
                        className="text-xl font-bold p-2 dark:text-white"
                    >
                        Samples
                    </h3>
                    <div
                        className={twMerge(
                            "px-2 mx-2 rounded border dark:border-0",
                            props.data.numsamples >= 0 ? "bg-teal-300 dark:bg-teal-600" : "bg-gray-200 dark:bg-gray-600",
                            "dark:text-white"
                        )}
                    >
                        {props.data.numsamples < 0 ? "Not taking Samples" : "Sampling " + props.data.numsamples + " elements from the named DIDs."}
                    </div>
                </div>
            </div>
        </div>
    )
}