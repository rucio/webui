'use client';

import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/component-library/utils';
import { HiInformationCircle, HiExclamationCircle, HiX, HiXCircle, HiCheckCircle } from 'react-icons/hi';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
    React.ElementRef<typeof ToastPrimitives.Viewport>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
    <ToastPrimitives.Viewport
        ref={ref}
        className={cn(
            'fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:top-auto sm:flex-col md:max-w-[420px]',
            className,
        )}
        {...props}
    />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const variantsDefinition = {
    info: 'bg-base-info-100 dark:bg-base-info-900 text-base-info-900 dark:text-base-info-100 border-base-info-600 dark:border-base-info-700',
    success:
        'bg-base-success-100 dark:bg-base-success-900 text-base-success-900 dark:text-base-success-100 border-base-success-600 dark:border-base-success-700',
    warning:
        'bg-base-warning-100 dark:bg-base-warning-900 text-base-warning-900 dark:text-base-warning-100 border-base-warning-700 dark:border-base-warning-700',
    error: 'bg-base-error-100 dark:bg-base-error-900 text-base-error-900 dark:text-base-error-100 border-base-error-600 dark:border-base-error-700',
};

const toastVariants = cva(
    cn(
        'flex items-center justify-between space-x-4',
        'w-full',
        'overflow-hidden',
        'rounded-lg',
        'pointer-events-auto',
        'border',
        'p-6 pr-8',
        'group relative',
        'shadow-lg',
        'transition-all duration-200',
        'data-[state=open]:fade-in-20 data-[state=closed]:fade-out-20',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
        'data-[state=closed]:slide-out-to-right-full',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
    ),
    {
        variants: {
            variant: variantsDefinition,
        },
        defaultVariants: {
            variant: 'info',
        },
    },
);
type ToastVariant = keyof typeof variantsDefinition;

const Toast = React.forwardRef<
    React.ElementRef<typeof ToastPrimitives.Root>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
    return <ToastPrimitives.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />;
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<React.ElementRef<typeof ToastPrimitives.Action>, React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>>(
    ({ className, ...props }, ref) => (
        <ToastPrimitives.Action
            ref={ref}
            className={cn(
                'inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-transparent px-3 text-sm font-medium ring-offset-neutral-0 transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-neutral-100/40 group-[.destructive]:hover:border-base-error-500/30 group-[.destructive]:hover:bg-base-error-500 group-[.destructive]:hover:text-neutral-100 group-[.destructive]:focus:ring-base-error-500 dark:border-neutral-800 dark:ring-offset-neutral-900 dark:hover:bg-neutral-800 dark:focus:ring-brand-500 dark:group-[.destructive]:border-neutral-800/40 dark:group-[.destructive]:hover:border-base-error-900/30 dark:group-[.destructive]:hover:bg-base-error-900 dark:group-[.destructive]:hover:text-neutral-100 dark:group-[.destructive]:focus:ring-base-error-900',
                className,
            )}
            {...props}
        />
    ),
);
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<React.ElementRef<typeof ToastPrimitives.Close>, React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>>(
    ({ className, ...props }, ref) => (
        <ToastPrimitives.Close
            ref={ref}
            className={cn(
                'absolute right-2 top-2 rounded-md p-1',
                'opacity-0 transition-opacity group-hover:opacity-100',
                'hover:opacity-100 focus:opacity-100',
                'focus:outline-none focus:ring-2 focus:ring-brand-500',
                className,
            )}
            toast-close=""
            aria-label="Close notification"
            {...props}
        >
            <HiX className="h-4 w-4" />
        </ToastPrimitives.Close>
    ),
);
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<React.ElementRef<typeof ToastPrimitives.Title>, React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>>(
    ({ className, ...props }, ref) => <ToastPrimitives.Title ref={ref} className={cn('text-sm font-semibold inline-block', className)} {...props} />,
);
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
    React.ElementRef<typeof ToastPrimitives.Description>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => <ToastPrimitives.Description ref={ref} className={cn('text-sm opacity-90', className)} {...props} />);
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

const ToastIcon = ({ variant }: { variant: ToastVariant }) => {
    const icons = {
        info: <HiInformationCircle />,
        success: <HiCheckCircle />,
        warning: <HiExclamationCircle />,
        error: <HiXCircle />,
    };
    return <div className="pr-2 text-xl inline-block">{icons[variant]}</div>;
};

export {
    type ToastProps,
    type ToastActionElement,
    ToastProvider,
    ToastViewport,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastClose,
    ToastAction,
    ToastIcon,
};
