import { cn } from '@/component-library/utils';

export const HintLink = ({ className, href, ...props }: { className?: string; href: string }) => {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={cn('text-neutral-500 dark:text-neutral-400 font-semibold hover:text-brand-500', className)}
            {...props}
        >
            ?
        </a>
    );
};
