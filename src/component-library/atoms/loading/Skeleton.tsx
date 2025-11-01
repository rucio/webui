import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/component-library/utils';

const skeletonVariants = cva('bg-neutral-100 dark:bg-neutral-800', {
    variants: {
        animation: {
            pulse: 'animate-pulse',
            none: '',
        },
        shape: {
            rectangle: 'rounded-md',
            circle: 'rounded-full',
            text: 'rounded-sm',
        },
    },
    defaultVariants: {
        animation: 'pulse',
        shape: 'rectangle',
    },
});

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof skeletonVariants> {}

export const Skeleton = ({ className, animation, shape, ...props }: SkeletonProps) => {
    return <div className={cn(skeletonVariants({ animation, shape }), className)} aria-busy="true" aria-live="polite" {...props} />;
};
