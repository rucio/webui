import './checkbox.scss'

import { useState } from 'react'

export const Checkbox = ({
    label = '',
    type = 'checkbox',
    size,
    kind,
    style,
    isChecked = false,
    name,
    handleChange,
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
                name={name}
            />
            <label>{label}</label>
        </div>
    )
}
