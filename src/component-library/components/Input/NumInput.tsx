import { useState, useEffect } from "react";

export const NumInput: (
    React.FC<
        Omit<JSX.IntrinsicElements["input"], "value"> &
        {value: number, onEnterkey?: (event: any) => void}
    >
) = (
    {
        value,
        ...props
    }
) => {
    const [numvalue, setNumvalue] = useState<number>(value);
    useEffect(() => {
        setNumvalue(value);
    }, [value]);
    const onEnterkey = (event: any) => {
        setNumvalue(event.target.value);
        if (event.key === "Enter") {
            props.onEnterkey?.(event) // might need to pass actual value in here too, to bypass he rerender
        }
    }
    return (
        <input
            type="number"
            value={numvalue > 0 ? numvalue : ""}
            className="w-full border dark:border-gray-400 rounded-sm px-2 pt-2 dark:bg-gray-800 dark:text-white dark:border-2"
            onKeyDown={onEnterkey}
            {...props}
        >
            {props.children}
        </input>
    )
}