import { DateInput } from "@/component-library/Input/DateInput"
import { NumInput } from "@/component-library/Input/NumInput"
import { type } from "@testing-library/user-event/dist/types/utility"
import { useState } from "react"
import { twMerge } from "tailwind-merge"

type LifetimeWithExpirationDateInputProps = {
    onChange(date: Date, lifetime: number): void, // communicate back to parent
    initialdate?: Date, // the current value, set by the parent
    disabled?: boolean,
    placeholder?: string,
}
export const LifetimeWithExpirationDateInput: React.FC<LifetimeWithExpirationDateInputProps> = (
    {
        onChange,
        initialdate,
        disabled = false,
        placeholder = "Select a date",
    }: LifetimeWithExpirationDateInputProps) => {
    const calculateLifetimeInDays = (date: Date) => {
        const currentDate = new Date()
        const diffInTime = date.getTime() - currentDate.getTime()
        const diffInDays = diffInTime / (1000 * 3600 * 24)
        return Math.ceil(diffInDays)
    }
    const calculateDateFromLifetime = (lifetime: number) => {
        const currentDate = new Date()
        const newDate = new Date(currentDate.getTime() + lifetime * 24 * 60 * 60 * 1000)
        return newDate
    }
    const [lifetimeInDays, setLifetimeInDays] = useState<number>(() => {
        if (initialdate) {
            return calculateLifetimeInDays(initialdate)
        }
        return 0
    })
    const [date, setDate] = useState<Date | undefined>(initialdate)
    const onDateChange = (date: Date) => {
        console.log(date)
        const newLifetime = calculateLifetimeInDays(date)
        setLifetimeInDays(newLifetime)
    }
    return (
        <div className={twMerge(
            "p-2 space-y-4",
            "rounded-md border",
            "dark:border-2",
            "bg-white dark:bg-gray-800"
        )}
        >
            <div className="flex flex-col space-y-2">
                <span className="text-xl dark:text-white">Lifetime (days)</span>
                <NumInput
                    value={lifetimeInDays}
                    onChange={(event) => {
                        const value = event.target.value
                        if(value === undefined || value === null) {
                            return
                        }
                        if(value === "") {
                            setLifetimeInDays(0)
                            setDate(new Date())
                            return
                        }
                        if(typeof value === "string") {
                            try {
                                const intValue = parseInt(value)
                                setLifetimeInDays(intValue)
                                const newDate = calculateDateFromLifetime(parseInt(value))
                                setDate(newDate)
                            } catch (error) {
                                console.error(error)
                            }
                        }
                    }}
                />
            </div>
            <div className="flex flex-col space-y-2">
                <span className="text-xl dark:text-white">Expiry Date</span>
                <DateInput onchange={onDateChange} initialdate={date} disabled={disabled} placeholder={placeholder} />
            </div>
        </div>
    )
} 