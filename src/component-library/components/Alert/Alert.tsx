import { useEffect } from 'react'

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
    var closeIcon = (
        <button
            className="flash-close js-flash-close"
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{ marginLeft: 'auto' }}
            data-testid={id ? `${id}-close-button` : undefined}
        >
            <svg
                className="octicon octicon-x"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-5 -5 30 30"
                width="30"
                height="30"
            >
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.72 3.72C3.86062 3.57955 4.05125 3.50066 4.25 3.50066C4.44875 3.50066 4.63937 3.57955 4.78 3.72L8 6.94L11.22 3.72C11.2887 3.64631 11.3715 3.58721 11.4635 3.54622C11.5555 3.50523 11.6548 3.48319 11.7555 3.48141C11.8562 3.47963 11.9562 3.49816 12.0496 3.53588C12.143 3.5736 12.2278 3.62974 12.299 3.70096C12.3703 3.77218 12.4264 3.85702 12.4641 3.9504C12.5018 4.04379 12.5204 4.14382 12.5186 4.24452C12.5168 4.34523 12.4948 4.44454 12.4538 4.53654C12.4128 4.62854 12.3537 4.71134 12.28 4.78L9.06 8L12.28 11.22C12.3537 11.2887 12.4128 11.3715 12.4538 11.4635C12.4948 11.5555 12.5168 11.6548 12.5186 11.7555C12.5204 11.8562 12.5018 11.9562 12.4641 12.0496C12.4264 12.143 12.3703 12.2278 12.299 12.299C12.2278 12.3703 12.143 12.4264 12.0496 12.4641C11.9562 12.5018 11.8562 12.5204 11.7555 12.5186C11.6548 12.5168 11.5555 12.4948 11.4635 12.4538C11.3715 12.4128 11.2887 12.3537 11.22 12.28L8 9.06L4.78 12.28C4.63782 12.4125 4.44977 12.4846 4.25547 12.4812C4.06117 12.4777 3.87579 12.399 3.73837 12.2616C3.60096 12.1242 3.52225 11.9388 3.51882 11.7445C3.51539 11.5502 3.58752 11.3622 3.72 11.22L6.94 8L3.72 4.78C3.57955 4.63938 3.50066 4.44875 3.50066 4.25C3.50066 4.05125 3.57955 3.86063 3.72 3.72Z"
                ></path>
            </svg>
        </button>
    )
    var divClasses: string[] = ["px-4", "py-3", "relative", "border-l-4"]
    switch (variant) {
        case "primary":
            divClasses.push("bg-blue-100", "border-blue-500", "text-blue-700");
            break;
        case "warn":
            divClasses.push("bg-orange-100", "border-orange-500", "text-orange-700");
            break;
        case "success":
            divClasses.push("bg-green-100", "border-green-500", "text-green-700");
            break;
        case "error":
            divClasses.push("bg-red-100", "border-red-500", "text-red-700");
            break;

    }

    return (
        <div className={divClasses.join(" ")}>
            <span className="block sm:inline" data-testid={id}>{message}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">{closeIcon}</span>
        </div>
    )
}