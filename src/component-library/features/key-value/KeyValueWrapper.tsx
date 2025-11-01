import { ReactNode } from 'react';
import { cn } from '@/component-library/utils';

export const KeyValueWrapper = ({ children, className }: { children: ReactNode; className?: string }) => {
    return (
        <div
            className={cn(
                'bg-neutral-0 dark:bg-neutral-800',
                'rounded-lg border border-neutral-200 dark:border-neutral-700',
                'shadow-sm',
                className,
            )}
        >
            {children}
        </div>
    );
};
