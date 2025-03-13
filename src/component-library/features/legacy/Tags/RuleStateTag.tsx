import { RuleState } from '@/lib/core/entity/rucio';
import { JSX } from 'react';
import { twMerge } from 'tailwind-merge';

export const RuleStateTag: React.FC<JSX.IntrinsicElements['span'] & { state: RuleState; tiny?: boolean }> = ({
    state = 'OK',
    tiny = false,
    ...props
}) => {
    const { className, ...otherprops } = props;
    const stateString: Record<string, string> = {
        Replicating: 'Replicating',
        OK: 'OK',
        Stuck: 'Stuck',
        Suspended: 'Suspended',
        Waiting_Approval: 'Waiting Approval',
        Inject: 'Inject',
    };
    const stateTiny: Record<string, string> = {
        Replicating: 'R',
        OK: 'O',
        Stuck: 'S',
        Suspended: 'U',
        Waiting_Approval: 'W',
        Inject: 'I',
    }; // Yes, this is the way Rucio does it!
    return (
        <span
            className={twMerge(
                state === 'OK'
                    ? 'bg-base-success-300 border-base-success-700 dark:bg-base-success-700 dark:border-base-success-200'
                    : state === 'Stuck'
                    ? 'bg-base-error-400 border-base-error-700 dark:bg-base-error-700 dark:border-base-error-200'
                    : state === 'Replicating'
                    ? 'bg-base-warning-300 border-base-warning-700 dark:bg-base-warning-700 dark:border-base-warning-200'
                    : state === 'Suspended'
                    ? 'bg-neutral-300 border-neutral-700 dark:bg-neutral-700 dark:border-neutral-200'
                    : state === 'Waiting_Approval'
                    ? 'bg-extra-indigo-300 border-extra-indigo-700 dark:bg-extra-indigo-700 dark:border-extra-indigo-200'
                    : 'bg-base-info-300 border-base-info-700 dark:bg-base-info-700 dark:border-base-info-200',
                'text-text-1000 dark:text-text-0 underline font-sans',
                !tiny ? 'w-28 md:w-44 rounded border text-center' : 'w-6 h-6 rounded-full border text-center select-none shrink-0',
                'flex justify-center items-center',
                className ?? '',
            )}
            {...otherprops}
        >
            {!tiny ? stateString[state] : stateTiny[state]}
        </span>
    );
};
