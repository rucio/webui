import * as React from 'react';
import { cn } from '@/component-library/utils';
import { cva } from 'class-variance-authority';
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

    return (
        <div className="flex items-center space-x-2 cursor-pointer" onClick={handleCopy}>
            <HiOutlineClipboardCopy className="h-8 w-8 inline" />
            <Heading text={text} size={size} className={className} {...props} />
        </div>
    );
};
