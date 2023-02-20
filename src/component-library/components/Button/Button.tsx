export const Button = ({
    label,
    icon = null,
    type = "button",
    disabled = false,
    onClick = undefined,
}: ButtonProps) => {
    const handleOnClick = disabled ? undefined : onClick
    var classes: string[] = ["font-bold rounded py-1 px-3"]
    if (!disabled) {
        classes.push("bg-green-600", "hover:bg-green-700", "text-white")
    }
    else {
        classes.push("bg-gray-500", "text-gray-200")
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
