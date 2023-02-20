import { useState , useEffect } from 'react'

export const Checkbox = ({
    label,
    isChecked = true,
    disabled = true,
    handleChange,
    type
}: CheckboxProps) => {
    const [checked, setChecked] = useState(isChecked)
    useEffect(() => {
        setChecked(isChecked)
    }, [isChecked])
    var inputClasses: string[] = ["w-4 h-4"]
    var labelClasses: string[] = ["ml-2 text-sm font-medium"]
    if (!disabled) {
        labelClasses.push("hover:cursor-pointer")
    }
    else {
        labelClasses.push("text-gray-500")
    }
    return (
        <div
            className="flex items-center mb-4"
            onClick={(event: any) => {
                if (!disabled) {
                    setChecked(event.target.checked)
                    handleChange?.(event)
                }
            }}
        >
            <input
                disabled={disabled}
                type={type}
                checked={checked}
                className={inputClasses.join(" ")}
                onChange= {args => args}
            />
            <label
                className={labelClasses.join(" ")}
            >
                {label}
            </label>
        </div>  
    )
}
