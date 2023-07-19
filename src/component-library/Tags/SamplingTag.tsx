import { twMerge } from "tailwind-merge"

export const SamplingTag: React.FC<JSX.IntrinsicElements["span"] & { sampling: boolean }> = (
    {
        sampling = false,
        ...props
    }
) => {
    return (
        <span
            className={twMerge(
                "bg-teal-300 dark:bg-teal-600",
                "text-black dark:text-white font-bold",
                "w-6 md:w-24 rounded text-center select-none",
                "flex justify-center items-center",
                !sampling ? "hidden" : "flex"
            )}
        >
            Sampling
        </span>
    )
}