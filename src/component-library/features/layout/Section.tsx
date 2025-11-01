import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/component-library/utils';

const sectionVariants = cva('w-full', {
    variants: {
        variant: {
            default: '',
            subtle: 'bg-neutral-50 dark:bg-neutral-900',
            bordered: 'border border-neutral-200 dark:border-neutral-800 rounded-lg',
            elevated: 'bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow-sm',
        },
        spacing: {
            none: '',
            sm: 'py-4 md:py-6',
            md: 'py-6 md:py-8',
            lg: 'py-8 md:py-12',
            xl: 'py-12 md:py-16',
        },
        padding: {
            none: '',
            sm: 'px-4 md:px-6',
            md: 'px-6 md:px-8',
            lg: 'px-8 md:px-12',
        },
    },
    defaultVariants: {
        variant: 'default',
        spacing: 'md',
        padding: 'none',
    },
});

export interface SectionProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof sectionVariants> {
    /**
     * ARIA label for the section
     */
    'aria-label'?: string;
    /**
     * ARIA labelledby for the section
     */
    'aria-labelledby'?: string;
}

/**
 * Section component for semantic page structure and consistent spacing
 *
 * @example
 * ```tsx
 * <Section spacing="lg" aria-labelledby="features-heading">
 *   <h2 id="features-heading">Features</h2>
 *   <p>Content</p>
 * </Section>
 * ```
 */
export const Section = React.forwardRef<HTMLElement, SectionProps>(
    ({ className, variant, spacing, padding, children, ...props }, ref) => {
        return (
            <section ref={ref} className={cn(sectionVariants({ variant, spacing, padding }), className)} {...props}>
                {children}
            </section>
        );
    },
);
Section.displayName = 'Section';

export { sectionVariants };
