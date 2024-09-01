import * as React from 'react';
import { cn } from '@/component-library/utils';

const Heading = ({ text, className, ...props }: { text: string; className?: string }) => {
    return (
        <h1 className={cn('text-4xl text-neutral-900 dark:text-neutral-100 font-bold', className)} {...props}>
            {text}
        </h1>
    );
};

export { Heading };
