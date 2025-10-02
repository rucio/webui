import React from 'react';
import { twMerge } from 'tailwind-merge';

type TableInternalLinkProps = React.ComponentPropsWithoutRef<'a'>;

export const TableInternalLink: React.FC<TableInternalLinkProps> = ({ ...props }) => {
    const { className, children, ...otherprops } = props;
    return (
        <a
            className={twMerge(
                'pl-1',
                'break-all',
                'hover:underline',
                'hover:text-brand-600',
                'dark:text-brand-100 dark:hover:text-brand-400',
                'cursor-pointer',
            )}
            {...otherprops}
        >
            {children}
        </a>
    );
};
