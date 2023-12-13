import { BoolTag } from "../../Tags/BoolTag"
import { twMerge } from "tailwind-merge"
import { DIDTypeTag } from "../../Tags/DIDTypeTag"
import { SamplingTag } from "../../Tags/SamplingTag"
import { RuleSummaryViewModel } from "@/lib/infrastructure/data/view-model/rule"
import { BasicStatusTag } from "@/component-library/Tags/BasicStatusTag"
import { generateDerivedDIDName, generateNewScope } from "@/lib/core/utils/did-utils"
import { DID } from "@/lib/core/entity/rucio"
import { BasicStatusTagProps } from "@/component-library/Tags/BasicStatusTag"
import { DIDSummaryTable, TDIDSummaryTableRowProps } from "./DIDSummaryTable"
import { RSESummaryTable } from "./RSESummaryTable"

var format = require("date-format")

const OptionTD = (props: { children: any }): JSX.Element =>
    <td
        className="pl-2 py-1"
    >
        {props.children}
    </td>

export const SummaryPage = (
    props: {
        data: RuleSummaryViewModel
    }
    ) => {

        
    const multiRSE = props.data.RSEViewModels.length > 1
    const sampleFiles = props.data.numsamples
    const lifetime = (props.data.expirydate.getTime() - (new Date().getTime())) / (1000 * 60 * 60 * 24)
    const lifetimeDays = Math.floor(lifetime) > 0 ? Math.floor(lifetime) : 1
    const userAskedForApproval = props.data.approval

    const getMessages = () => {
        const messages = []
        if(lifetimeDays === 1) {
            messages.push("The lifetime will be 1 day.  If this is ok you can submit the rule request. If not you can go back and change it.")
        }else {
            messages.push(`The lifetime will be ${lifetimeDays} days.  If this is ok you can submit the rule request. If not you can go back and change it.`)
        }
        return messages
    }
    return (
        <div
            className={twMerge(
                "flex flex-col space-y-4",
                "p-2",
                "bg-white dark:bg-gray-800"
            )}
        >
            
            <div
                className={twMerge(
                    "flex flex-row space-x-2",
                    "p-2",
                    "rounded-md border",
                    "dark:border-2"
                )}
            >
                <DIDSummaryTable 
                    listDIDViewModels={props.data.DIDViewModels}
                    numSamples={sampleFiles} 
                    takeSamples={props.data.takeSamples}
                    accountInfo={props.data.accountInfo}
                    numcopies={props.data.numcopies}
                    userAskedForApproval={userAskedForApproval}
                />
            </div>
            
            <div
                className={twMerge(
                    "flex flex-row space-x-2",
                    "p-2",
                    "rounded-md border",
                    "dark:border-2"
                )}
            >
                <RSESummaryTable rseAccountUsageLimitViewModels={props.data.RSEViewModels} />
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
                        <tbody>
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
                                <td><BoolTag val={props.data.notifications} /></td>
                            </tr>
                            <tr className="border-t dark:border-gray-400">
                                <OptionTD>Asynchronous Mode</OptionTD>
                                <td><BoolTag val={props.data.asynchronousMode} /></td>
                            </tr>
                            <tr className="border-t dark:border-gray-400">
                                <OptionTD>Group By</OptionTD>
                                <td><DIDTypeTag didtype={props.data.groupby} /></td>
                            </tr>
                            <tr className="border-t dark:border-gray-400">
                                <OptionTD>Number of Copies</OptionTD>
                                <td className="select-all py-1">{props.data.numcopies}</td>
                            </tr>
                            <tr className="border-t dark:border-gray-400">
                                <OptionTD>Comment</OptionTD>
                                <td className="select-all py-1">{props.data.comment}</td>
                            </tr>
                        </tbody>
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