import { ReplicaState } from '@/lib/core/entity/rucio';
import { JSX } from 'react';
import { twMerge } from 'tailwind-merge';

export const ReplicaStateTag: React.FC<JSX.IntrinsicElements['span'] & { state: ReplicaState; tiny?: boolean }> = ({
    state = 'Available',
    tiny = false,
    ...props
}) => {
    const { className, ...otherprops } = props;
    const stateString: Record<string, string> = {
        Available: 'Available',
        Unavailable: 'Unavailable',
        Copying: 'Copying',
        Being_Deleted: 'Being Deleted',
        Bad: 'Bad',
        Temporary_Unavailable: 'Temp. Unavailable',
    };
    const stateTiny: Record<string, string> = {
        Available: 'A',
        Unavailable: 'U',
        Copying: 'C',
        Being_Deleted: 'B',
        Bad: 'D',
        Temporary_Unavailable: 'T',
    }; // Yes, this is the way Rucio does it!
    const giveStyle = (colour: string) => `bg-${colour}-200 dark:bg-${colour}-700`;
    return (
        <span
            className={twMerge(
                state === 'Available'
                    ? 'bg-base-success-200 border-base-success-700 dark:bg-base-success-700 dark:border-base-success-200'
                    : state === 'Unavailable'
                    ? 'bg-base-error-200 border-base-error-700 dark:bg-base-error-700 dark:border-base-error-200'
                    : state === 'Copying'
                    ? 'bg-base-warning-200 border-base-warning-700 dark:bg-base-warning-700 dark:border-base-warning-200'
                    : state === 'Being_Deleted'
                    ? 'bg-neutral-200 border-neutral-700 dark:bg-neutral-700 dark:border-neutral-200'
                    : state === 'Bad'
                    ? 'bg-extra-rose-200 border-extra-rose-700 dark:bg-extra-rose-700 dark:border-extra-rose-200'
                    : 'bg-base-info-200 border-base-info-700 dark:bg-base-info-700 dark:border-base-info-200',
                'text-text-1000 dark:text-text-0 italic font-sans',
                !tiny ? 'w-28 md:w-56 rounded border text-center' : 'w-6 h-6 rounded-full border text-center select-none',
                'flex justify-center items-center',
                className ?? '',
            )}
            {...otherprops}
        >
            {!tiny ? stateString[state] : stateTiny[state]}
        </span>
    );
};
