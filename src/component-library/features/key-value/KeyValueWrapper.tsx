import {ReactNode} from "react";
import {cn} from "@/component-library/utils";

export const KeyValueWrapper = ({children, className}: { children: ReactNode, className?: string }) => {
    return <div
        className={cn(
            'bg-neutral-0 dark:bg-neutral-800',
            'rounded-md border border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10',
            className
        )}
    >
        {children}
    </div>
};
