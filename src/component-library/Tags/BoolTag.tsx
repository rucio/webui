import { FC, useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

export type BoolTagProps = JSX.IntrinsicElements['span'] & { val: boolean };

export const BoolTag: FC<BoolTagProps> = ({ val = true, ...props }) => {
    return (
        <span
            className={twMerge(
                'mr-2 px-2.5 py-0.5 rounded h-6 flex w-20 justify-center text-center items-center',
                val
                    ? 'bg-base-success-100 text-base-success-800 dark:bg-base-success-900 dark:text-base-success-300'
                    : 'bg-base-error-100 text-base-error-800 dark:bg-base-error-900 dark:text-base-error-300',
                props.className,
            )}
            {...props}
        >
            {val ? 'True' : 'False'}
        </span>
    );
};
