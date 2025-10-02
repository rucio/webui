import React from 'react';
import { twMerge } from 'tailwind-merge';

export const H2: React.FC<React.ComponentPropsWithoutRef<'h2'>> = ({ ...props }) => {
    const { children, className, ...otherprops } = props;
    return (
        <h2 className={twMerge('text-2xl font-extrabold leading-none dark:text-text-0 text-text-1000', className ?? '')} {...otherprops}>
            {children}
        </h2>
    );
};
