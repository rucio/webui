import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/component-library/utils';

const buttonVariants = cva(
    cn(
        'inline-flex items-center justify-center whitespace-nowrap',
        'rounded-md border border-neutral-900 border-opacity-10 dark:border-none',
        'font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
        'bg-opacity-90 dark:bg-opacity-70 hover:bg-opacity-90 dark:hover:bg-opacity-70',
    ),
    {
        variants: {
            variant: {
                default: 'bg-opacity-80 bg-brand-600 text-neutral-100 hover:bg-brand-700 dark:hover:bg-brand-500',
                success: 'bg-base-success-600 text-neutral-100 hover:bg-base-success-700 dark:hover:bg-base-success-500',
                error: 'bg-base-error-600 text-neutral-100 hover:bg-base-error-700 dark:hover:bg-base-error-500',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md px-8',
                icon: 'h-7 w-7 rounded',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = 'Button';

export { Button, buttonVariants };
