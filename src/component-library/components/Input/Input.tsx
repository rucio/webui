interface TextInputProps {
    // kind?: 'primary' | 'info' | 'link' | 'normal'
    disabled?: boolean
    focusByDefault?: boolean
    inline?: boolean
    label?: string
    onChange?: (args: any) => void
    placeholder?: string
    show?: "error" | "success" | "standard"
    password?: boolean
}

export const Input = ({
    disabled = false,
    focusByDefault = false,
    inline = false,
    label = "",
    onChange,
    password = false,
    placeholder = "",
    show,
}: TextInputProps) => {
    var divClasses: string[] = ["w-full"]
    var labelClasses: string[] = ["dark:text-white"]
    var inputClasses: string[] = ["border", "rounded"]

    // Handle inline or block
    if (!inline) {
        divClasses.push("block")
        labelClasses.push("block")
        inputClasses.push("block", "w-full", "p-2", "-mt-4")
    }
    else {
        divClasses.push("grid", "grid-cols-3", "gap-2", "p-1")
        labelClasses.push("col-span-1", "text-right", "self-center")
        inputClasses.push("col-span-2", "p-1")
    }

    // Handle show (only if not disabled)
    if(!disabled) {
        switch(show) {
            case "error":
                inputClasses.push("border-red-500", "bg-red-100")
                break
            case "success":
                inputClasses.push("border-green-500", "bg-green-100")
                break
            default:
                inputClasses.push("border-gray-300", "bg-gray-50")
                break
        }
    }

    return (
        <div
            className={divClasses.join(" ")}
        >
            <label
                className={labelClasses.join(" ")}
            >
                {label}
            </label>
            <input
                className={inputClasses.join(" ")}
                onChange={onChange}
                placeholder={placeholder}
                autoFocus={focusByDefault}
                disabled={disabled}
                type={password ? "password" : "text"}
            >
            </input>
        </div>
    )
}
