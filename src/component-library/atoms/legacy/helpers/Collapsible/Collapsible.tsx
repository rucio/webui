import React from 'react';
import { twMerge } from 'tailwind-merge';

export const Collapsible: React.FC<React.ComponentPropsWithoutRef<'div'> & { showIf: boolean }> = ({ showIf, ...props }) => {
    // why hidden instead of collapse (apparently collapsed only removes space on table objects) ? i am confused
    const { className, children, ...otherprops } = props;
    return (
        <div className={twMerge(showIf ? '' : 'hidden', className ?? '')} data-testid={props.id ? props.id : undefined} {...otherprops}>
            {children}
        </div>
    );
};
