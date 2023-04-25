import { Collapsible } from "../Helpers/Collapsible"

interface ButtonProps {
}

export const Button = (
    props: {
        label?: string
        icon?: any
        type?: 'button' | 'submit' | 'reset'
        disabled?: boolean
        theme?: 'blue' | 'orange',
        fullwidth?: boolean
        onClick?: (args: unknown) => void
        id?: string
    }
) => {
    const type = props.type ?? "button"
    const theme = props.theme ?? "blue"
    const fullwidth = props.fullwidth ?? true

    const handleOnClick = props.disabled ? undefined : props.onClick
    var classes: string[] = ["font-bold rounded py-1 px-3 cursor-pointer"]
    if (!props.disabled) {
        switch (type) {
            case "submit":
                classes.push("bg-green-500", "hover:bg-green-600", "text-white")
                break
            case "reset":
                classes.push("bg-red-500", "hover:bg-red-600", "text-white")
                break
            case "button":
                if (theme === "blue") {
                    classes.push("bg-blue-500", "hover:bg-blue-600", "text-white")
                } else if (theme === "orange") {
                    classes.push("bg-amber-500", "hover:bg-amber-600", "text-black")
                }
                break
        }
    }
    else {
        classes.push("bg-gray-500", "text-gray-200")
    }
    if (fullwidth) {
        classes.push("w-full")
    }
    if (!!props.label) {
        return (
            <button
                type={type}
                disabled={props.disabled}
                className={classes.join(" ")}
                onClick={handleOnClick}
                id={props.id}
            >
                <div className="flex justify-center cursor-pointer">
                    <label htmlFor={props.id} className="cursor-pointer">
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
                className={classes.join(" ")}
                onClick={handleOnClick}
                id={props.id}
            >
                <label htmlFor={props.id} className="flex justify-center cursor-pointer">
                    {props.icon}
                </label>
            </button>
        )
    }
}
