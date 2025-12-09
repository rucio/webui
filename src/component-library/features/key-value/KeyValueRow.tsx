import { ReactNode } from 'react';
import { cn } from '@/component-library/utils';

export const KeyValueRow = (props: { name: string; children: ReactNode }) => {
    return (
        <div className="flex w-full items-center min-h-[3rem] py-2 overflow-auto">
            <label className={cn('text-neutral-600 dark:text-neutral-400', 'min-w-[12rem] pr-12', 'font-medium text-sm')}>{props.name}</label>
            <div className="flex items-center gap-3 text-neutral-900 dark:text-neutral-100">{props.children}</div>
        </div>
    );
};
