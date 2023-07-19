import { twMerge } from "tailwind-merge";
import { HiChevronDown } from "react-icons/hi";
import { useState, useEffect, useRef } from "react";

type DropdownProps<T> = JSX.IntrinsicElements["div"] & {
    keys: T[],
    renderFunc: (key: T | undefined) => JSX.Element,
    handleChange: (key: T | undefined) => void, // communicate back to parent
    value?: T | undefined // the current value, set by the parent
    disableUndefined?: boolean // if the selection may not be left undefined
}

export function Dropdown<T>(
    props: DropdownProps<T>
): JSX.Element {
    const [isActive, setActive] = useState<boolean>(false)
    const [selection, setSelection] = useState<T | undefined>(props.value ?? undefined)
    const divref = useRef<HTMLDivElement>(null)
    const buttonref = useRef<HTMLButtonElement>(null)
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (!divref.current?.contains(event.target) && !buttonref.current?.contains(event.target)) {
                setActive(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
    }, [divref, buttonref])

    // remove undefined to the list of keys if it is disabled
    const keys = props.disableUndefined ? props.keys : [undefined as undefined | T].concat(props.keys)

    // update parent of changes
    useEffect(() => {
        props.handleChange(selection)
    }, [selection, props])

    return (
        <div className="w-full relative">
            <button
                ref={buttonref}
                onClick={e => { e.preventDefault(); setActive(!isActive) }}
                className={twMerge(
                    "py-1 px-3 rounded w-full",
                    "bg-blue-500 hover:bg-blue-600 text-white",
                    "cursor-pointer",
                    "font-bold",
                    "flex justify-center space-x-2"
                )}
            >
                {props.renderFunc(selection)}
                <span className="text-2xl"><HiChevronDown /></span>
            </button>
            <div
                ref={divref}
                className={twMerge(
                    isActive ? "flex" : "hidden",
                    "absolute right-0 mt-1 w-full rounded border dark:border-2 z-[100]",
                    "p-1 flex-col bg-white dark:bg-gray-700"
                )}
            >
                {keys.map((key, index) => {
                    return (
                        <div
                            key={index}
                            className={twMerge(
                                "p-1 rounded select-none cursor-pointer",
                                "bg-white odd:bg-stone-100", // bg normal
                                "dark:bg-gray-700 dark:odd:bg-gray-800", // bg dark
                                "hover:bg-gray-200 dark:hover:bg-gray-900", // hover (dark and light)
                            )}
                            onClick={e => {
                                setActive(!isActive)
                                setSelection(key)
                            }}
                        >
                            {props.renderFunc(key)}
                        </div>
                    )
                })}
            </div>
        </div>
    );
};
