import * as React from 'react';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/component-library/utils';
import { HiChevronDown } from 'react-icons/hi';

const Collapsible = CollapsiblePrimitive.Root;

const collapsibleTriggerVariants = cva(
    'flex w-full items-center justify-between rounded px-4 py-3 font-medium transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 [&[data-state=open]>svg]:rotate-180',
    {
        variants: {
            variant: {
                default: 'bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800',
                ghost: 'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                outline: 'border border-neutral-200 dark:border-neutral-800',
            },
            size: {
                sm: 'text-sm py-2 px-3',
                md: 'text-base py-3 px-4',
                lg: 'text-lg py-4 px-5',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    },
);

const collapsibleContentVariants = cva('overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down', {
    variants: {
        variant: {
            default: 'border-x border-b border-neutral-200 dark:border-neutral-800 rounded-b',
            ghost: '',
            outline: 'border-x border-b border-neutral-200 dark:border-neutral-800 rounded-b',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

interface CollapsibleTriggerProps
    extends React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleTrigger>,
        VariantProps<typeof collapsibleTriggerVariants> {
    showIcon?: boolean;
}

const CollapsibleTrigger = React.forwardRef<React.ElementRef<typeof CollapsiblePrimitive.CollapsibleTrigger>, CollapsibleTriggerProps>(
    ({ className, variant, size, children, showIcon = true, ...props }, ref) => (
        <CollapsiblePrimitive.CollapsibleTrigger ref={ref} className={cn(collapsibleTriggerVariants({ variant, size }), className)} {...props}>
            {children}
            {showIcon && <HiChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />}
        </CollapsiblePrimitive.CollapsibleTrigger>
    ),
);
CollapsibleTrigger.displayName = CollapsiblePrimitive.CollapsibleTrigger.displayName;

interface CollapsibleContentProps
    extends React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>,
        VariantProps<typeof collapsibleContentVariants> {}

const CollapsibleContent = React.forwardRef<React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>, CollapsibleContentProps>(
    ({ className, variant, children, ...props }, ref) => (
        <CollapsiblePrimitive.CollapsibleContent ref={ref} className={cn(collapsibleContentVariants({ variant }), className)} {...props}>
            <div className="px-4 py-3">{children}</div>
        </CollapsiblePrimitive.CollapsibleContent>
    ),
);
CollapsibleContent.displayName = CollapsiblePrimitive.CollapsibleContent.displayName;

export { Collapsible, CollapsibleTrigger, CollapsibleContent, collapsibleTriggerVariants, collapsibleContentVariants };
