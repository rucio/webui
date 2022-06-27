import React from 'react'
import './textinput.css'

interface TextInputProps {
    primary?: boolean
    size?: 'small' | 'medium' | 'large'
    label: string
    placeholder: string
    onChange?: () => void
}

export const TextInput = ({
    primary = false,
    size = 'medium',
    label,
    placeholder,
    onChange,
    ...props
}: TextInputProps) => {
    const mode = primary
        ? 'rucio-textinput--primary'
        : 'rucio-textinput--secondary'
    return (
        <div>
            <div className="p-t-31 p-b-9">
                <span className="txt1">{label}</span>
            </div>
            <div
                className="wrap-input100 validate-input"
                data-validate="Username is required"
            >
                <input
                    type="text"
                    name="username"
                    placeholder={placeholder}
                    className={[
                        'rucio-textinput',
                        `rucio-textinput--${size}`,
                        mode,
                        { ...props },
                    ].join(' ')}
                    onChange={onChange}
                />
            </div>
        </div>
    )
}
