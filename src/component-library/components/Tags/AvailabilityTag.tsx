import { twMerge } from "tailwind-merge"
import { DIDAvailability } from "@/lib/core/data/rucio-dto"

export const AvailabilityTag: (
    React.FC<JSX.IntrinsicElements["span"] & { availability: DIDAvailability }>
) = (
    {
        availability = "Available",
        ...props
    }
) => {
    return (
        <span
            className={twMerge(
                availability === "Available" ? "bg-green-200 dark:bg-green-700" : (
                    availability === "Deleted" ? "bg-stone-200 dark:bg-stone-700" : (
                        "bg-purple-200 dark:bg-purple-700"
                    )
                ),
                "text-black dark:text-white italic",
                "w-6 md:w-24 rounded text-center select-none",
                "flex justify-center items-center",
            )}
        >
            {availability}
        </span>
    )
}