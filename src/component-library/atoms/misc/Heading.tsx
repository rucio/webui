import * as React from 'react';
import { cn } from '@/component-library/utils';
import { cva } from 'class-variance-authority';

const headingStyles = cva('text-neutral-900 dark:text-neutral-100 font-bold', {
    variants: {
        size: {
            sm: 'text-xl',
            md: 'text-2xl',
            lg: 'text-4xl',
        },
    },
    defaultVariants: {
        size: 'lg',
    },
});

interface HeadingProps {
    text: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Heading = ({ text, size, className, ...props }: HeadingProps) => {
    return (
        <h1 className={cn(headingStyles({ size }), className)} {...props}>
            {text}
        </h1>
    );
};
