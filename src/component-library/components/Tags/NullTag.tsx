import { twMerge } from "tailwind-merge";

export const NullTag: React.FC<JSX.IntrinsicElements["span"]> = (
    {
        ...props
    }
) => {
    const { className, ...otherprops } = props
    return (
        <span
            className={twMerge(
                "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400",
                "border-0 dark:border border-gray-400",
                "h-6 rounded flex justify-center items-center w-16",
                className ?? "",
            )}
            {...otherprops}
        >
            null
        </span>
    )
}