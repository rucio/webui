import { useEffect } from 'react';
import { HiXCircle } from 'react-icons/hi2';
import { twMerge } from 'tailwind-merge';

interface AlertProps {
    id?: string | undefined;
    message?: string | any;
    variant?: 'primary' | 'warn' | 'success' | 'error';
    onClose?: () => void;
}

export const Alert = ({ id = undefined, message = 'Welcome to Rucio!', variant = 'primary', onClose = () => {} }: AlertProps) => {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, []);
    return (
        <div
            className={twMerge(
                'px-4 py-3 border-l-4',
                variant === 'primary' ? 'bg-base-info-100 border-base-info-500 text-base-info-700' : '',
                variant === 'warn' ? 'bg-base-warning-100 border-base-warning-500 text-base-warning-700' : '',
                variant === 'success' ? 'bg-base-success-100 border-base-success-500 text-base-success-700' : '',
                variant === 'error' ? 'bg-base-error-100 border-base-error-500 text-base-error-700' : '',
                'flex flex-row justify-between items-center',
            )}
        >
            <span className="block sm:inline" data-testid={id}>
                {message}
            </span>
            <button aria-label="Close" onClick={onClose} data-testid={id ? `${id}-close-button` : undefined}>
                <HiXCircle className="text-2xl" />
            </button>
        </div>
    );
};
