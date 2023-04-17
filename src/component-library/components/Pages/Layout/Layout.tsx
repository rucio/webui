import { TextInput } from "../../Input/TextInput"

import { HiOutlineBell, HiUserCircle, HiChevronDown, HiBars3 } from "react-icons/hi2"

export const Layout = (
    props: {
        child: React.ReactNode
    }
) => {
    // images to be returned by static nextjs
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
                            <HiBars3 className="text-4xl"/>
                        </a>
                    </span>
                    <span className="flex flex-row space-x-2">
                        <a className="bg-green-500 w-12 h-12"/>
                        <a className="bg-purple-500 w-12 h-12"/>
                    </span>
                    <span className="hidden md:visible md:flex space-x-2 items-center">
                        <input
                            className="p-2 rounded-lg w-48 lg:w-96 bg-gray-600 focus:bg-white"
                            placeholder="Search"
                        />
                        <a className="text-gray-100 font-bold text-xl">Hi</a>
                        <a className="text-gray-100 font-bold text-xl">Hi</a>
                        <a className="text-gray-100 font-bold text-xl">Hi</a>
                    </span>
                    <span className="flex space-x-2 items-end">
                        <a className="invisible md:visible text-gray-100">
                            <HiOutlineBell className="text-4xl"/>
                        </a>
                        <a className="text-gray-100 flex items-center">
                            <HiUserCircle className="text-4xl"/>
                            <HiChevronDown className="hidden md:inline"/>
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