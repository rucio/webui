import { twMerge } from "tailwind-merge"
import { ForwardedRef, forwardRef, useState } from "react"
import { HiCog, HiSwitchHorizontal, HiLogout } from "react-icons/hi"
import Link from "next/link"

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
                "bg-neutral-100 dark:bg-neutral-800",
                "z-[100]"
            )}
            onMouseEnter={e => e.preventDefault()}
            ref={ref}
        >
            <Link
                className={twMerge(
                    "text-text-600 hover:bg-neutral-200 hover:cursor-pointer",
                    "dark:text-text-300 dark:hover:bg-neutral-600",
                    "flex items-center justify-between py-2 px-1 space-x-4",
                    "text-right"
                )}
                href="/accountsettings"
                prefetch={false}
            >
                <HiCog className="text-3xl text-text-600 dark:text-text-100 shrink-0" />
                <span>
                    <span>Settings for </span>
                    <b className="text-text-800 dark:text-text-100">{props.accountActive}</b>
                </span>
            </Link>
            <div
                className="flex flex-col"
            >
                {
                    (props.accountsPossible.filter(
                        (account) => account !== props.accountActive
                    )).map((account, index) => {
                        return (
                            <Link
                                className={twMerge(
                                    "text-text-600 hover:bg-neutral-200 hover:cursor-pointer",
                                    "dark:text-text-300 dark:hover:bg-neutral-600",
                                    "flex items-center justify-between py-2 px-1 space-x-4",
                                    "text-right"
                                )}
                                key={index}
                                href="/api/account/switch"
                                prefetch={false}
                            >
                                <HiSwitchHorizontal className="text-2xl text-text-900 dark:text-text-100 shrink-0" />
                                <span>
                                    <span>Switch to </span>
                                    <b className="text-text-800 dark:text-text-100">{account}</b>
                                </span>
                            </Link>
                        )
                    })
                }
            </div>
            <Link
                className={twMerge(
                    "text-text-800 hover:bg-base-warning-200 hover:cursor-pointer",
                    "dark:text-text-100 dark:hover:bg-base-warning-600",
                    "flex items-center justify-between py-2 px-1 space-x-4",
                    "text-right",
                    "w-64 sm:w-96"
                )}
                href="/api/auth/logout"
                prefetch={false}
            >
                <b>Logout</b> <HiLogout className="text-3xl text-text-900 shrink-0" />
            </Link>
        </div>
    )
}
)