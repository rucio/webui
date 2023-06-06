import { SubscriptionState } from "@/lib/core/entity/rucio";
import { twMerge } from "tailwind-merge";

export const SubscriptionStateTag: (
    React.FC<JSX.IntrinsicElements["span"] & { state: SubscriptionState; tiny?: boolean }>
) = (
    {
        state = SubscriptionState.Active,
        tiny = false,
        ...props
    }
) => {
        /*
        Notes on SubscriptionStates and their usage (@dchristidis):
          * BROKEN isn’t used.
          * NEW is tied to the retroactive option, which as far as I know is also not implemented.
          * INACTIVE is when it’s disabled.
          * ACTIVE is when the subscription is first created.
          * UPDATED is when one or more rules have been created.
          * UPDATED is the most common (!)
        The colours assigned to the states were chosen to reflect this:
            * BROKEN is red.
            * UPDATED is green. => This is the most common state.
            * INACTIVE is grey.
            * ACTIVE is blue.
            * NEW is teal. => this colour should not show up. It is very similar to UPDATED.
        Note:
            The design of this tag is very similar to the LockStateTag.
        */
        const { className, ...otherprops } = props
        const stateStrings: {[K in SubscriptionState]: string[]} = {
            [SubscriptionState.Active]: ["Active", "A"],
            [SubscriptionState.Inactive]: ["Inactive", "I"],
            [SubscriptionState.New]: ["New", "N"],
            [SubscriptionState.Updated]: ["Updated", "U"],
            [SubscriptionState.Broken]: ["Broken", "B"]
        }
        return (
            <span
                className={twMerge(
                    state === SubscriptionState.Active ? "bg-blue-300 border-blue-700 dark:bg-blue-700 dark:border-blue-200" : (
                        state === SubscriptionState.Inactive ? "bg-gray-300 border-gray-700 dark:bg-gray-700 dark:border-gray-200" : (
                            state === SubscriptionState.New ? "bg-teal-300 border-teal-700 dark:bg-teal-700 dark:border-teal-200" : (
                                state === SubscriptionState.Updated ? "bg-green-300 border-green-700 dark:bg-green-700 dark:border-green-200" :
                                    "bg-red-300 border-red-700 dark:bg-red-700 dark:border-red-200" // broken

                            )
                        )
                    ),
                    "text-black dark:text-white",
                    !tiny ? "w-24 rounded border text-center" : "w-6 h-6 rounded-full border text-center select-none shrink-0",
                    "flex justify-center items-center",
                    className ?? "",
                )}
                {...otherprops}
            >
                {!tiny ? stateStrings[state][0] : stateStrings[state][1]}
            </span>
        );
    };
