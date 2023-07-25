import { useEffect } from 'react'
import { HiXCircle } from 'react-icons/hi2'
import { twMerge } from "tailwind-merge"

interface AlertProps {
    id?: string | undefined
    message?: string | any
    variant?: 'primary' | 'warn' | 'success' | 'error'
    onClose?: () => void
}

export const Alert = ({
    id = undefined,
    message = 'Welcome to Rucio!',
    variant = 'primary',
    onClose = () => { },
}: AlertProps) => {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }, [])
    return (
        <div 
            className={twMerge(
                "px-4 py-3 border-l-4",
                variant === "primary" ? "bg-blue-100 border-blue-500 text-blue-700" : "",
                variant === "warn" ? "bg-orange-100 border-orange-500 text-orange-700" : "",
                variant === "success" ? "bg-green-100 border-green-500 text-green-700" : "",
                variant === "error" ? "bg-red-100 border-red-500 text-red-700" : "",
                "flex flex-row justify-between items-center",
            )}
        >
            <span className="block sm:inline" data-testid={id}>{message}</span>
            <button
                aria-label="Close"
                onClick={onClose}
                data-testid={id ? `${id}-close-button` : undefined}
            >
                <HiXCircle className="text-2xl" />
            </button>
        </div>
    )
}