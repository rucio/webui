import { twMerge } from "tailwind-merge"
import { DIDAvailability } from "@/lib/core/entity/rucio"

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
                availability === DIDAvailability.AVAILABLE ? "bg-green-200 dark:bg-green-700" : (
                    availability === DIDAvailability.DELETED ? "bg-stone-200 dark:bg-stone-700" : (
                        "bg-purple-200 dark:bg-purple-700" // Lost
                    )
                ),
                "text-black dark:text-white italic",
                "w-24 h-6 rounded text-center select-none",
                "flex flex-row justify-center items-center",
            )}
        >
            {availability}
        </span>
    )
}