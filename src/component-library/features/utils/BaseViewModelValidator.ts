import { BaseViewModel } from '@/lib/sdk/view-models';

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
        const plural = this.invalidCount > 1 ? 's' : '';
        this.toast({
            variant: 'error',
            title: `Failed to resolve ${this.invalidCount} element${plural}`,
            description: 'Please see the console for details.',
        });
        console.error(`Invalid element\nStatus: ${model.status}\nMessage: ${model.message}`);
        return false;
    }

    reset() {
        this.invalidCount = 0;
    }
}
