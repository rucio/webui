import React, { useEffect, useState, forwardRef, useRef } from 'react'
import { Button } from '../Button/Button'
import { Collapsible } from '../Helpers/Collapsible'
import { HiChevronDown } from 'react-icons/hi'
import { twMerge } from 'tailwind-merge'

export const Dropdown = forwardRef(function Dropdown
    (
        props: {
            label: string,
            options: Array<string>,
            handleChange: (args: any) => void,
            id?: string
            nodes?: Array<React.ReactNode>
        },
        outsideref?: React.ForwardedRef<HTMLDivElement>
    ) {

    const zippedElements = () => {
        if (!!props.nodes) {
            return props.options.map((element: any, index: number) => [element, props.nodes?.[index]])
        } else {
            return props.options.map((element: any, index: number) => [element, element])
        }
    }

    const [isActive, setActive] = useState<boolean>(false)
    const [selectedLabel, setSelectedLabel] = useState<string>(props.label)

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
            <Button label={selectedLabel} onClick={() => { setActive(!isActive) }} icon={<HiChevronDown />} ref={buttonRef} />
            <Collapsible showIf={isActive}>
                <div className="absolute right-0 mt-2 w-56 rounded border dark:border-2 z-[100]" ref={ref}>
                    <div className="p-1 flex flex-col bg-white dark:bg-gray-700">
                        <ol>
                            {zippedElements().map((element: any, index: number) => {
                                return (
                                    <li
                                        key={index}
                                        onClick={() => {
                                            setActive(!isActive);
                                            props.handleChange(element[0]);
                                            setSelectedLabel(element[0]);
                                        }}
                                        className={twMerge(
                                            "py-1 pt-1 rounded select-none cursor-pointer",
                                            "bg-white hover:bg-gray-200",
                                            "dark:bg-gray-700 hover:dark:bg-gray-900 dark:text-gray-100"
                                        )}
                                    >
                                        {element[1]}
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
