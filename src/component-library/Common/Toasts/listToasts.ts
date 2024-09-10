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
