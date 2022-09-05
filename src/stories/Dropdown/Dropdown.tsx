import './dropdown.scss'
import React from 'react'

interface DropdownProps {
    label?: string
    options?: Array<string>
    handleChange: (args: any) => void
}

export const Dropdown = ({
    label = '',
    options = [],
    ...props
}: DropdownProps) => {
    return (
        <div className="rucio-dropdown active">
            <div className="dropdown-trigger dropdown-menu">
                <select
                    className="button"
                    aria-haspopup="true"
                    aria-controls="dropdown-menu"
                    onClick={props.handleChange}
                >
                    <option disabled={true} selected={true}>
                        <span>{label}</span>
                        <span className="icon is-small">
                            <p aria-hidden="true"> &#8964;</p>
                        </span>
                    </option>
                    {options.map(element => {
                        return (
                            <option className={'dropdown-item'}>
                                {element}
                            </option>
                        )
                    })}
                </select>
            </div>
        </div>
    )
}
