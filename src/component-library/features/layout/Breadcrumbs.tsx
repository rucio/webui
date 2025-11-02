import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/component-library/utils';
import { HiChevronRight, HiHome } from 'react-icons/hi';
import Link from 'next/link';

const breadcrumbsVariants = cva('flex items-center flex-wrap gap-2 text-sm', {
    variants: {
        size: {
            sm: 'text-xs',
            md: 'text-sm',
            lg: 'text-base',
        },
    },
    defaultVariants: {
        size: 'md',
    },
});

const breadcrumbItemVariants = cva('transition-colors', {
    variants: {
        active: {
            true: 'text-neutral-900 dark:text-neutral-100 font-medium',
            false: 'text-neutral-600 dark:text-neutral-400 hover:text-brand-600 dark:hover:text-brand-500',
        },
    },
});

export interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: React.ReactNode;
}

export interface BreadcrumbsProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'>, VariantProps<typeof breadcrumbsVariants> {
    items: BreadcrumbItem[];
    separator?: React.ReactNode;
    showHomeIcon?: boolean;
    maxItems?: number;
    homeHref?: string;
}

/**
 * Breadcrumbs navigation component for hierarchical navigation
 *
 * @example
 * ```tsx
 * <Breadcrumbs
 *   items={[
 *     { label: 'Dashboard', href: '/dashboard' },
 *     { label: 'Datasets', href: '/datasets' },
 *     { label: 'Dataset Details' }
 *   ]}
 * />
 * ```
 */
export const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
    ({ className, size, items, separator, showHomeIcon = false, maxItems, homeHref = '/', ...props }, ref) => {
        const defaultSeparator = <HiChevronRight className="h-4 w-4 text-neutral-400 dark:text-neutral-600" />;
        const separatorElement = separator ?? defaultSeparator;

        // Collapse breadcrumbs if maxItems is specified and exceeded
        let displayItems = items;
        let hasCollapsed = false;

        if (maxItems && items.length > maxItems) {
            hasCollapsed = true;
            const firstItems = items.slice(0, 1);
            const lastItems = items.slice(-(maxItems - 2));
            displayItems = [...firstItems, { label: '...', href: undefined }, ...lastItems];
        }

        return (
            <nav ref={ref} aria-label="Breadcrumb" className={cn(breadcrumbsVariants({ size }), className)} {...props}>
                <ol className="flex items-center flex-wrap gap-2">
                    {showHomeIcon && (
                        <>
                            <li>
                                <Link href={homeHref} className={cn(breadcrumbItemVariants({ active: false }))}>
                                    <HiHome className="h-4 w-4" aria-label="Home" />
                                </Link>
                            </li>
                            {displayItems.length > 0 && <li aria-hidden="true">{separatorElement}</li>}
                        </>
                    )}

                    {displayItems.map((item, index) => {
                        const isLast = index === displayItems.length - 1;
                        const isCollapsedIndicator = item.label === '...';

                        return (
                            <React.Fragment key={index}>
                                <li>
                                    {isCollapsedIndicator ? (
                                        <span className="text-neutral-600 dark:text-neutral-400" aria-label="More items">
                                            {item.label}
                                        </span>
                                    ) : item.href && !isLast ? (
                                        <Link href={item.href} className={cn(breadcrumbItemVariants({ active: false }))}>
                                            {item.icon && <span className="mr-1">{item.icon}</span>}
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <span className={cn(breadcrumbItemVariants({ active: isLast }))} aria-current={isLast ? 'page' : undefined}>
                                            {item.icon && <span className="mr-1">{item.icon}</span>}
                                            {item.label}
                                        </span>
                                    )}
                                </li>
                                {!isLast && <li aria-hidden="true">{separatorElement}</li>}
                            </React.Fragment>
                        );
                    })}
                </ol>
            </nav>
        );
    },
);
Breadcrumbs.displayName = 'Breadcrumbs';

export { breadcrumbsVariants, breadcrumbItemVariants };
