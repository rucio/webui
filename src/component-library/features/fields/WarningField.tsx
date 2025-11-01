import { Field } from '@/component-library/atoms/misc/Field';
import { cn } from '@/component-library/utils';
import React, { ReactNode } from 'react';
import { HiExclamationCircle } from 'react-icons/hi';

export const WarningField = ({ children, className, ...props }: { children: ReactNode; className?: string }) => {
    return (
        <Field
            className={cn(
                'bg-base-warning-500 dark:bg-base-warning-500 bg-opacity-60 dark:bg-opacity-60',
                'items-center py-2 space-x-2',
                'whitespace-normal',
                className,
            )}
            {...props}
        >
            <HiExclamationCircle className="h-6 w-6 flex-shrink-0" />
            {children}
        </Field>
    );
};
