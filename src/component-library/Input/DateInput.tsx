import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { twMerge } from "tailwind-merge";

type DateInputProps = JSX.IntrinsicElements["div"] & {
    onchange: (date: Date) => void, // communicate back to parent
    initialdate?: Date, // the current value, set by the parent
    disabled?: boolean,
    placeholder?: string,
}

export const DateInput: React.FC<DateInputProps> = (
    {
        onchange: onChange,
        initialdate,
        disabled = false,
        placeholder = "Select a date",
        ...props
    }
) => {
    const [chosendate, setChosendate] = useState<Date | undefined>(initialdate);
    const { className, id, ...otherprops } = props
    useEffect(() => {
        setChosendate(initialdate);
    }, [initialdate]);
    return (
        <div className="w-full">
            <DatePicker
                selected={chosendate}
                onChange={(date: Date) => {onChange(date); setChosendate(date)}}
                className={twMerge(
                    "w-full border rounded-sm pt-2 px-2",
                    "bg-neutral-100 dark:bg-neutral-800 dark:border-2 dark:text-text-0 text-text-1000",
                    className ?? ""
                )}
                dateFormat={"yyyy-MM-dd"}
                placeholderText={placeholder}
                id={id}
            />
        </div>
    );
}