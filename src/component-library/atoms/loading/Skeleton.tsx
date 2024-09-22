import { cn } from '@/component-library/utils';

export const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return <div className={cn('animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-800', className)} {...props} />;
};
