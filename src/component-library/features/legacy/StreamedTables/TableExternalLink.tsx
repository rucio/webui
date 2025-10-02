import React from 'react';
import { twMerge } from 'tailwind-merge';
import { HiExternalLink } from 'react-icons/hi';

export const TableExternalLink: React.FC<React.ComponentPropsWithoutRef<'a'> & { label: string }> = ({ label, ...props }) => {
    const { className, children, ...otherprops } = props;
    return (
        <a
            className={twMerge('px-1 rounded', 'flex flex-row items-center', 'bg-brand-500 hover:bg-brand-600 text-text-0', className ?? '')}
            {...otherprops}
        >
            <HiExternalLink />
            <span>{label}</span>
            {children}
        </a>
    );
};
