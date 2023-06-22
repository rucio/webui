import { twMerge } from "tailwind-merge";

export const ProgressBar: React.FC<JSX.IntrinsicElements["div"] & {
    percentage: number
    colour?: string
}> = (
    {
        percentage,
        colour,
        ...props
    }
) => {
    const { className, ...otherprops } = props
    return (
        <div
            className={twMerge(
                "rounded-full h-2.5 w-full",
                "dark:bg-gray-700 bg-gray-200"
            )}
        >
            <div
                className={twMerge(
                    colour ?? "bg-blue-600 dark:bg-blue-500",
                    "h-2.5 rounded-full"
                )}
                style={{width: `${percentage}%`}}
            />
        </div>
    );
};
