import { Alert } from "@/component-library/Misc/Alert"
import { NormalTable } from "@/component-library/StreamedTables/NormalTable"
import { CreateRulesViewModel, TRuleIDDIDPair } from "@/lib/infrastructure/data/view-model/create-rule"
import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"

export type TCreateRuleStatusPageProps = {
    createRuleViewModel: CreateRulesViewModel | undefined
}

export const CreateRuleStatusPage = ({
    createRuleViewModel
}: TCreateRuleStatusPageProps
) => {

    const columnHelper = createColumnHelper<TRuleIDDIDPair>()
    const tablecolumns: any[] = [
        columnHelper.accessor("RuleID", {
            id: "RuleID",
            header: info => {
                return (
                    <div className="text-xl text-left dark:text-white">
                        <span>Rule ID</span>
                    </div>
                )
            },
            cell: info => {
                return (
                    <div className="flex flex-col text-left dark:text-white">
                        <Link
                            className={twMerge(
                                "text-blue-500 hover:text-blue-700",
                                "dark:text-blue-400 dark:hover:text-blue-300"
                            )}
                            href={`/rule/page/${info.getValue()}`}
                        >
                            {info.getValue()}
                        </Link>
                    </div>
                )
            }
        }),
        columnHelper.accessor("DID", {
            id: "DID",
            header: info => {
                return (
                    <div className="text-xl text-left dark:text-white">
                        <span>DID</span>
                    </div>
                )
            },
            cell: info => {
                return (
                    <div className="flex flex-col text-left dark:text-white">
                        <span>{info.getValue()}</span>
                    </div>
                )
            }
        }),
    ]
    // Handle Loading State
    if (!createRuleViewModel || createRuleViewModel.status === 'pending') return (
        <div
            className={twMerge(
                "flex flex-col items-center space-y-4",
                "w-full h-full",
                "p-2",
                "bg-white dark:bg-gray-800",
                "dark:text-white"
            )}
        >
            <div className="flex items-center justify-center w-56 h-56 ">
                <div className="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">loading...</div>
            </div>
        </div>
    )
    // Handle errors
    if (createRuleViewModel.status === 'error') {
        const errorMessage = createRuleViewModel.message
        return (
            <div
                className={twMerge(
                    "flex flex-col space-y-4",
                    "w-full h-full",
                    "p-2",
                    "bg-white dark:bg-gray-800",
                    "dark:text-white"
                )}
            >
                <Alert
                    variant="error"
                    message="Oops! Something went wrong."
                />
                <div className={twMerge(
                    "border rounded-md p-1",
                    "bg-white dark:bg-gray-800",
                    "text-red-500"
                )}>
                    {errorMessage}
                </div>
            </div>
        )
    }
    // Handle Success
    return (
        <div
            className={twMerge(
                "flex flex-col space-y-4",
                "w-full h-full",
                "p-2",
                "bg-white dark:bg-gray-800",
                "dark:text-white"
            )}
        >
            <Alert
                variant="success"
                message="Your rule(s) have been created. "

            />
            <NormalTable
                tablecolumns={tablecolumns}
                tabledata={createRuleViewModel.rules}
                tablestyling={{
                    "tableHeadRowStyle": "border-b border-gray-300 bg-gray-700 dark:bg-gray-800",
                    "tableBodyRowStyle": twMerge(
                        "bg-white odd:bg-stone-100 text-black",
                        "dark:bg-gray-700 odd:dark:bg-gray-800 dark:text-gray-100",
                        "border-b border-gray-300",
                    )
                }}
            />
            <div>
                You can also view all your rules by clicking&nbsp;
                <Link
                    className={twMerge(
                        "text-blue-500 hover:text-blue-700",
                        "dark:text-blue-400 dark:hover:text-blue-300"
                    )}
                    href="/rule/list">
                    here.
                </Link>
            </div>
        </div>
    )

}