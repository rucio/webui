import { ReactNode } from 'react'
import './button.scss'

interface ButtonProps {
    icon?: ReactNode | null
    kind?: 'primary' | 'secondary' | 'outline'
    show?: 'danger' | 'block' | 'invisible'
    background?: string
    size?: 'small' | 'medium' | 'large'
    label: string
    type?: 'button' | 'submit' | 'reset' | undefined
    selected?: boolean
    disabled?: boolean
    onClick?: (args: unknown) => any
}

export const Button = ({
    icon = null,
    kind = 'secondary',
    size = 'medium',
    show,
    background,
    label,
    type = 'button',
    selected = false,
    disabled = false,
    onClick = undefined,
    ...props
}: ButtonProps) => {
    const handleOnClick = disabled ? undefined : onClick
    return (
        <button
            type={disabled ? 'button' : type}
            tabIndex={0}
            className={['rucio-btn', kind, size, show].join(' ')}
            style={{ background }}
            aria-selected={selected}
            aria-disabled={disabled}
            aria-pressed="false"
            onClick={handleOnClick}
            {...props}
        >
            {icon}
            &nbsp;
            {label}
        </button>
    )
}
