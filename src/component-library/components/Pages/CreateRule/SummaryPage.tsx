import { CreateRuleQuery } from "@/lib/infrastructure/data/view-model/createRule"
import { BoolTag } from "../../Tags/BoolTag"
import { twMerge } from "tailwind-merge"
import FC from "react"

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
            <h1>Summary Page</h1>
            <div
                className={twMerge(
                    "grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 gap-4",
                    "p-2",
                    "rounded-md border"
                )}
            >
                <TabularSummary data={props.data.DIDList} title="DIDs" />
                <TabularSummary data={props.data.RSEList} title="RSEs" />
            </div>
            <div
                className={twMerge(
                    "bg-gray-100 border",
                    "rounded-md",
                    "flex flex-col"
                )}
            >
                <div className="flex flex-row">
                    <h3
                        className="text-xl font-bold p-2"
                    >
                        Options
                    </h3>
                </div>
                <div
                    className="p-2"
                >
                    General
                    <table className="w-full bg-white border">
                        <tr className="border">
                            <OptionTD>Expiry Date</OptionTD>
                            <OptionTD>{format("yyyy-MM-dd", props.data.expirydate)}</OptionTD>
                        </tr>
                        <tr className="border">
                            <OptionTD>Enable Notifications</OptionTD>
                            <OptionTD><BoolTag val={props.data.notifications}/></OptionTD>
                        </tr>
                        <tr className="border">
                            <OptionTD>Asynchronous Mode</OptionTD>
                            <OptionTD><BoolTag val={props.data.asynchronousMode}/></OptionTD>
                        </tr>
                        <tr className="border">
                            <OptionTD>Group By</OptionTD>
                            <OptionTD>{props.data.groupby}</OptionTD>
                        </tr>
                        <tr className="border">
                            <OptionTD>Number of Copies</OptionTD>
                            <OptionTD>{props.data.numcopies}</OptionTD>
                        </tr>
                        <tr className="border">
                            <OptionTD>Comment</OptionTD>
                            <OptionTD>{props.data.comment}</OptionTD>
                        </tr>
                    </table>
                </div>
                <div>
                    Samples
                </div>
            </div>
        </div>
    )
}