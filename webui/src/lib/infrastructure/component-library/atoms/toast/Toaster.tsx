'use client';

import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { Toast, ToastClose, ToastDescription, ToastIcon, ToastProvider, ToastTitle, ToastViewport } from '@/component-library/atoms/toast/toast';

export function Toaster() {
    const { toasts } = useToast();

    return (
        <ToastProvider>
            {toasts.map(function ({ id, title, description, action, ...props }) {
                return (
                    <Toast key={id} {...props}>
                        <div className="grid gap-1">
                            <div className="flex items-center">
                                {props.variant && <ToastIcon variant={props.variant} />}
                                {title && <ToastTitle>{title}</ToastTitle>}
                            </div>
                            {description && <ToastDescription>{description}</ToastDescription>}
                        </div>
                        {action}
                        <ToastClose />
                    </Toast>
                );
            })}
            <ToastViewport />
        </ToastProvider>
    );
}
