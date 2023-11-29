import { LockState } from "@/lib/core/entity/rucio";
import { twMerge } from "tailwind-merge";

export const LockStateTag: (
    React.FC<JSX.IntrinsicElements["span"] & { lockState: LockState; tiny?: boolean }>
) = (
    {
        lockState = "OK",
        tiny = false,
        ...props

    }
) => {
        const { className, ...otherprops } = props
        const stateString: Record<string, string> = {
            "R": "Replicating",
            "O": "OK",
            "S": "Stuck",
        }

        return (
            <span
                className={twMerge(
                    lockState === LockState.OK ? "bg-green-300 border-green-700 dark:bg-green-700 dark:border-green-200" : (
                        lockState === LockState.STUCK ? "bg-amber-300 border-amber-700 dark:bg-amber-700 dark:border-amber-200" : (
                            lockState === LockState.REPLICATING ? "bg-red-400 border-red-700 dark:bg-red-700 dark:border-red-200" : 
                                ""
                        )
                    ),
                    "text-black dark:text-white font-sans",
                    !tiny ? "w-28 rounded border text-center" : "w-6 h-6 rounded-full border text-center select-none shrink-0",
                    "flex justify-center items-center",
                    className ?? "",
                )}
                {...otherprops}
            >
                {!tiny ? stateString[lockState] : lockState}
            </span>
        );
    };
