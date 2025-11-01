import React from 'react';
import { twMerge } from 'tailwind-merge';

export const P: React.FC<React.ComponentPropsWithoutRef<'p'> & { mono?: boolean }> = ({ mono = false, ...props }) => {
    const { className, ...otherprops } = props;

    return (
        <p className={twMerge('dark:text-neutral-0 text-neutral-1000', mono ? 'font-mono' : '', className ?? '')} {...otherprops}>
            {props.children}
        </p>
    );
};
