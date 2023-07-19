import { twMerge } from "tailwind-merge"
import { ForwardedRef, forwardRef } from "react"
import { HiCog, HiSwitchHorizontal, HiLogout } from "react-icons/hi"

export const AccountDropdown = forwardRef(function AccountDropdown
    (
        props: {
            isProfileOpen: boolean,
            accountActive: string,
            accountsPossible: string[],
        },
        ref: ForwardedRef<HTMLDivElement>
    ) {
    return (

        <div
            className={twMerge("flex flex-col p-2 sm:w-fit",
                "rounded-md border shadow-md",
                props.isProfileOpen ? "visible" : "invisible",
                "absolute top-10 right-0",
                "divide-y",
                "bg-white dark:bg-slate-800",
                "z-[100]"
            )}
            onMouseEnter={e => e.preventDefault()}
            ref={ref}
        >
            <a
                className={twMerge(
                    "text-gray-600 hover:bg-gray-200 hover:cursor-pointer",
                    "dark:text-gray-300 dark:hover:bg-gray-600",
                    "flex items-center justify-between py-2 px-1 space-x-4",
                    "text-right"
                )}
                href="/accountsettings"
            >
                <HiCog className="text-3xl text-gray-600 dark:text-gray-100 shrink-0" />
                <span>
                    <span>Settings for </span>
                    <b className="text-gray-800 dark:text-gray-100">{props.accountActive}</b>
                </span>
            </a>
            <div
                className="flex flex-col"
            >
                {
                    (props.accountsPossible.filter(
                        (account) => account !== props.accountActive
                    )).map((account, index) => {
                        return (
                            <a
                                className={twMerge(
                                    "text-gray-600 hover:bg-gray-200 hover:cursor-pointer",
                                    "dark:text-gray-300 dark:hover:bg-gray-600",
                                    "flex items-center justify-between py-2 px-1 space-x-4",
                                    "text-right"
                                )}
                                key={index}
                                href="/switchaccount"
                            >
                                <HiSwitchHorizontal className="text-2xl dark:text-gray-100 shrink-0" />
                                <span>
                                    <span>Switch to </span>
                                    <b className="text-gray-800 dark:text-gray-100">{account}</b>
                                </span>
                            </a>
                        )
                    })
                }
            </div>
            <a
                className={twMerge(
                    "text-gray-800 hover:bg-red-200 hover:cursor-pointer",
                    "dark:text-gray-100 dark:hover:bg-red-600",
                    "flex items-center justify-between py-2 px-1 space-x-4",
                    "text-right",
                    "w-64 sm:w-96"
                )}
                href="/logout"
            >
                <b>Logout</b> <HiLogout className="text-3xl shrink-0" />
            </a>
        </div>
    )
}
)