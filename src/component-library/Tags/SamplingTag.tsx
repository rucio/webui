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
                "bg-brand-300 dark:bg-brand-600",
                "text-text-1000 dark:text-text-0 font-bold",
                "w-6 md:w-24 rounded text-center select-none",
                "flex justify-center items-center",
                !sampling ? "hidden" : "flex"
            )}
        >
            Sampling
        </span>
    )
}