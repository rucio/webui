import { TextInput } from "../../Input/TextInput"

import { HiOutlineBell, HiUserCircle, HiChevronDown, HiBars3 } from "react-icons/hi2"
import { twMerge } from "tailwind-merge"

import { useState, useEffect } from "react"

export const SearchDropdown = (
    props: {
        inputSelected: boolean,
        searchstring: string
    }
) => {
    const [isHovering, setIsHovering] = useState(false)

    return (
        <div
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={twMerge(
                "w-[50rem] flex flex-col bg-white p-2",
                "rounded-md border shadow-md",
                props.inputSelected || isHovering ? "visible" : "invisible",
                "absolute mt-2"
            )}
        >
            <nav
                className="w-full h-full flex flex-col items-start"
            >
                <a className="hover:bg-blue-300 w-full p-1 rounded-sm hover:cursor-pointer" >Search for <i>{props.searchstring}</i> in <b>DIDs</b></a>
                <a className="hover:bg-blue-300 w-full p-1 rounded-sm hover:cursor-pointer" >Search for <i>{props.searchstring}</i> in <b>Rules</b></a>
                <a className="hover:bg-blue-300 w-full p-1 rounded-sm hover:cursor-pointer" >Search for <i>{props.searchstring}</i> in <b>RSEs</b></a>
            </nav>
        </div>
    )
}

export const HeaderLinks = (
    props: {
        children: any
        link: string,
    }
) => {
    return (
        <a
            className="text-gray-100 hover:text-gray-400 font-bold text-l hover:cursor-pointer"
            href={props.link}
        >
            {props.children}
        </a>
    )
}

export const Layout = (
    props: {
        child: React.ReactNode
    }
) => {
    // images to be returned by static nextjs
    const [isSearching, setIsSearching] = useState(false)
    const [searchString, setSearchString] = useState<string>("")
    return (
        <div>
            <header
                className="w-full h-16 bg-gray-800 p-2"
            >
                <nav
                    className="w-full h-full flex justify-between items-center"
                >
                    <span
                        className="md:hidden"
                    >
                        <a className="text-gray-100">
                            <HiBars3 className="text-4xl" />
                        </a>
                    </span>
                    <span className="flex flex-row space-x-2">
                        <a className="bg-green-500 w-12 h-12" />
                        <a className="bg-purple-500 w-12 h-12" />
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
                                onBlur={() => setIsSearching(false)}
                                onChange={(e) => setSearchString(e.target.value)}
                            />
                            <SearchDropdown inputSelected={isSearching} searchstring={searchString} />
                        </span>
                        <HeaderLinks link="/createrule">Create Rule</HeaderLinks>
                        <HeaderLinks link="/dids">List DIDs</HeaderLinks>
                        <HeaderLinks link="/rules">List Rules</HeaderLinks>
                    </span>
                    <span className="flex space-x-2 items-end">
                        <a
                            className="invisible md:visible text-gray-100"
                            href="/notifications"
                        >
                            <HiOutlineBell className="text-4xl" />
                        </a>
                        <a
                            className="text-gray-100 flex items-center"
                            href="/profile"
                        >
                            <HiUserCircle className="text-4xl" />
                            <HiChevronDown className="hidden md:inline" />
                        </a>
                    </span>
                </nav>
            </header>
            <main>
                {props.child}
            </main>
        </div>
    )
}