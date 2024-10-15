import { ReactNode } from 'react';
import { cn } from '@/component-library/utils';

export const KeyValueRow = (props: { name: string; children: ReactNode }) => {
    return (
        <div className="flex w-full items-center h-12">
            <span className={cn('text-neutral-700 dark:text-neutral-300', 'min-w-[10rem] pr-3', 'font-medium text-right text-sm')}>{props.name}</span>
            <span className="flex items-center space-x-2">{props.children}</span>
        </div>
    );
};
