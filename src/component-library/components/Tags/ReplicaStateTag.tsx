import { ReplicaState } from "@/lib/core/entity/rucio";
import { twMerge } from "tailwind-merge";

export const ReplicaStateTag: React.FC<JSX.IntrinsicElements["span"] & {state: ReplicaState, tiny?: boolean}> = (
    {
        state = "Available",
        tiny = false,
        ...props
    }
) => {
    const { className, ...otherprops } = props
    const stateString: Record<string, string> = {
        "Available": "Available",
        "Unavailable": "Unavailable",
        "Copying": "Copying",
        "Being_Deleted": "Being Deleted",
        "Bad": "Bad",
        "Temporary_Unavailable": "Temp. Unavailable"
    }
    const stateTiny: Record<string, string> = {
        "Available": "A",
        "Unavailable": "U",
        "Copying": "C",
        "Being_Deleted": "B",
        "Bad": "D",
        "Temporary_Unavailable": "T"
    } // Yes, this is the way Rucio does it!
    const giveStyle = (colour: string) => `bg-${colour}-200 dark:bg-${colour}-700`
    return (
        <span
            className={twMerge(
                state === "Available" ? "bg-green-200 border-green-700 dark:bg-green-700 dark:border-green-200" : (
                    state === "Unavailable" ? "bg-red-200 border-red-700 dark:bg-red-700 dark:border-red-200" : (
                        state === "Copying" ? "bg-amber-200 border-amber-700 dark:bg-amber-700 dark:border-amber-200" : (
                            state === "Being_Deleted" ? "bg-gray-200 border-gray-700 dark:bg-gray-700 dark:border-gray-200" : (
                                state === "Bad" ? "bg-pink-200 border-pink-700 dark:bg-pink-700 dark:border-pink-200" : (
                                    "bg-blue-200 border-blue-700 dark:bg-blue-700 dark:border-blue-200"
                                )
                            )
                        )
                    )
                ),
                "text-black dark:text-white italic font-sans",
                !tiny ? "w-28 md:w-56 rounded border text-center" : "w-6 h-6 rounded-full border text-center select-none",
                "flex justify-center items-center",
                className ?? "",
            )}
            {...otherprops}
        >
            {!tiny ? stateString[state] : stateTiny[state]}
        </span>
    )
}