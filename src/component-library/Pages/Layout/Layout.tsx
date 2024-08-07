import Image from "next/image"

import { HiUserCircle, HiBell } from "react-icons/hi2"
import { HiMenu, HiChevronDown } from "react-icons/hi"
import { twMerge } from "tailwind-merge"

import React, { useState, useEffect, useRef, forwardRef } from "react"
import { Collapsible } from "../../Helpers/Collapsible"
import { AccountDropdown } from "./AccountDropdown"
import Link from "next/link"

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

    /* Add contants with state for each section if it is clicked or not*/

    const [isRulesDropDown, setIsRulesDropDown] = useState(false)
    const [isMoreDropDown, setIsMoreDropDown] = useState(false)

    const SearchDropdown = forwardRef(function SearchDropdown(
        props: {
                inputSelected: boolean,
                searchstring: string,
            },
            ref: React.ForwardedRef<HTMLDivElement>
        ) {
        const [isMouseOver, setIsMouseOver] = useState(false)
        const LinkElem = (props: { href: string, children: React.ReactNode }) => {
            return (
                <Link
                    href={props.href}
                    className={twMerge(
                        "w-full p-1 rounded-sm hover:cursor-pointer",
                        "hover:bg-neutral-200  text-text-800",
                        "hover:dark:bg-neutral-600 dark:bg-neutral-800 dark:text-text-100"
                    )}
                    onMouseDown={e => { e.preventDefault() }}

                >
                    {props.children}
                </Link>
            )
        }

        return (
            <div
                className={twMerge(
                    "w-[50rem] flex flex-col p-2",
                    "rounded-md border shadow-md",
                    (props.inputSelected || isMouseOver) ? "visible" : "invisible",
                    "absolute mt-2",
                    "text-text-900 dark:text-text-100",
                    "bg-neutral-100 dark:bg-neutral-800",
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
                    "hover:text-text-400 font-bold text-l hover:cursor-pointer text-text-100",
                    props.className ?? "",
                )}
                {...props}
            >
                {props.children}
            </a>
        )
    }

    const NavBar: React.FC = () => {
        return (
            <nav className="bg-gray-800 p-0 m-0 w-max">
                <div className="container mx-0 w-max flex ">
                    <ul className="flex space-x-5 md:flex-row flex-col">
                        <li className="group relative self-center">
                            <HeaderLinks
                                href="/dashboard"
                                className="w-max bg-neutral-800 text-text-100  px-2 py-2 hover:text-brand-500 text-left align-middle"
                            >
                                Dashboard
                            </HeaderLinks>
                        </li>
                        <li className="group relative self-center">
                            <HeaderLinks
                                href="/did/list"
                                className="w-max text-text-100 bg-neutral-800 px-2 py-2 hover:text-brand-500 text-left"
                            >
                                DIDs
                            </HeaderLinks>
                        </li>
                        <li className="group relative self-center">
                            <HeaderLinks
                                href="/rse/list"
                                className="w-max text-text-100 bg-neutral-800 px-2 py-2 hover:text-brand-500 text-center "
                            >
                                RSEs
                            </HeaderLinks>
                        </li>
                        <li className="group relative">
                            <div className="group-hover:block text-text-100 bg-neutral-800 focus:outline-none px-2 py-2">
                                Rules
                                <div className="absolute hidden group-hover:block group-focus-within:block bg-neutral-700 mt-1 rounded shadow-lg z-10 p-1 ">
                                    <HeaderLinks
                                        href="/rule/create"
                                        className="w-max pt-2 pl-1 pr-1 text-text-100 bg-neutral-700 block hover:text-brand-500  text-center"
                                    >
                                        Create Rule
                                    </HeaderLinks>
                                    <HeaderLinks
                                        href="/rule/list"
                                        className="pt-2 pb-2 pl-1 pr-1   text-text-100 bg-neutral-700 block hover:text-brand-500 text-center"
                                    >
                                        List Rules
                                    </HeaderLinks>
                                </div>
                            </div>
                        </li>
                        <li className="group relative">
                            <div className="group-hover:block text-text-100 bg-neutral-800 focus:outline-none px-2 py-2">
                                ...
                                <div className="absolute hidden group-hover:block group-focus-within:block bg-neutral-700 mt-1 rounded shadow-lg z-10 p-1">
                                    <HeaderLinks
                                        href="/subscription/list"
                                        className="w-max pt-2 pb-2 pl-1 pr-1  text-text-100 bg-neutral-700 block hover:text-brand-500 text-center"
                                    >
                                        Subscription
                                    </HeaderLinks>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
    const SideNavBar: React.FC = () => {
        return (
            <nav className="bg-gray-800 p-0 m-0 w-max">
                <div className="container mx-0 w-max flex ">
                <ul className="flex space-x-5 md:flex-row flex-col">
                    <li className="group relative">
                    <div className="group-hover:block text-text-100 bg-neutral-800 focus:outline-none px-2 py-2">
                        <HiMenu className="text-4xl" />
                        <div className="absolute hidden group-hover:block group-focus-within:block bg-neutral-700 mt-1 rounded shadow-lg z-10 p-1">
                            <HeaderLinks
                                href="/dashboard"
                                className="w-max pt-2 pb-2  pl-1 pr-1  text-text-100 bg-neutral-700 block hover:text-brand-500 text-center"
                            >
                                Dashboard
                            </HeaderLinks>

                            <HeaderLinks
                                href="/did/list"
                                className="w-max pt-2 pb-2 pl-1 pr-1  text-text-100 bg-neutral-700 block hover:text-brand-500 text-center"
                            >
                                DIDs
                            </HeaderLinks>

                            <HeaderLinks
                                href="/rse/list"
                                className="w-max pt-2 pb-2 pl-1 pr-1  text-text-100 bg-neutral-700 block hover:text-brand-500 text-center"
                            >
                                RSEs
                            </HeaderLinks>
                            <HeaderLinks
                                href="/rule/create"
                                className="w-max pt-2 pb-2 pl-1 pr-1  text-text-100 bg-neutral-700 block hover:text-brand-500  text-center"
                            >
                                Create Rule
                            </HeaderLinks>
                            <HeaderLinks
                                href="/rule/list"
                                className="w-max pt-2 pb-2 pl-1 pr-1  text-text-100 bg-neutral-700 block hover:text-brand-500 text-center"
                            >
                                List Rules
                            </HeaderLinks>
                            <HeaderLinks
                                href="/subscription/list"
                                className="w-max pt-2 pb-2 pl-1 pr-1  text-text-100 bg-neutral-700 block hover:text-brand-500 text-center"
                            >
                                Subscription
                            </HeaderLinks>
                        </div>
                    </div>
                    </li></ul>
                </div>
            </nav>
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
                "dark:bg-neutral-900 bg-neutral-100",
                "h-full min-h-screen",
                "flex flex-col"
            )}
        >
            <header
                className={twMerge(
                    "w-full flex flex-col bg-neutral-800 space-y-2 p-2",
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
                        <SideNavBar></SideNavBar>
                    </span>

                    <span className="flex flex-row space-x-2">
                        <a className="bg-neutral-100 w-12 h-12 rounded" href={"//"+props.LVM.rucioProjectLink}>
                            <Image src="/logocropped.svg" alt="Rucio Logo" width={48} height={48}/>
                        </a>
                        <a className="bg-brand-500 w-12 h-12" href={"//"+props.LVM.experimentProjectLink} />
                    </span>
                    <span className="hidden md:visible md:flex space-x-16 items-center pl-2 pr-2">
                        <span className="relative">
                            <input
                                className={twMerge(
                                    "p-2 rounded-lg w-48 lg:w-96 bg-neutral-600 text-text-100",
                                    "focus:bg-neutral-100 focus:text-text-900"
                                )}
                                placeholder="Search"
                                onFocus={() => setIsSearching(true)}
                                // onBlur={() => setIsSearching(false)}
                                onChange={e => setSearchString(e.target.value)}
                                ref={searchMenuInputRef}
                            />
                            <SearchDropdown
                                inputSelected={isSearching}
                                searchstring={searchString}
                                ref={searchMenuRef}
                            />
                        </span>
                        <NavBar></NavBar>
                    </span>

                    <span className="flex space-x-1 items-end relative pl-2 pr-2">
                        <button
                            className="text-text-100 hover:text-brand-500 flex items-center"
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
                    "text-text-500",
                    "flex"
                )}
            >
                <div
                    className={twMerge(
                        "grow",
                        "flex flex-row space-x-2 items-end"
                    )}
                >
                    <Image src="/logocropped.svg" alt="Cropped Rucio Donkeyhead" width={48} height={48} className="block md:hidden"/>
                    <p className="hidden md:block">Rucio WebUI, 2023</p>
                </div>
                <div
                    className={twMerge(
                        "w-72",
                        "grid grid-flow-col-dense grid-cols-2 grid-rows-2"
                    )}
                >
                    <a href="/docs/api" className="hover:text-brand-500">API</a>
                    <a href="/privacy" className="hover:text-brand-500">Privacy</a>
                    <a href="/docs" className="hover:text-brand-500">Docs</a>
                    <a href="/status" className="hover:text-brand-500">Status</a>
                </div>
            </footer>
        </div>
    )
}