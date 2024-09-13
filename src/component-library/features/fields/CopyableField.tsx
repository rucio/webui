import React from 'react';
import { cn } from '@/component-library/utils';
import { Field } from '@/component-library/atoms/misc/Field';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { copiedToast, errorCopyingToast } from '@/component-library/features/utils/list-toasts';
import { HiOutlineClipboardCopy } from 'react-icons/hi';

export const CopyableField = ({ text, className, ...props }: { text: string; className?: string }) => {
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
        <Field className={cn('cursor-pointer', className)} onClick={handleCopy} {...props}>
            <div className="flex items-center space-x-2">
                <span>{text}</span>
                <HiOutlineClipboardCopy className="h-4 w-4 inline" />
            </div>
        </Field>
    );
};
