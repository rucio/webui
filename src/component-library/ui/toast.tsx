'use client';

import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/component-library/utils';
import { HiInformationCircle, HiExclamationCircle, HiX, HiXCircle } from 'react-icons/hi';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
    React.ElementRef<typeof ToastPrimitives.Viewport>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
    <ToastPrimitives.Viewport
        ref={ref}
        className={cn(
            'fixed bottom-0 left-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[600px]',
            className,
        )}
        {...props}
    />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const variantsDefinition = {
    warning: 'bg-base-warning-300 text-neutral-900',
    error: 'bg-base-error-500 text-neutral-100',
    info: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100',
};

const toastVariants = cva(
    cn(
        'flex items-center justify-between space-x-4',
        'w-full',
        'overflow-hidden',
        'rounded-md',
        'pointer-events-auto',
        'border border-neutral-900 dark:border-neutral-100',
        'border-opacity-10 dark:border-opacity-10',
        'bg-opacity-90',
        'p-4 pr-8',
        'group relative',
        'transition-all',
        'data-[state=open]:fade-in-20 data-[state=closed]:fade-out-20',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
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
                'inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-transparent px-3 text-sm font-medium ring-offset-white transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-slate-100/40 group-[.destructive]:hover:border-red-500/30 group-[.destructive]:hover:bg-red-500 group-[.destructive]:hover:text-slate-50 group-[.destructive]:focus:ring-red-500 dark:border-slate-800 dark:ring-offset-slate-950 dark:hover:bg-slate-800 dark:focus:ring-slate-300 dark:group-[.destructive]:border-slate-800/40 dark:group-[.destructive]:hover:border-red-900/30 dark:group-[.destructive]:hover:bg-red-900 dark:group-[.destructive]:hover:text-slate-50 dark:group-[.destructive]:focus:ring-red-900',
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
            className={cn('absolute right-2 top-2 p-1', 'opacity-0 transition-opacity group-hover:opacity-100', className)}
            toast-close=""
            {...props}
        >
            <HiX className="h-4 w-4" />
        </ToastPrimitives.Close>
    ),
);
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<React.ElementRef<typeof ToastPrimitives.Title>, React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>>(
    ({ className, ...props }, ref) => <ToastPrimitives.Title ref={ref} className={cn('text font-bold inline-block', className)} {...props} />,
);
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
    React.ElementRef<typeof ToastPrimitives.Description>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => <ToastPrimitives.Description ref={ref} className={cn('text-sm', className)} {...props} />);
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

const ToastIcon = ({ variant }: { variant: ToastVariant }) => {
    const icons = {
        info: <HiInformationCircle />,
        error: <HiXCircle />,
        warning: <HiExclamationCircle />,
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
