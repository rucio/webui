import React from 'react';
import { SubscriptionState } from '@/lib/core/entity/rucio';
import { twMerge } from 'tailwind-merge';

export const SubscriptionStateTag: React.FC<React.ComponentPropsWithoutRef<'span'> & { state: SubscriptionState; tiny?: boolean }> = ({
    state = SubscriptionState.ACTIVE,
    tiny = false,
    ...props
}) => {
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
    const { className, ...otherprops } = props;
    const stateStrings: { [K in SubscriptionState]: string[] } = {
        [SubscriptionState.ACTIVE]: ['Active', 'A'],
        [SubscriptionState.INACTIVE]: ['Inactive', 'I'],
        [SubscriptionState.NEW]: ['New', 'N'],
        [SubscriptionState.UPDATED]: ['Updated', 'U'],
        [SubscriptionState.BROKEN]: ['Broken', 'B'],
        [SubscriptionState.UNKNOWN]: ['Unknown', '?'],
    };
    return (
        <span
            className={twMerge(
                state === SubscriptionState.ACTIVE
                    ? 'bg-brand-300 border-brand-700 dark:bg-brand-700 dark:border-brand-200'
                    : state === SubscriptionState.INACTIVE
                    ? 'bg-neutral-300 border-neutral-700 dark:bg-neutral-700 dark:border-neutral-200'
                    : state === SubscriptionState.NEW
                    ? 'bg-base-info-300 border-base-info-700 dark:bg-base-info-700 dark:border-base-info-200'
                    : state === SubscriptionState.UPDATED
                    ? 'bg-base-success-300 border-base-success-700 dark:bg-base-success-700 dark:border-base-success-200'
                    : 'bg-base-error-300 border-base-error-700 dark:bg-base-error-700 dark:border-base-error-200', // broken
                'text-text-1000 dark:text-text-0',
                !tiny ? 'w-24 rounded border text-center' : 'w-6 h-6 rounded-full border text-center select-none shrink-0',
                'flex justify-center items-center',
                className ?? '',
            )}
            {...otherprops}
        >
            {!tiny ? stateStrings[state][0] : stateStrings[state][1]}
        </span>
    );
};
