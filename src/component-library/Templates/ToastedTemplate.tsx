import { useToast } from '@/lib/infrastructure/hooks/useToast';
import React, { ReactNode, useEffect } from 'react';
import { Toaster } from '@/component-library/ui/toaster';

export const ToastedTemplate = ({ children }: { children: ReactNode }) => {
    const { dismiss } = useToast();

    useEffect(() => {
        return () => dismiss();
    }, []);

    return (
        <div className="flex flex-col h-screen dark:bg-neutral-900">
            {children}
            <Toaster />
        </div>
    );
};
