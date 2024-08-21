import { LockState } from '@/lib/core/entity/rucio';
import { twMerge } from 'tailwind-merge';

export const LockStateTag: React.FC<JSX.IntrinsicElements['span'] & { lockState: LockState; tiny?: boolean }> = ({
    lockState = 'OK',
    tiny = false,
    ...props
}) => {
    const { className, ...otherprops } = props;
    const stateString: Record<string, string> = {
        R: 'Replicating',
        O: 'OK',
        S: 'Stuck',
    };

    return (
        <span
            className={twMerge(
                lockState === LockState.OK
                    ? 'bg-base-success-300 border-base-success-700 dark:bg-base-success-700 dark:border-base-success-200'
                    : lockState === LockState.STUCK
                    ? 'bg-base-warning-300 border-base-warning-700 dark:bg-base-warning-700 dark:border-base-warning-200'
                    : lockState === LockState.REPLICATING
                    ? 'bg-base-error-400 border-base-error-700 dark:bg-base-error-700 dark:border-base-error-200'
                    : '',
                'text-text-1000 dark:text-text-0 font-sans',
                !tiny ? 'w-28 rounded border text-center' : 'w-6 h-6 rounded-full border text-center select-none shrink-0',
                'flex justify-center items-center',
                className ?? '',
            )}
            {...otherprops}
        >
            {!tiny ? stateString[lockState] : lockState}
        </span>
    );
};
