import { CreateRulesViewModel } from "@/lib/infrastructure/data/view-model/create-rule"
import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"

export type TCreateRuleStatusPageProps = {
    createRuleViewModel: CreateRulesViewModel | undefined
}

export const CreateRuleStatusPage = ({
    createRuleViewModel
}: TCreateRuleStatusPageProps
) => {
    const [viewModel, setViewModel] = useState("")

    // Handle Loading State
    if (!createRuleViewModel) return (
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
    if(createRuleViewModel.status === 'error'){
        const errorMessage = createRuleViewModel.message
        return (
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
                    <div className="px-3 py-1 text-xs font-medium leading-none text-center text-red-800 bg-red-200 rounded-full animate-pulse dark:bg-red-900 dark:text-red-200">{errorMessage}</div>
                </div>
            </div>
        )
    }
    // Handle Success
    return (
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
                <div className="px-3 py-1 text-xs font-medium leading-none text-center text-green-800 bg-green-200 rounded-full animate-pulse dark:bg-green-900 dark:text-green-200">Success!</div>
            </div>
        </div>
    )

}