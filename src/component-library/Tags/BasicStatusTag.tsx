import { useEffect, useState } from "react"

export type BasicStatusTagProps = {
    text: string
    status: 'success' | 'error' | 'warning' | 'info'
}
export const BasicStatusTag: React.FC<JSX.IntrinsicElements["span"] & { 
    text: string, status: 'success' | 'error' | 'warning' | 'info'
}> = (
    {
        text = 'Check this out!',
        status,
        ...props
    } : BasicStatusTagProps
) => {

    const colorFn = (status: 'success' | 'error' | 'warning' | 'info') => {
        switch(status) {
            case "success":
                return 'bg-teal-300 dark:bg-teal-600'
            case "error":
                return 'bg-red-300 dark:bg-red-600'
            case "warning":
                return 'bg-yellow-300 dark:bg-yellow-600'
            case "info":
                return 'bg-blue-300 dark:bg-blue-600'
            default:
                return 'bg-teal-300 dark:bg-teal-600'
        }
    }
    const [color, setColor] = useState<string>()
    useEffect(() => {
        setColor(colorFn(status))
    }, [status])
    return (
        <span key={status}
            className={`${color} text-black dark:text-white font-bold w-6 md:w-24 rounded text-center select-none flex justify-center items-center`}
        >
            {text}
        </span>
    )
}