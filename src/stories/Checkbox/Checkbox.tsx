import { useState } from 'react'
import './checkbox.scss'

interface CheckboxProps {
    isChecked?: boolean
    handleChange?: (args: any) => void
    label: string
    kind?: 'danger' | 'warning' | 'success' | 'info'
    size?: 'small' | 'normal' | 'medium' | 'large'
    style?: 'rounded_checkbox' | 'block' | 'no_border' | 'background-color'
    type?: 'checkbox' | 'radio'
}

export const Checkbox = ({
    label = '',
    type = 'checkbox',
    size,
    kind,
    style,
    isChecked = false,
    handleChange,
    ...props
}: CheckboxProps) => {
    const [checked, setChecked] = useState(isChecked)
    return (
        <div
            onClick={(event: any) => {
                setChecked(!checked)
                handleChange?.(event)
            }}
        >
            <input
                className={`rucio-checkradio ${type} ${size} ${kind} ${style}`}
                type={type}
                checked={checked}
                onChange={args => args}
            />
            <label>{label}</label>
        </div>
    )
}
