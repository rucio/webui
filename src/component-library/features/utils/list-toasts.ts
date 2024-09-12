import { Toast } from '@/lib/infrastructure/hooks/useToast';

export const noApiToast: Toast = {
    title: 'Warning',
    description: 'Cannot start the streaming while the grid is not ready.',
    variant: 'warning',
};

export const alreadyStreamingToast: Toast = {
    title: 'Oops!',
    description: 'Please stop the streaming before trying to search again.',
    variant: 'info',
};

export const copiedToast: Toast = {
    title: 'Copied!',
    variant: 'info'
}

export const errorCopyingToast: Toast = {
    title: 'Cannot copy the text',
    variant: 'error'
}
