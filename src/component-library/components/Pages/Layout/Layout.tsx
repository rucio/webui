import { TextInput } from "../../Input/TextInput"

import { HiUserCircle, HiBell } from "react-icons/hi2"
import { HiMenu, HiChevronDown } from "react-icons/hi"
import { twMerge } from "tailwind-merge"

import React, { useState, useEffect, useRef, forwardRef } from "react"
import { Collapsible } from "../../Helpers/Collapsible"
import { H3 } from "../../Text/Headings/H3"
import { P } from "../../Text/Content/P"
import { AccountDropdown } from "./AccountDropdown"

export interface LayoutViewModel {
    accountActive: string,
    accountsPossible: string[],
    rucioProjectLink: string,
    experimentProjectLink: string,
}

export const Layout = (
    props: {
        children: React.ReactNode,
        LVM: LayoutViewModel
    }
) => {

    const [isSearching, setIsSearching] = useState(false)
    const [searchString, setSearchString] = useState<string>("")
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)

    const SearchDropdown = forwardRef(function SearchDropdown
        (
            props: {
                inputSelected: boolean,
                searchstring: string,
            },
            ref: React.ForwardedRef<HTMLDivElement>
        ) {

        const [isMouseOver, setIsMouseOver] = useState(false)
        const LinkElem = (props: { href: string, children: React.ReactNode }) => {
            return (
                <a
                    href={props.href}
                    className={twMerge(
                        "w-full p-1 rounded-sm hover:cursor-pointer",
                        "hover:bg-gray-200 text-gray-800",
                        "hover:dark:bg-gray-600 dark:bg-slate-800 dark:text-gray-100"
                    )}
                    onMouseDown={e => { e.preventDefault() }}

                >
                    {props.children}
                </a>
            )
        }

        return (
            <div
                className={twMerge(
                    "w-[50rem] flex flex-col p-2",
                    "rounded-md border shadow-md",
                    (props.inputSelected || isMouseOver) ? "visible" : "invisible",
                    "absolute mt-2",
                    "bg-white dark:bg-slate-800",
                    "z-[100]"
                )}
                onMouseEnter={() => { setIsMouseOver(true) }}
                onMouseLeave={() => { setIsMouseOver(false) }}
            >
                <nav
                    className="w-full h-full flex flex-col items-start"
                >
                    <LinkElem href="/dids">
                        Search for <i>{props.searchstring}</i> in <b>DIDs</b>
                    </LinkElem>
                    <LinkElem href="/rules">
                        Search for <i>{props.searchstring}</i> in <b>Rules</b>
                    </LinkElem>
                    <LinkElem href="/rses">
                        Search for <i>{props.searchstring}</i> in <b>RSEs</b>
                    </LinkElem>
                </nav>
            </div>
        )
    })

    const HeaderLinks: React.FC<JSX.IntrinsicElements["a"]> = (
        {
            ...props
        }
    ) => {
        return (
            <a
                className={twMerge(
                    "hover:text-gray-400 font-bold text-l hover:cursor-pointer text-gray-100",
                    props.className ?? "",
                )}
                {...props}
            >
                {props.children}
            </a>
        )
    }

    const accountMenuRef = useRef<HTMLDivElement>(null)
    const accountMenuButtonRef = useRef<HTMLButtonElement>(null)
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (!accountMenuRef.current?.contains(event.target) && !accountMenuButtonRef.current?.contains(event.target)) {
                setIsProfileOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
    }, [accountMenuRef])

    const searchMenuRef = useRef<HTMLDivElement>(null)
    const searchMenuInputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (!searchMenuRef.current?.contains(event.target) && !searchMenuInputRef.current?.contains(event.target)) {
                setIsSearching(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
    }, [searchMenuRef])


    // images to be returned by static nextjs
    return (
        <div
            className={twMerge(
                "dark:bg-gray-900 bg-gray-100",
                "h-full min-h-screen",
                "flex flex-col"
            )}
        >
            <header
                className={twMerge(
                    "w-full flex flex-col bg-gray-800 space-y-2 p-2",
                    "md:h-16",
                    "z-[100]"
                )}
            >
                <nav
                    className="w-full h-full flex justify-between items-center"
                >
                    <span
                        className="flex md:hidden"
                    >
                        <button
                            className="text-gray-100"
                            onClick={() => { setIsHamburgerOpen(!isHamburgerOpen) }}
                        >
                            <HiMenu className="text-4xl" />
                        </button>
                    </span>

                    <span className="flex flex-row space-x-2">
                        <a className="bg-green-500 w-12 h-12" href={props.LVM.rucioProjectLink} />
                        <a className="bg-purple-500 w-12 h-12" href={props.LVM.experimentProjectLink} />
                    </span>
                    <span className="hidden md:visible md:flex space-x-4 items-center">
                        <span className="relative">
                            <input
                                className={twMerge(
                                    "p-2 rounded-lg w-48 lg:w-96 bg-gray-600 text-gray-100",
                                    "focus:bg-white focus:text-black"
                                )}
                                placeholder="Search"
                                onFocus={() => setIsSearching(true)}
                                // onBlur={() => setIsSearching(false)}
                                onChange={(e) => setSearchString(e.target.value)}
                                ref={searchMenuInputRef}
                            />
                            <SearchDropdown inputSelected={isSearching} searchstring={searchString} ref={searchMenuRef} />
                        </span>
                        <HeaderLinks href="/createrule" onFocus={() => setIsSearching(false)}>Create Rule</HeaderLinks>
                        <HeaderLinks href="/dids">List DIDs</HeaderLinks>
                        <HeaderLinks href="/rules">List Rules</HeaderLinks>
                    </span>
                    <span className="flex space-x-2 items-end relative">
                        <a
                            className="hidden md:block text-gray-100"
                            href="/notifications"
                        >
                            <HiBell className="text-4xl" />
                        </a>
                        <button
                            className="text-gray-100 flex items-center"
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            ref={accountMenuButtonRef}
                        >
                            <HiUserCircle className="text-4xl" />
                            <HiChevronDown className="hidden md:inline" />
                        </button>
                        <AccountDropdown
                            isProfileOpen={isProfileOpen}
                            accountActive={props.LVM.accountActive}
                            accountsPossible={props.LVM.accountsPossible}
                            ref={accountMenuRef}
                        />
                    </span>
                </nav>
                <Collapsible showIf={isHamburgerOpen}>
                    <nav
                        className="w-full flex flex-col md:hidden items-start space-y-2 divide-y divide-gray-600 border-t border-gray-600 "
                    >
                        <HeaderLinks href="/createrule" className="w-full pt-2">Create Rule</HeaderLinks>
                        <HeaderLinks href="/dids" className="w-full pt-2">List DIDs</HeaderLinks>
                        <HeaderLinks href="/rules" className="w-full pt-2">List Rules</HeaderLinks>
                        <HeaderLinks href="/notifications" className="w-full pt-2"><span className="flex justify-between items-center">Notifications <HiBell /></span></HeaderLinks>
                    </nav>
                </Collapsible>
            </header>
            <main
                className={twMerge(
                    "lg:px-24 xl:px-36 py-4 md:py-8",
                    "flex flex-col grow",
                    "z-[10]"
                )}
            >
                {props.children}
            </main>
            <footer
                className={twMerge(
                    "border-t",
                    "h-16 p-2",
                    "text-gray-500",
                    "grid grid-flow-row-dense grid-cols-3 grid-rows-2"
                )}
            >
                <p className="row-span-2">Rucio Webui, 2023</p>
                <a href="/docs/api" className="hover:text-blue-500">API</a>
                <a href="/privacy" className="hover:text-blue-500">Privacy</a>
                <a href="/docs" className="hover:text-blue-500">Docs</a>
                <a href="/status" className="hover:text-blue-500">Status</a>
            </footer>
        </div>
    )
}