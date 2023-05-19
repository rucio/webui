import { RuleNotification } from "@/lib/core/entity/rucio";
import { twMerge } from "tailwind-merge";
import { HiBell } from "react-icons/hi";

export const RuleNotificationTag: (
    React.FC<JSX.IntrinsicElements["span"] & { notificationState: RuleNotification; tiny?: boolean }>
) = (
    {
        notificationState = RuleNotification.Yes,
        tiny = false,
        ...props
    }
) => {
        const { className, ...otherprops } = props
        const stateString: Record<string, string> = {
            "Y": "Yes",
            "N": "No",
            "C": "Close",
            "P": "Progress",
        }
        return (
            <span
                className={twMerge(
                    notificationState === RuleNotification.No? "bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200" : (
                        notificationState === RuleNotification.Close? "bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200" : (
                            notificationState === RuleNotification.Yes? "bg-green-300 text-green-800 dark:bg-green-700 dark:text-green-200" : (
                                notificationState === RuleNotification.Progress ? "bg-blue-300 text-blue-800 dark:bg-blue-700 dark:text-blue-200" :
                                    ""
                            )
                        )
                    ),
                    "font-sans",
                    !tiny ? "w-28 rounded" : "w-6 h-6 rounded-full text-center select-none shrink-0",
                    "flex flex-row justify-center items-center",
                    className ?? "",
                )}
                {...otherprops}
            >
                <HiBell className={tiny ? "hidden" : "mr-1"}/>
                {!tiny ? stateString[notificationState] : notificationState}
            </span>
        );
    };
