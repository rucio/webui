import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/component-library/utils';

const dividerVariants = cva('', {
    variants: {
        orientation: {
            horizontal: 'w-full border-t',
            vertical: 'h-full border-l',
        },
        thickness: {
            thin: 'border',
            medium: 'border-2',
            thick: 'border-4',
        },
        variant: {
            default: 'border-neutral-100 dark:border-neutral-700',
            neutral: 'border-neutral-200 dark:border-neutral-600',
            brand: 'border-brand-500 dark:border-brand-600',
            subtle: 'border-neutral-50 dark:border-neutral-800',
        },
        spacing: {
            none: '',
            sm: '',
            md: '',
            lg: '',
            xl: '',
        },
    },
    compoundVariants: [
        {
            orientation: 'horizontal',
            spacing: 'sm',
            className: 'my-2',
        },
        {
            orientation: 'horizontal',
            spacing: 'md',
            className: 'my-4',
        },
        {
            orientation: 'horizontal',
            spacing: 'lg',
            className: 'my-6',
        },
        {
            orientation: 'horizontal',
            spacing: 'xl',
            className: 'my-8',
        },
        {
            orientation: 'vertical',
            spacing: 'sm',
            className: 'mx-2',
        },
        {
            orientation: 'vertical',
            spacing: 'md',
            className: 'mx-4',
        },
        {
            orientation: 'vertical',
            spacing: 'lg',
            className: 'mx-6',
        },
        {
            orientation: 'vertical',
            spacing: 'xl',
            className: 'mx-8',
        },
    ],
    defaultVariants: {
        orientation: 'horizontal',
        thickness: 'thin',
        variant: 'default',
        spacing: 'md',
    },
});

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof dividerVariants> {}

export const Divider = ({ className, orientation, thickness, variant, spacing, ...props }: DividerProps) => {
    return <div className={cn(dividerVariants({ orientation, thickness, variant, spacing }), className)} {...props} />;
};

export { dividerVariants };
