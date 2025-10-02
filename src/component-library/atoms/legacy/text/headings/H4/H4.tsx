import React from 'react';
import { twMerge } from 'tailwind-merge';

type H4Props = React.ComponentPropsWithoutRef<'h4'>;

export const H4 = ({ ...props }) => {
    const { className, ...otherprops } = props;
    return (
        <h4 className={twMerge('text-lg leading-none', 'dark:text-text-0 text-text-1000', className ?? '')} {...otherprops}>
            {props.children}
        </h4>
    );
};
