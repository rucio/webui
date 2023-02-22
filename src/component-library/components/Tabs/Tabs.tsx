import { useEffect, useState } from "react"

export const Tabs = ({
    tabs = [],
    active,
    alignment,
    size,
    rounded,
    handleClick,
}: TabsProps) => {
    const [activestate, setActivestate] = useState(active)
    useEffect(() => {
        setActivestate(active)
    }, [active])
    var onClick = (event: any) => {
        console.log(event.target.id)
        setActivestate(event.target.id)
        handleClick?.(event)
    }
    return (
        <ul className="flex flex-wrap flex-row list-none">
            {tabs.map((element, index) => {
                return index == activestate ? (
                    <li
                        onClick={onClick}
                        className="flex-auto text-center"
                    >
                        <a
                            id={index.toString()}
                            className="block border-b-2 text-blue-500 border-blue-500 p-4"
                        >
                            {element}
                        </a>
                    </li>
                ) : (
                    <li
                        onClick={onClick}
                        className="flex-auto text-center"
                    >
                        <a
                            id={index.toString()}
                            className="block border-b-2 text-gray-600 border-gray-300 p-4"
                        >
                            {element}
                        </a>
                    </li>
                )
            })}
        </ul>
    )
}
