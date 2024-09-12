import React, {HTMLAttributes, ReactNode} from 'react';
import {cn} from "@/component-library/utils";



export const Field = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
    const fieldClasses = cn(
        'flex',
        'rounded',
        'px-3',
        'text-neutral-900 dark:text-neutral-100 whitespace-nowrap',
        'bg-neutral-200 dark:bg-neutral-700',
        'border border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10',
        className
    );

    return <div className={fieldClasses} {...props}>{children}</div>;
};
