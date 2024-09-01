import Link from 'next/link';
import { cn } from '@/component-library/utils';

export const HintLink = ({ className, href, ...props }: { className?: string; href: string }) => {
    return (
        <Link href={href} className={cn('text-neutral-500 dark:text-neutral-400 font-semibold hover:text-brand-500', className)} {...props}>
            ?
        </Link>
    );
};
