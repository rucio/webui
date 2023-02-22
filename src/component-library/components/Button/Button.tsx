export const Button = ({
    label,
    icon = null,
    type = "button",
    disabled = false,
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
                classes.push("bg-blue-500", "hover:bg-blue-600", "text-white")
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
            {icon}
            &nbsp;
            {label}
        </button>
    )
}
