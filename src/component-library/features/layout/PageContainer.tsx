import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/component-library/utils';

const pageContainerVariants = cva('w-full', {
    variants: {
        maxWidth: {
            sm: 'max-w-screen-sm',
            md: 'max-w-screen-md',
            lg: 'max-w-screen-lg',
            xl: 'max-w-screen-xl',
            '2xl': 'max-w-screen-2xl',
            full: 'max-w-full',
        },
        padding: {
            none: '',
            sm: 'px-4 py-4 md:px-6 md:py-6',
            md: 'px-4 py-6 md:px-6 md:py-8',
            lg: 'px-4 py-8 md:px-8 md:py-10',
        },
        centered: {
            true: 'mx-auto',
            false: '',
        },
    },
    defaultVariants: {
        maxWidth: 'xl',
        padding: 'md',
        centered: true,
    },
});

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof pageContainerVariants> {}

/**
 * PageContainer component for consistent page layout and spacing
 *
 * @example
 * ```tsx
 * <PageContainer>
 *   <h1>Page Title</h1>
 *   <p>Content</p>
 * </PageContainer>
 * ```
 */
export const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
    ({ className, maxWidth, padding, centered, children, ...props }, ref) => {
        return (
            <div ref={ref} className={cn(pageContainerVariants({ maxWidth, padding, centered }), className)} {...props}>
                {children}
            </div>
        );
    },
);
PageContainer.displayName = 'PageContainer';

export { pageContainerVariants };
