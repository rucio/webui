import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateInput.css';
import { cn } from '@/component-library/utils';

type DateInputProps = React.ComponentPropsWithoutRef<'div'> & {
    onchange: (date: Date) => void; // communicate back to parent
    initialdate?: Date; // the current value, set by the parent
    disabled?: boolean;
    placeholder?: string;
};

export const DateInput: React.FC<DateInputProps> = ({
    onchange: onChange,
    initialdate,
    disabled = false,
    placeholder = 'Select a date',
    ...props
}) => {
    const [chosendate, setChosendate] = useState<Date | undefined>(initialdate);
    const { className, id, ...otherprops } = props;
    useEffect(() => {
        setChosendate(initialdate);
    }, [initialdate]);
    return (
        <div className="w-full relative">
            <DatePicker
                selected={chosendate}
                onChange={(date: Date | null) => {
                    if (date) {
                        onChange(date);
                        setChosendate(date);
                    }
                }}
                className={cn(
                    // Base styles
                    'flex w-full rounded-md',
                    'border border-neutral-900 dark:border-neutral-100 border-opacity-10 dark:border-opacity-10',
                    'px-3 py-2 h-10',
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
                dateFormat={'yyyy-MM-dd'}
                placeholderText={placeholder}
                disabled={disabled}
                id={id}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                popperPlacement="bottom-start"
            />
        </div>
    );
};
