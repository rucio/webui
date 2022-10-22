import './dropdown.scss'

import { useState } from 'react'

export const Dropdown = ({
    label = '',
    options = [],
    ...props
}: DropdownProps) => {
    const [isActive, setActive] = useState(false)
    const [selectedlabel, setSelectedLabel] = useState(label)
    return (
        <div className={isActive ? 'rucio-dropdown active' : 'rucio-dropdown'}>
            <div className="dropdown-trigger">
                <button
                    className="button"
                    aria-haspopup="true"
                    aria-controls="dropdown-menu"
                    onClick={() => {
                        setActive(!isActive)
                    }}
                >
                    <span>{selectedlabel}</span>
                    <span className="icon is-small">
                        <p>&#9660;</p>
                    </span>
                </button>
            </div>
            <div
                className="dropdown-menu"
                id="dropdown-menu"
                role="menu"
                onClick={(event: any) => {
                    setActive(false)
                    setSelectedLabel(event?.target?.value)
                    props?.handleChange?.(event)
                }}
            >
                <div className="dropdown-content">
                    {options.map((element: any, index: number) => (
                        <option
                            className={'dropdown-item'}
                            value={element}
                            key={index}
                        >
                            {element}
                        </option>
                    ))}
                </div>
            </div>
        </div>
    )
}
