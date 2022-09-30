import './input.scss'

interface InputProps {
    type?: string
    label?: string
    name?: string
    placeholder?: string
    kind?: 'primary' | 'info' | 'link' | 'normal'
    show?: 'danger' | 'warning' | 'success' | 'rounded'
    size?: 'small' | 'medium' | 'large'
    value?: any
    min?: number
    max?: number
    focusByDefault?: boolean
    onChange?: (args: any) => void
}

export const Input = ({
    type = 'text',
    label = 'Sample label',
    name = 'sample',
    placeholder = 'Sample placeholder',
    size = 'medium',
    kind = 'normal',
    show,
    value,
    focusByDefault = false,
    min,
    max,
    onChange,
    ...props
}: InputProps) => {
    return (
        <label>
            {label}
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                className={`rucio-input ${kind} ${size} ${show}`}
                onChange={onChange}
                value={value}
                autoFocus={focusByDefault}
                min={min}
                max={max}
            ></input>
        </label>
    )
}
