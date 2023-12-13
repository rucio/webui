import { NormalTable } from "@/component-library/StreamedTables/NormalTable"
import { BasicStatusTagProps } from "@/component-library/Tags/BasicStatusTag"
import { P } from "@/component-library/Text/Content/P"
import { RSEAccountUsageLimitViewModel } from "@/lib/infrastructure/data/view-model/rse"
import { createColumnHelper } from "@tanstack/react-table"
import { twMerge } from "tailwind-merge"

type TRSESummaryTableRow = {
    rseName: string,
    remainingQuota: number,
    totalQuota: number,
    hasQuota: boolean,
    tags: BasicStatusTagProps[]
}

export const RSESummaryTable = (props: {
    rseAccountUsageLimitViewModels: RSEAccountUsageLimitViewModel[]
}) => {
    const generateTableData = () => {
        return props.rseAccountUsageLimitViewModels.map((rseAccountUsageLimitViewModel: RSEAccountUsageLimitViewModel) => {
            const badges: BasicStatusTagProps[] = []
            if(!rseAccountUsageLimitViewModel.has_quota) {
                badges.push({
                    text: 'No Quota',
                    status: 'error',
                })
            }
            return {
                rseName: rseAccountUsageLimitViewModel.rse,
                hasQuota: rseAccountUsageLimitViewModel.has_quota,
                remainingQuota: rseAccountUsageLimitViewModel.bytes_remaining,
                totalQuota: rseAccountUsageLimitViewModel.bytes_limit,
                tags: badges
            } as TRSESummaryTableRow
        })
    }
    const generateMessages = () => {
        const messages: string[] = []
        const multiRSE: boolean = props.rseAccountUsageLimitViewModels.length > 1
        if(multiRSE) {
                messages.push('The rule will replicate on one of the following RSEs.')
        }else {
            messages.push('The rule will replicate on the following RSE.')
        }
        return messages
    }

    const tableData = generateTableData()
    const messages = generateMessages()
    const columnHelper = createColumnHelper<TRSESummaryTableRow>()
    const tablecolumns: any[] = [
        columnHelper.accessor('rseName', {
            id: 'rseName',
            header: info => {
                return (
                    <div className={twMerge(
                        "text-xl text-left",
                        "dark:text-white",
                    )}
                    >
                        RSE
                    </div>
                )
            },
            cell: info => {
                return (
                    <div className={twMerge(
                        "text-left",
                        "dark:text-white",
                    )}>
                        <P>{info.getValue()}</P>
                    </div>
                )
            }
        })
    ]
    return (
        <div className="flex flex-col space-y-4">
            <div>
                <div
                    className={twMerge(
                        "px-2 mx-2 rounded border dark:border-0",
                        "bg-gray-200 dark:bg-gray-800",
                        "dark:text-white"
                    )}
                >
                    <ul className="">
                        {messages.map((message, index) => {
                            return (
                                <li
                                    key={index}
                                    className="pl-5 list-disc"
                                >
                                    {message}
                                </li>
                            )
                        })
                        }
                    </ul>
                </div>
            </div>
            <NormalTable<TRSESummaryTableRow>
                tablecolumns={tablecolumns}
                tabledata={tableData}
                tablestyling={{
                    "tableHeadRowStyle": "border-b border-gray-300 bg-gray-700 dark:bg-gray-800",
                    "tableBodyRowStyle": twMerge(
                        "bg-white odd:bg-stone-100 text-black",
                        "dark:bg-gray-700 odd:dark:bg-gray-800 dark:text-gray-100",
                        "border-b border-gray-300",
                    )
                }}
            />
        </div>
    )
} 