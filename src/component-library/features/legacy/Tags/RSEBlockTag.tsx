import React from 'react';
import { RSEBlockState } from '@/lib/core/entity/rucio';
import { HiMinusCircle } from 'react-icons/hi';
import { twMerge } from 'tailwind-merge';

export const RSEBlockTag: React.FC<React.ComponentPropsWithoutRef<'span'> & { block: 'Read' | 'Write' | 'Delete' }> = ({ block, ...props }) => {
    const { className, ...otherprops } = props;
    return (
        <span
            className={twMerge(
                'flex flex-row justify-start items-center space-x-1 w-fit px-1 rounded',
                'bg-neutral-900',
                'text-neutral-0 font-semibold',
                'dark:border dark:border-neutral-0',
                className ?? '',
            )}
            {...otherprops}
        >
            <HiMinusCircle className="text-xl" />
            <span>{block}</span>
        </span>
    );
};
