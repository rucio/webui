import { ReplicaState } from "@/lib/core/entity/rucio";
import { twMerge } from "tailwind-merge";

export const ReplicaStateTag: React.FC<JSX.IntrinsicElements["span"] & {state: ReplicaState}> = (
    {
        state = "Available",
        ...props
    }
) => {
    const { className, ...otherprops } = props
    const stateString: Record<ReplicaState, string> = {
        "Available": "Available",
        "Unavailable": "Unavailable",
        "Copying": "Copying",
        "Being_Deleted": "Being Deleted",
        "Bad": "Bad",
        "Temporary_Unavailable": "Temp. Unavailable"
    }
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
                "w-44 rounded border text-center",
                "flex justify-center items-center",
                className ?? "",
            )}
            {...otherprops}
        >
            {stateString[state]}
        </span>
    )
}