import './input.scss'

export const Input = ({
    type = 'text',
    label,
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
    width,
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
                style={{ width }}
            ></input>
        </label>
    )
}
