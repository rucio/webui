import React, { useState, useEffect } from "react";
export const AreaInput = (
    props: {
        content?: string,
        placeholder?: string,
        onBlur?: (event: any) => void,
        onChange?: (event: any) => void,
        onEnterkey?: (event: any) => void,
        id?: string,
        rows?: number,
    }
) => {
    const [content, setContent] = useState<string>(props.content ?? "")
    useEffect(() => {
        setContent(props.content ?? "")
    }, [props.content])
    return (
        <textarea
            id={props.id}
            value={props.content}
            rows={props.rows}
            placeholder={props.placeholder}
            className="block w-full font-mono border dark:border-white rounded-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 dark:bg-gray-800 dark:text-white dark:border-2"
            onBlur={props.onBlur}
            onChange={props.onChange}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    props.onEnterkey?.(e)
                }
            }}
        />
    )
}