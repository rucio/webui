import { twMerge } from "tailwind-merge"
import { Collapsible } from "../Helpers/Collapsible"
import { forwardRef } from "react"

interface ButtonProps {
}

export const Button = forwardRef(function Button
    (
        props: {
            label?: string
            icon?: any
            type?: 'button' | 'submit' | 'reset'
            disabled?: boolean
            theme?: 'blue' | 'orange',
            fullwidth?: boolean
            onClick?: (args: unknown) => void
            id?: string
        },
        ref?: React.ForwardedRef<HTMLButtonElement>
    ) {
    const type = props.type ?? "button"
    const theme = props.theme ?? "blue"
    const fullwidth = props.fullwidth ?? true

    const handleOnClick = props.disabled ? undefined : props.onClick
    var classes: string[] = ["font-bold rounded py-1 px-3 cursor-pointer"]
    if (!!props.label) {
        return (
            <button
                type={type}
                disabled={props.disabled}
                className={twMerge(
                    "py-1 px-3 rounded",
                    type === "submit" ? "bg-green-500 hover:bg-green-600 text-white" : "",
                    type === "reset" ? "bg-red-500 hover:bg-red-600 text-white" : "",
                    type === "button" ? "bg-blue-500 hover:bg-blue-600 text-white" : "",
                    theme === "orange" ? "bg-amber-500 hover:bg-amber-600 text-black" : "",
                    props.disabled ? "cursor-not-allowed bg-gray-500 hover:bg-gray-500 text-gray-200" : "cursor-pointer",
                    fullwidth ? "w-full" : "",
                    "font-bold",
                )}
                onClick={handleOnClick}
                id={props.id}
                ref={ref}
            >
                <div className={twMerge(
                    "flex justify-center",
                    props.disabled ? "cursor-not-allowed" : "cursor-pointer"
                )}
                >
                    <label htmlFor={props.id} className={twMerge(
                        props.disabled ? "cursor-not-allowed" : "cursor-pointer"
                    )}>
                        {props.label}
                    </label>
                    {props.icon ? "\u00A0" : "" /* nonbreaking space */}
                    <div className="flex items-center">{props.icon}</div>
                </div>
            </button>
        )
    }
    else {
        return (
            <button
                type={type}
                disabled={props.disabled}
                className={twMerge(
                    "py-1 px-3 rounded",
                    type === "submit" ? "bg-green-500 hover:bg-green-600 text-white" : "",
                    type === "reset" ? "bg-red-500 hover:bg-red-600 text-white" : "",
                    type === "button" ? "bg-blue-500 hover:bg-blue-600 text-white" : "",
                    theme === "orange" ? "bg-amber-500 hover:bg-amber-600 text-black" : "",
                    props.disabled ? "cursor-not-allowed bg-gray-500 hover:bg-gray-500 text-gray-200" : "cursor-pointer",
                    fullwidth ? "w-full" : "",
                    "font-bold",
                )}
                onClick={handleOnClick}
                id={props.id}
                ref={ref}
            >
                <label htmlFor={props.id} className="flex justify-center cursor-pointer">
                    {props.icon}
                </label>
            </button>
        )
    }
})
