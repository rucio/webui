import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BaseViewModel } from '@/lib/sdk/view-models';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Function to emulate pausing between interactions
export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class BaseViewModelValidator {
    toast: (props: any) => void;
    invalidCount: number;

    constructor(toast: (props: any) => void) {
        this.toast = toast;
        this.invalidCount = 0;
    }

    isValid(model: BaseViewModel) {
        if (model.status === 'success') return true;
        this.invalidCount++;
        this.toast({
            variant: 'error',
            title: `Failed to resolve ${this.invalidCount} elements`,
            description: 'Please see the console for details.',
        });
        console.error(`Invalid element\nStatus: ${model.status}\nMessage: ${model.message}`);
        return false;
    }

    reset() {
        this.invalidCount = 0;
    }
}
