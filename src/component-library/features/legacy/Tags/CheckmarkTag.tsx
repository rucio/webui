import React from 'react';
import { HiCheck, HiX } from 'react-icons/hi';
import { twMerge } from 'tailwind-merge';

type CheckmarkTagProps = React.ComponentPropsWithoutRef<'span'> & { val: boolean };

export const CheckmarkTag = ({ val = true, ...props }) => {
    const { className, ...otherprops } = props;
    return (
        <span
            className={twMerge(
                'h-6 w-6 rounded-full flex justify-center text-center items-center',
                val
                    ? 'bg-base-success-100 text-base-success-800 dark:bg-base-success-900 dark:text-base-success-300'
                    : 'bg-base-error-100 text-base-error-800 dark:bg-base-error-900 dark:text-base-error-300',
                'font-bold',
                className,
            )}
            {...otherprops}
        >
            {val ? <HiCheck /> : <HiX />}
        </span>
    );
};
