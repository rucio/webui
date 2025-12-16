import * as React from 'react';
import { cn } from '@/component-library/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { copiedToast, errorCopyingToast } from '@/component-library/features/utils/list-toasts';
import { HiOutlineClipboardCopy } from 'react-icons/hi';
import { useToast } from '@/lib/infrastructure/hooks/useToast';

const headingStyles = cva('text-neutral-900 dark:text-neutral-100 font-bold', {
    variants: {
        size: {
            sm: 'text-xl font-medium',
            md: 'text-2xl',
            lg: 'text-4xl',
        },
        variant: {
            display: 'text-5xl font-extrabold',
            title: 'text-3xl font-bold',
            subtitle: 'text-xl font-semibold',
        },
    },
    defaultVariants: {
        size: 'lg',
    },
});

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingStyles> {
    /** @deprecated Use children instead */
    text?: string;
    level?: HeadingLevel;
    children?: React.ReactNode;
}

export const Heading = ({ text, size, variant, level = 'h1', className, children, ...props }: HeadingProps) => {
    const Tag = level;
    return (
        <Tag className={cn(headingStyles({ size, variant }), className)} {...props}>
            {children || text}
        </Tag>
    );
};

export const CopyableHeading = ({ text, size, className, ...props }: HeadingProps) => {
    const { toast } = useToast();

    const handleCopy = () => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                toast(copiedToast);
            })
            .catch(() => {
                toast(errorCopyingToast);
            });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCopy();
        }
    };

    return (
        <div
            className="flex items-center space-x-2 cursor-pointer rounded focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-neutral-0 dark:focus:ring-offset-neutral-900"
            onClick={handleCopy}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
        >
            <HiOutlineClipboardCopy className="h-8 w-8 inline" />
            <Heading text={text} size={size} className={className} {...props} />
        </div>
    );
};
