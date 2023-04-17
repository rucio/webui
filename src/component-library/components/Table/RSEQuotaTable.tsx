import { RSEInformation } from "@/lib/infrastructure/data/view-model/createRule"
import { H3 } from "../Text/Headings/H3"
import { P } from "../Text/Content/P"

export const RSEQuotaTable = (
    props: {
        data: Array<RSEInformation>, // actually use the exported interface here
        selected: string[],
        onAdd: (RSEName: string) => void,
        onRemove: (RSEName: string) => void,
        askApproval?: boolean,
    }
) => {
    return (
        <div className="w-full border dark:border-2 rounded-md">
            <table className="w-full text-left">
                <thead className="w-full flex hover:cursor-default">
                    <tr className="w-full flex hover:cursor-default border-b dark:border-b-2 p-2">
                        <th className="w-2/3 md:w-1/2"><H3>RSE</H3></th>
                        <th className="w-1/3 md:visible md:w-1/4"><H3>Remaining Quota</H3></th>
                        <th className="collapse md:visible w-1/4"><H3>Total Quota</H3></th>
                    </tr>
                </thead>
                <tbody className="w-full overflow-y-auto flex flex-col h-48">
                    {props.data.map((element, index) => {
                        // Check if RSE is already selected
                        // If not, check if RSE has quota
                        return (
                            !props.selected.includes(element.RSEName) ? (
                                element.RemainingQuota > 0 || props.askApproval ? (
                                    <tr
                                        key={index}
                                        onClick={(event) => { props.onAdd(element.RSEName) }}
                                        className="hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-900 flex w-full border-b p-2 hover:cursor-pointer"
                                    >
                                        <td className="w-2/3 md:w-1/2"><P mono>{element.RSEName}</P></td>
                                        <td className="w-1/3 md:visible md:w-1/4"><P mono>{element.RemainingQuota}</P></td>
                                        <td className="collapse md:visible w-1/4"><P mono>{element.TotalQuota}</P></td>
                                    </tr>) : (
                                    <tr
                                        key={index}
                                        onClick={(event) => { }}
                                        className="hover:cursor-not-allowed flex w-full border-b p-2"
                                    >
                                        <td className="w-2/3 md:w-1/2"><P mono>{element.RSEName}</P></td>
                                        <td className="w-1/3 md:visible md:w-1/4"><P mono className="dark:text-red-500 text-red-500 font-bold">{element.RemainingQuota}</P></td>
                                        <td className="collapse md:visible w-1/4"><P mono>{element.TotalQuota}</P></td>
                                    </tr>
                                )
                            ) : (
                                <tr
                                    key={index}
                                    onClick={(event) => { props.onRemove(element.RSEName) }}
                                    className="bg-blue-200 hover:bg-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 flex w-full border-b p-2 hover:cursor-pointer"
                                >
                                    <td className="w-2/3 md:w-1/2"><P mono>{element.RSEName}</P></td>
                                    <td className="w-1/3 md:visible md:w-1/4"><P mono>{element.RemainingQuota}</P></td>
                                    <td className="collapse md:visible w-1/4"><P mono>{element.TotalQuota}</P></td>
                                </tr>
                            ))
                    })}
                </tbody>
            </table>
        </div>

    )
}
