import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";

export const DateInput = (
    props: {
        onChange: (date: Date) => void,
        startDate: Date,
        disabled?: boolean,
        placeholder?: string,
        id?: string,
    }
) => {
    const [startDate, setStartDate] = useState<Date>(props.startDate);
    useEffect(() => {
        setStartDate(props.startDate);
    }, [props.startDate]);
    return (
        <div className="w-full">
            <DatePicker
                selected={startDate}
                onChange={(date: Date) => {props.onChange(date); setStartDate(date)}}
                className="w-full border rounded-sm pt-2 px-2 focus focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-2 dark:text-white"
                dateFormat={"yyyy-MM-dd"}
                placeholderText={props.placeholder}
                id={props.id}
            />
        </div>
    );
}