import React, { useEffect, useState, forwardRef, useRef } from 'react'
import { Collapsible } from '../../Helpers/Collapsible'
import { HiChevronDown } from 'react-icons/hi'
import { twMerge } from 'tailwind-merge'
import { DIDTypeTag } from '../../Tags/DIDTypeTag'
import { DIDType } from '@/lib/core/entity/rucio'

export const Dropdown = forwardRef(function Dropdown
    (
        props: {
            handleChange: (args: any) => void,
            id?: string
        },
        outsideref?: React.ForwardedRef<HTMLDivElement>
    ) {

    const options: DIDType[] = Object.values(DIDType)
    const nodes: React.ReactNode[] = [
        <DIDTypeTag didtype='Dataset' neversmall key={0} className="w-full md:w-full" />,
        <DIDTypeTag didtype='Container' neversmall key={1} className="w-full md:w-full" />,
        <DIDTypeTag didtype='Collection' neversmall key={2} className="w-full md:w-full" />,
        <DIDTypeTag didtype='File' neversmall key={3} className="w-full md:w-full" />,
    ]

    const [isActive, setActive] = useState<boolean>(false)
    const [selectedLabel, setSelectedLabel] = useState<DIDType>(DIDType.Dataset)

    const ref = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (!ref.current?.contains(event.target) && !buttonRef.current?.contains(event.target)) {
                setActive(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
    }, [ref])

    return (
        <div className="w-full relative">
            <button
                onClick={() => { setActive(!isActive) }} ref={buttonRef}
                className={twMerge(
                    "py-1 px-3 rounded w-full",
                    "bg-blue-500 hover:bg-blue-600 text-white",
                    "cursor-pointer",
                    "font-bold",
                    "flex justify-center space-x-2"
                )}
            >
                <span>Group Items By</span>
                <DIDTypeTag didtype={selectedLabel} />
                <div className="flex items-center">{<HiChevronDown />}</div>
            </button>
            <Collapsible showIf={isActive}>
                <div className="absolute right-0 mt-2 w-56 rounded border dark:border-2 z-[100]" ref={ref}>
                    <div className="p-1 flex flex-col bg-white dark:bg-gray-700">
                        <ol>
                            {options.map((element: any, index: number) => {
                                return (
                                    <li
                                        key={index}
                                        onClick={() => {
                                            setActive(!isActive);
                                            props.handleChange(element);
                                            setSelectedLabel(element);
                                        }}
                                        className={twMerge(
                                            "p-1 rounded select-none cursor-pointer",
                                            "bg-white hover:bg-gray-200",
                                            "dark:bg-gray-700 hover:dark:bg-gray-900 dark:text-gray-100"
                                        )}
                                    >
                                        {nodes[index]}
                                    </li>
                                )
                            })}
                        </ol>
                    </div>
                </div>
            </Collapsible>
        </div>
    )
})
