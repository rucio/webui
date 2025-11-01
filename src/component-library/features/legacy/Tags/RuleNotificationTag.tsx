import React from 'react';
import { RuleNotification } from '@/lib/core/entity/rucio';
import { twMerge } from 'tailwind-merge';
import { HiBellAlert, HiBellSlash, HiBell } from 'react-icons/hi2'; // hi does not have the bell decorations

export const RuleNotificationTag: React.FC<React.ComponentPropsWithoutRef<'span'> & { notificationState: RuleNotification; tiny?: boolean }> = ({
    notificationState = RuleNotification.Yes,
    tiny = false,
    ...props
}) => {
    const { className, ...otherprops } = props;
    const stateString: Record<string, string> = {
        Y: 'Yes',
        N: 'No',
        C: 'Close',
        P: 'Progress',
    };
    return (
        <span
            className={twMerge(
                notificationState === RuleNotification.No
                    ? 'bg-neutral-300 text-neutral-800 dark:bg-neutral-600 dark:text-neutral-200'
                    : notificationState === RuleNotification.Close
                    ? 'bg-neutral-300 text-neutral-800 dark:bg-neutral-600 dark:text-teext-200'
                    : notificationState === RuleNotification.Yes
                    ? 'bg-base-success-300 text-base-success-800 dark:bg-base-success-700 dark:text-base-success-200'
                    : notificationState === RuleNotification.Progress
                    ? 'bg-brand-300 text-brand-800 dark:bg-brand-700 dark:text-brand-200'
                    : '',
                'font-sans',
                !tiny ? 'w-28 rounded' : 'w-6 h-6 rounded-full text-center select-none shrink-0',
                'flex flex-row justify-center items-center',
                className ?? '',
            )}
            {...otherprops}
        >
            {notificationState === RuleNotification.No ? (
                <HiBellSlash className={tiny ? 'hidden' : 'mr-1'} />
            ) : notificationState === RuleNotification.Progress ? (
                <HiBellAlert className={tiny ? 'hidden' : 'mr-1'} />
            ) : (
                <HiBell className={tiny ? 'hidden' : 'mr-1'} />
            )}
            {!tiny ? stateString[notificationState] : notificationState}
        </span>
    );
};
