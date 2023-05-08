import { useEffect, useState } from "react"

export const Tabs = (
    props: {
        tabs: string[],
        active: number,
        handleClick: (event: any) => void,
        dataTestid?: string,
    }
) => {
    const [activestate, setActivestate] = useState<string>(props.active.toString())
    useEffect(() => {
        setActivestate(props.active.toString())
    }, [props.active])
    var onClick = (event: any) => {
        setActivestate(event.target.dataset.id)
        props.handleClick(event)
    }
    return (
        <ul
            className="flex flex-col sm:flex-row list-none font-bold"
            data-testid={props.dataTestid ?? "tabs"}
        >
            {props.tabs.map((element, index) => {
                return index === Number(activestate) ? (
                    <li
                        onClick={onClick}
                        className="flex-1 text-center"
                        key={index.toString()}
                    >
                        <a
                            data-id={index.toString()}
                            className="block border-b-4 text-blue-500 border-blue-500 p-4 hover:bg-gray-100 dark:hover:bg-transparent hover:cursor-pointer"
                        >
                            {element}
                        </a>
                    </li>
                ) : (
                    <li
                        onClick={onClick}
                        className="flex-1 text-center"
                        key={index.toString()}
                    >
                        <a
                            data-id={index.toString()}
                            className="block border-b-4 text-gray-600 dark:text-gray-100 border-gray-300 dark:border-gray-100 p-4 hover:bg-gray-100 dark:hover:bg-transparent hover:cursor-pointer"
                        >
                            {element}
                        </a>
                    </li>
                )
            })}
        </ul>
    )
}
