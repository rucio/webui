import { useState, useEffect } from 'react'

interface CheckboxProps {
    label: string
    isChecked?: boolean
    disabled?: boolean
    handleChange?: (args: any) => void
    type: "checkbox" | "radio"
    id?: string
}

export const Checkbox = ({
    label,
    isChecked = true,
    disabled = false,
    handleChange,
    type,
    id,
}: CheckboxProps) => {
    const [checked, setChecked] = useState(isChecked)
    useEffect(() => {
        setChecked(isChecked)
    }, [isChecked])
    var inputClasses: string[] = ["w-4 h-4 hover:cursor-pointer"]
    var labelClasses: string[] = ["ml-2"]
    if (!disabled) {
        labelClasses.push("dark:text-white")
    }
    else {
        labelClasses.push("text-gray-500", "dark:text-gray-300")
    }
    return (
        <div
            className="flex items-center"
        >
            <input
                disabled={disabled}
                type={type}
                checked={checked}
                className={inputClasses.join(" ")}
                onChange={(event: any) => {
                    setChecked(event.target.checked)
                    handleChange?.(event)
                }}
                id={id}
            />
            <label
                className={labelClasses.join(" ")}
                htmlFor={id}
            >
                {label}
            </label>
        </div>
    )
}
