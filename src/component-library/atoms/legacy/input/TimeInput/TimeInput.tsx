import React, { useState, useEffect } from 'react';
import { cn } from '@/component-library/utils';
import { HiClock } from 'react-icons/hi2';

type TimeInputProps = React.ComponentPropsWithoutRef<'div'> & {
    onchange: (time: string) => void; // communicate back to parent (HH:MM:SS format)
    initialtime?: string; // the current value, set by the parent (HH:MM:SS format)
    disabled?: boolean;
    placeholder?: string;
    showSeconds?: boolean; // whether to show seconds input
};

export const TimeInput: React.FC<TimeInputProps> = ({
    onchange: onChange,
    initialtime,
    disabled = false,
    placeholder = 'Select time',
    showSeconds = true,
    ...props
}) => {
    const [chosentime, setChosentime] = useState<string>(initialtime || '');
    const { className, id, ...otherprops } = props;

    useEffect(() => {
        setChosentime(initialtime || '');
    }, [initialtime]);

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setChosentime(value);

        // Convert to HH:MM:SS format if showSeconds is true and only HH:MM was provided
        if (showSeconds && value && value.split(':').length === 2) {
            onChange(`${value}:00`);
        } else {
            onChange(value);
        }
    };

    return (
        <div className="w-full relative">
            <div className="relative">
                <input
                    type="time"
                    step={showSeconds ? '1' : undefined}
                    id={id}
                    value={chosentime}
                    onChange={handleTimeChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={cn(
                        // Base styles
                        'flex w-full rounded-md',
                        'border border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10',
                        'px-3 py-2 h-10',
                        'pr-10', // Extra padding for icon
                        // Background colors (design system tokens)
                        'bg-neutral-100 dark:bg-neutral-800',
                        // Text colors (WCAG AAA compliant)
                        'text-neutral-900 dark:text-neutral-100',
                        'placeholder:text-neutral-500',
                        // Focus states (brand colors)
                        'focus:ring-0 focus:outline-none',
                        'focus:shadow-brand focus:border-brand-500',
                        'dark:focus:border-brand-500',
                        // Transitions
                        'transition-colors',
                        // Disabled state
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        className ?? '',
                    )}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <HiClock className="h-5 w-5 text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
                </div>
            </div>
        </div>
    );
};
