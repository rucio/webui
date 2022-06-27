import React from 'react'
import './button.css'

interface ButtonProps {
    primary?: boolean
    backgroundColor?: string
    size?: 'small' | 'medium' | 'large'
    label: string
    onClick?: () => void
}

export const Button = ({
    primary = false,
    size = 'medium',
    backgroundColor,
    label,
    ...props
}: ButtonProps) => {
    const mode = primary ? 'rucio-button--primary' : 'rucio-button--secondary'
    return (
        <button
            type="button"
            className={['rucio-button', `rucio-button--${size}`, mode].join(
                ' ',
            )}
            style={{ backgroundColor }}
            {...props}
        >
            {label}
        </button>
    )
}
