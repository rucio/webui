import { useState, useEffect } from "react";

export const NumInput = (
    props: {
        value: number,
        children?: any,
        placeholder?: string,
        onBlur?: (event: any) => void,
        onChange?: (event: any) => void,
        onEnterkey?: (event: any) => void,
        max?: number,
        min?: number,
        id?: string,
        disabled?: boolean
    }
) => {
    const [numvalue, setNumvalue] = useState<number>(props.value);
    useEffect(() => {
        setNumvalue(props.value);
    }, [props.value]);
    const onBlur = (event: any) => {
        setNumvalue(event.target.value);
        props.onBlur?.(event);
    }
    const onChange = (event: any) => {
        setNumvalue(event.target.value);
        props.onChange?.(event);
    }
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
            placeholder={props.placeholder}
            max={props.max ? props.max.toString() : ""}
            min={props.min ? props.min.toString() : ""}
            id={props.id}
            className="w-full border rounded-sm px-2 pt-2 dark:bg-gray-800 dark:text-white dark:border-2"
            onBlur={onBlur}
            onChange={onChange}
            onKeyDown={onEnterkey}
            disabled={props.disabled}
        >
            {props.children}
        </input>
    )
}