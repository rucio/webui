import { useState } from 'react'
import './toggleswitch.scss'

interface ToggleSwitchProps {
    label?: string
    kind?: 'danger' | 'warning' | 'success' | 'info'
    size?: 'small' | 'normal' | 'medium' | 'large'
    style?: 'rounded' | 'outlined'
    checked?: boolean
    handleChange?: (event: any) => void
}

export const ToggleSwitch = ({
    label = '',
    kind = 'success',
    size = 'normal',
    style = 'rounded',
    checked = false,
    handleChange = args => args,
    ...props
}: ToggleSwitchProps) => {
    const [checkedState, setCheckedState] = useState(checked)
    return (
        <div
            onClick={(event: any) => {
                setCheckedState(!checkedState)
                handleChange(event)
            }}
        >
            <input
                className={`rucio-switch ${kind} ${size} ${style}`}
                type="checkbox"
                checked={checkedState}
            />
            <label>{label}</label>
        </div>
    )
}
