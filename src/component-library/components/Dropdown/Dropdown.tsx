import React, { useEffect, useState, forwardRef, useRef } from 'react'
import { Button } from '../Button/Button'
import { Collapsible } from '../Helpers/Collapsible'

export const Dropdown = forwardRef(function Dropdown
    (
        props: {
            label: string,
            options: Array<string>,
            handleChange: (args: any) => void,
            id?: string
        },
        outsideref?: React.ForwardedRef<HTMLDivElement>
    ) {
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

    let icon = () => {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                />
            </svg>
        )
    }
    return (
        <div className="w-full relative">
            <Button label={selectedLabel} onClick={() => { setActive(!isActive) }} icon={icon()} ref={buttonRef}/>
            <Collapsible showIf={isActive}>
                <div className="absolute right-0 mt-2 w-56 rounded border z-[100]" ref={ref}>
                    <div className="p-2 flex flex-col bg-white">
                        <ol>
                            {props.options.map((element: any, index: number) => {
                                return (
                                    <li
                                        key={index}
                                        onClick={() => {
                                            setActive(!isActive);
                                            props.handleChange(element);
                                            setSelectedLabel(element);
                                        }}
                                        className="hover:bg-gray-200"
                                    >
                                        {element}
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
