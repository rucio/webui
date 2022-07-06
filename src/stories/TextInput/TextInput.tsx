import './textinput.scss'

interface TextInputProps {
    type?: string
    label?: string
    name?: string
    placeholder?: string
    kind?: 'primary' | 'info' | 'link'
    show?: 'danger' | 'warning' | 'success' | 'rounded'
    size?: 'small' | 'medium' | 'large' | 'normal'
    value?: string
    onChange?: (args: any) => void
}

export const TextInput = ({
    type = 'text',
    label = 'Sample label',
    name = 'sample',
    placeholder = 'Sample placeholder',
    size = 'normal',
    kind = 'primary',
    show,
    value,
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
            />
        </label>
    )
}
