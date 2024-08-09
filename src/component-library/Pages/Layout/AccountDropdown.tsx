import {twMerge} from "tailwind-merge"
import {ForwardedRef, forwardRef, useState} from "react"
import {HiSwitchHorizontal, HiLogout, HiUserAdd} from "react-icons/hi"
import Link from "next/link"

const AccountList = (props: { accountList: string[] }) => {
    return <div className="flex flex-col">
        {
            props.accountList.map((account, index) => {
                return (
                    <a
                        className={twMerge(
                            "text-text-600 hover:bg-neutral-200 hover:cursor-pointer",
                            "dark:text-text-300 dark:hover:bg-neutral-600",
                            "flex items-center justify-between py-2 px-1 space-x-4",
                            "text-right"
                        )}
                        key={index}
                        href={`/api/auth/switch?account=${account}&&callbackUrl=/dashboard`}
                    >
                        <HiSwitchHorizontal className="text-2xl text-text-900 dark:text-text-100 shrink-0"/>
                        <span>
                            <span>Switch to </span>
                            <b className="text-text-800 dark:text-text-100">{account}</b>
                        </span>
                    </a>
                )
            })
        }
    </div>
};

const SignOutOfAllButton = () => {
    return <Link
        className={twMerge(
            "text-text-800 hover:bg-base-warning-200 hover:cursor-pointer",
            "dark:text-text-100 dark:hover:bg-base-warning-600",
            "flex items-center justify-between py-2 px-1 space-x-4",
            "text-right",
        )}
        href="/api/auth/logout"
        prefetch={false}
    >
        <span><b>Sign out</b> of all accounts</span>
        <HiLogout className="dark:text-text-100 text-2xl text-text-900 shrink-0"/>
    </Link>
}

const SignIntoButton = () => {
    return <Link
        className={twMerge(
            "text-text-800 hover:bg-base-warning-200 hover:cursor-pointer",
            "dark:text-text-100 dark:hover:bg-base-warning-600",
            "flex items-center justify-between py-2 px-1 space-x-4",
            "text-right",
        )}
        href="/auth/login"
        prefetch={false}
    >
        <span>Sign <b>in to</b> another account</span>
        <HiUserAdd className="dark:text-text-100 text-2xl text-text-900 shrink-0"/>
    </Link>
}

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
                    "z-[100]",
                    "w-64 sm:w-96"
                )}
                onMouseEnter={e => e.preventDefault()}
                ref={ref}
            >
                <div
                    className={twMerge(
                        "text-text-600 hover:cursor-pointer",
                        "dark:text-text-300",
                        "flex justify-between items-center py-4 px-1 space-x-4",
                        "text-right"
                    )}
                >
                <span className="text-xl">
                    <span>Hello, </span>
                    <b className="text-text-800 dark:text-text-100">{props.accountActive}</b>!
                </span>
                    <div
                        className={twMerge(
                            "bg-neutral-200 hover:bg-base-warning-600",
                            "p-1",
                            "rounded-md"
                        )}
                    >
                        {/* Using the <a> tag here prevents a bug with response caching */}
                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                        <a href="/api/auth/logout?callbackUrl=/dashboard">
                            <HiLogout className="text-2xl text-text-900 shrink-0"/>
                        </a>
                    </div>
                </div>
                {props.accountsPossible.length !== 1 &&
                    <AccountList accountList={props.accountsPossible.filter(account => account !== props.accountActive)}/>
                }
                <SignIntoButton/>
            </div>
        )
    }
)