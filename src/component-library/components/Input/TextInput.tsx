import { twMerge } from "tailwind-merge"

export const TextInput = (
    props: {
        children?: any,
        placeholder?: string,
        onBlur?: (event: any) => void,
        onChange?: (event: any) => void,
        onEnterkey?: (event: any) => void,
        id?: string,
        className?: string
    },
) => {
    return (
        <input
            id={props.id}
            placeholder={props.placeholder}
            className={twMerge(
                "w-full border dark:border-gray-400 rounded-sm px-2 pt-2 dark:bg-gray-800 dark:text-white",
                props.className ?? ""
            )}
            onBlur={props.onBlur}
            onChange={props.onChange}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    props.onEnterkey?.(e)
                }
            }}
        >
            {props.children}
        </input>
    )
}