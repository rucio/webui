import React, { ChangeEventHandler } from 'react'
import './checkbox.scss'

interface CheckboxProps {
    isChecked: boolean
    handleChange: ChangeEventHandler
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
    isChecked,
    handleChange,
    ...props
}: CheckboxProps) => {
    return (
        <>
            <input
                className={`rucio-checkradio ${kind} ${size} ${style}`}
                type={type}
                checked={isChecked}
                onChange={handleChange}
            />
            <label>{label}</label>
        </>
    )
}
