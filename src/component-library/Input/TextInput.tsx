import { twMerge } from "tailwind-merge"

type TextInputProps = JSX.IntrinsicElements["input"] & {
    onEnterkey?: (event: any) => void,
}

export const TextInput: (
    React.FC<TextInputProps>
) = (
    {
        onEnterkey,
        ...props
    }
) => {
    const { className, children, onKeyDown, ...otherprops } = props
    return (
        <input
            className={twMerge(
                "w-full h-8 px-2 pt-2 ",
                "dark:border-gray-400 dark:bg-gray-800 dark:text-white ",
                "border rounded-sm",
                "dark:border-2 dark:border-white",
                props.className ?? ""
            )}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    onEnterkey?.(e)
                }
                onKeyDown?.(e)
            }}
            {...otherprops}
        >
            {children}
        </input>
    )
}