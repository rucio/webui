interface ButtonProps {
    label: string
    icon?: any
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    theme?: 'blue' | 'orange',
    fullwidth?: boolean
    onClick?: (args: unknown) => void
}

export const Button = ({
    label,
    icon = null,
    type = "button",
    disabled = false,
    theme = "blue",
    fullwidth = true,
    onClick = undefined,
}: ButtonProps) => {
    const handleOnClick = disabled ? undefined : onClick
    var classes: string[] = ["font-bold rounded py-1 px-3"]
    if (!disabled) {
        switch(type) {
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
    if(fullwidth) {
        classes.push("w-full")
    }
    return (
        
        <button
            type = {type}
            disabled = {disabled}
            className = {classes.join(" ")}
            onClick = {handleOnClick}
        >
            <div className="flex justify-center">
                <div>{label}</div>
                &nbsp;
                <div className="flex items-center">{icon}</div>
            </div>
        </button>
    )
}
