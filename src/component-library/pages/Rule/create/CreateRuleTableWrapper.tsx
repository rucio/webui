import { ReactNode } from 'react';

export const CreateRuleTableWrapper = ({ children }: { children: ReactNode }) => {
    return (
        <div className="rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden h-[450px] flex flex-col">
            {children}
        </div>
    );
};
