import './toggleswitch.scss'

import { useState } from 'react'

export const ToggleSwitch = ({
    label = '',
    kind = 'success',
    size = 'normal',
    style = 'rounded',
    checked = false,
    handleChange = args => args,
}: ToggleSwitchProps) => {
    const [checkedState, setCheckedState] = useState(checked)
    return (
        <div
            onClick={(event: any) => {
                setCheckedState(!checkedState)
                handleChange?.(event)
            }}
        >
            <input
                className={`rucio-switch ${kind} ${size} ${style}`}
                type="checkbox"
                checked={checkedState}
                onChange={handleChange}
            />
            <label>{label}</label>
        </div>
    )
}
