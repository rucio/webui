'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { HiCheck, HiMinus } from 'react-icons/hi';

import { cn } from '@/component-library/utils';

/**
 * Accessible checkbox built on Radix UI's CheckboxPrimitive.
 *
 * Accessibility notes:
 * - The visible control is a `<button role="checkbox">` (the Radix Root); its `aria-checked`
 *   attribute conveys the checked state to assistive technology.
 * - Radix internally renders a visually-hidden `<input type="checkbox">` (BubbleInput) for
 *   native-form serialisation. As of @radix-ui/react-checkbox v1.1+, that element is rendered
 *   with `aria-hidden="true"` so it is excluded from the accessibility tree.
 * - The `CheckboxPrimitive.Indicator` and its decorative icon children are marked
 *   `aria-hidden="true"` here because the state is already communicated by the Root's
 *   `role`/`aria-checked` attributes.
 */
const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>>(
    ({ className, ...props }, ref) => (
        <CheckboxPrimitive.Root
            ref={ref}
            className={cn(
                'peer h-5 w-5 shrink-0 rounded border',
                'border-neutral-900 dark:border-neutral-100 border-opacity-20 dark:border-opacity-20',
                'bg-neutral-200 dark:bg-neutral-900',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'data-[state=checked]:bg-base-success-600 data-[state=checked]:border-base-success-600',
                'data-[state=checked]:bg-opacity-80 dark:data-[state=checked]:bg-opacity-60',
                'data-[state=indeterminate]:bg-brand-600 data-[state=indeterminate]:border-brand-600',
                'data-[state=indeterminate]:bg-opacity-80 dark:data-[state=indeterminate]:bg-opacity-60',
                'transition-colors',
                className,
            )}
            {...props}
        >
            {/* aria-hidden: the state is communicated by the Root's role/aria-checked; the
                icon is purely decorative and must not be announced by screen readers. */}
            <CheckboxPrimitive.Indicator aria-hidden="true" className={cn('flex items-center justify-center text-neutral-100')}>
                {props.checked === 'indeterminate' && <HiMinus className="h-4 w-4" />}
                {props.checked === true && <HiCheck className="h-4 w-4" />}
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    ),
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
