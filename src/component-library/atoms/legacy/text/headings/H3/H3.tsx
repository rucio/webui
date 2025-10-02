import React from 'react';
import { twMerge } from 'tailwind-merge';

export const H3: React.FC<React.ComponentPropsWithoutRef<'h3'>> = ({ ...props }) => {
    const { className, ...otherprops } = props;
    return (
        <h3 className={twMerge('text-xl leading-none dark:text-text-0 text-text-1000', className ?? '')} {...otherprops}>
            {props.children}
        </h3>
    );
};
