import './textinput.scss'

interface TextInputProps {
    type?: string
    label?: string
    name?: string
    placeholder?: string
    kind?: 'primary' | 'info' | 'link' | 'normal'
    show?: 'danger' | 'warning' | 'success' | 'rounded'
    size?: 'small' | 'medium' | 'large'
    value?: string
    focusByDefault?: boolean
    onChange?: (args: unknown) => void
}

export const TextInput = ({
    type = 'text',
    label = 'Sample label',
    name = 'sample',
    placeholder = 'Sample placeholder',
    size = 'medium',
    kind = 'normal',
    show,
    value,
    focusByDefault = false,
    onChange,
    ...props
}: TextInputProps) => {
    return (
        <label>
            {label}
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                className={`rucio-textinput ${kind} ${size} ${show}`}
                onChange={onChange}
                value={value}
                autoFocus={focusByDefault}
            />
        </label>
    )
}
