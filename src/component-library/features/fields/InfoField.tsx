import { Field } from '@/component-library/atoms/misc/Field';
import { cn } from '@/component-library/utils';
import { HiInformationCircle } from 'react-icons/hi';
import React, { ReactNode } from 'react';

export const InfoField = ({ children, className, ...props }: { children: ReactNode; className?: string }) => {
    return (
        <Field className={cn('bg-neutral-100 dark:bg-neutral-800', 'items-center py-2 space-x-2', 'whitespace-normal', className)} {...props}>
            <HiInformationCircle className="h-6 w-6 flex-shrink-0" />
            {children}
        </Field>
    );
};
