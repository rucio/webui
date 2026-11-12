import { cn } from '@/component-library/utils';
import { cva, type VariantProps } from 'class-variance-authority';

export const popoverVariants = cva('z-50 px-3 py-2 rounded-md shadow-md text-neutral-100 dark:text-neutral-900', {
    variants: {
        variant: {
            default: 'bg-neutral-800 dark:bg-neutral-200',
            neutral: 'bg-neutral-800 dark:bg-neutral-200',
            success: 'bg-base-success-800 dark:bg-base-success-200',
            error: 'bg-base-error-800 dark:bg-base-error-200',
            warning: 'bg-base-warning-800 dark:bg-base-warning-200',
            info: 'bg-brand-800 dark:bg-brand-200',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

// Without cva, because Tailwind needs these classes to be specified before compilation, since arrow is an SVG component
export const popoverArrowFill = {
    default: 'fill-neutral-800 dark:fill-neutral-200',
    neutral: 'fill-neutral-800 dark:fill-neutral-200',
    success: 'fill-base-success-800 dark:fill-base-success-200',
    error: 'fill-base-error-800 dark:fill-base-error-200',
    warning: 'fill-base-warning-800 dark:fill-base-warning-200',
    info: 'fill-brand-800 dark:fill-brand-200',
};

const popoverLabelColorVariants = cva('', {
    variants: {
        variant: {
            default: 'text-neutral-900 dark:text-neutral-100',
            success: 'text-base-success-400 dark:text-base-success-600 border-base-success-600 dark:border-base-success-500',
            error: 'text-base-error-400 dark:text-base-error-600',
            warning: 'text-base-warning-400 dark:text-base-warning-600 border-base-warning-600 dark:border-base-warning-500',
            info: 'text-brand-400 dark:text-brand-600 border-brand-600 dark:border-brand-500',
            neutral: 'text-neutral-400 dark:text-neutral-600',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

type PopoverVariant = VariantProps<typeof popoverVariants>

interface PopoverRowParams extends PopoverVariant {
    label: string;
    value?: string;
    breakValue?: 'break-all' | 'break-word';
    labelClassName?: string;
    valueClassName?: string;
}

export const PopoverRow = ({ label, value, variant, breakValue = 'break-word', labelClassName, valueClassName }: PopoverRowParams) =>
    value ? (
        <div className="flex gap-2 text-wrap">
            <dt className={cn('min-w-[4.5rem]', popoverLabelColorVariants({ variant }), labelClassName)}>{label}</dt>
            <dd className={cn('font-mono', breakValue, valueClassName)}>{value}</dd>
        </div>
    ) : null;
