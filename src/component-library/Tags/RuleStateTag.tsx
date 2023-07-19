import { RuleState } from "@/lib/core/entity/rucio";
import { twMerge } from "tailwind-merge";

export const RuleStateTag: (
    React.FC<JSX.IntrinsicElements["span"] & { state: RuleState; tiny?: boolean }>
) = (
    {
        state = "OK",
        tiny = false,
        ...props
    }
) => {
        const { className, ...otherprops } = props
        const stateString: Record<string, string> = {
            "Replicating": "Replicating",
            "OK": "OK",
            "Stuck": "Stuck",
            "Suspended": "Suspended",
            "Waiting_Approval": "Waiting Approval",
            "Inject": "Inject"
        }
        const stateTiny: Record<string, string> = {
            "Replicating": "R",
            "OK": "O",
            "Stuck": "S",
            "Suspended": "U",
            "Waiting_Approval": "W",
            "Inject": "I"
        } // Yes, this is the way Rucio does it!
        return (
            <span
                className={twMerge(
                    state === "OK" ? "bg-green-300 border-green-700 dark:bg-green-700 dark:border-green-200" : ( state === "Stuck" ? "bg-red-400 border-red-700 dark:bg-red-700 dark:border-red-200" : (
                            state === "Replicating" ? "bg-amber-300 border-amber-700 dark:bg-amber-700 dark:border-amber-200" : (
                                state === "Suspended" ? "bg-gray-300 border-gray-700 dark:bg-gray-700 dark:border-gray-200" : (
                                    state === "Waiting_Approval" ? "bg-pink-300 border-pink-700 dark:bg-pink-700 dark:border-pink-200" : (
                                        "bg-blue-300 border-blue-700 dark:bg-blue-700 dark:border-blue-200"
                                    )
                                )
                            )
                        )
                    ),
                    "text-black dark:text-white underline font-sans",
                    !tiny ? "w-28 md:w-44 rounded border text-center" : "w-6 h-6 rounded-full border text-center select-none shrink-0",
                    "flex justify-center items-center",
                    className ?? "",
                )}
                {...otherprops}
            >
                {!tiny ? stateString[state] : stateTiny[state]}
            </span>
        )
    }
