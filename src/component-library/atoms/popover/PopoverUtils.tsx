import { cn } from '@/component-library/utils';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Color variants for popovers.
 * 
 * It also contains the default classes for styling the popover like `z-50 rounded-md`, so all the popovers on the website look similarly.
 */
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

/**
 * Color variants for arrow in popover.
 * 
 * Without `cva` function, because Tailwind needs these classes to be specified before compilation, since arrow is an SVG component
 */
export const popoverArrowFill = {
    default: 'fill-neutral-800 dark:fill-neutral-200',
    neutral: 'fill-neutral-800 dark:fill-neutral-200',
    success: 'fill-base-success-800 dark:fill-base-success-200',
    error: 'fill-base-error-800 dark:fill-base-error-200',
    warning: 'fill-base-warning-800 dark:fill-base-warning-200',
    info: 'fill-brand-800 dark:fill-brand-200',
};

/**
 * Color variants for label in `PopoverRow` component.
 */
const popoverLabelColorVariants = cva('', {
    variants: {
        variant: {
            default: 'text-neutral-100 dark:text-neutral-900',
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

/**
 * Type responsible for storing the variant of the popover.
 */
type PopoverVariant = VariantProps<typeof popoverVariants>

/**
 * Interface providing necessary values for `PopoverRow` component.
 * 
 * @param {string} label field name (usually) or just a label.
 * @param {string} value value of the field.
 * @param {'break-all' | 'break-word'} breakValue  defining whether the value should be broken by words or anywhere (useful for showing errors).
 * @param {string} labelClassName styling for label.
 * @param {string} valueClassName styling for value.
 */
interface PopoverRowParams extends PopoverVariant {
    label: string;
    value?: string;
    breakValue?: 'break-all' | 'break-word';
    labelClassName?: string;
    valueClassName?: string;
}

/**
 * Creates a `label: value` row in popover content.
 *
 * @returns prepared row.
 */
export const PopoverRow = ({ label, value, variant, breakValue = 'break-word', labelClassName, valueClassName }: PopoverRowParams) =>
    <div className="flex gap-2 text-wrap">
        <dt className={cn('min-w-[4.5rem]', popoverLabelColorVariants({ variant }), labelClassName)}>{label}</dt>
        <dd className={cn('font-mono', breakValue, valueClassName)}>{value ?? null}</dd>
    </div>;
