import './button.scss'

export const Button = ({
    icon = null,
    kind = 'secondary',
    size = 'medium',
    show = 'normal',
    label,
    type = 'button',
    selected = false,
    disabled = false,
    onClick = undefined,
}: ButtonProps) => {
    const handleOnClick = disabled ? undefined : onClick
    return (
        <button
            type={disabled ? 'button' : type}
            tabIndex={0}
            className={['rucio-btn', kind, size, show].join(' ')}
            aria-selected={selected}
            aria-disabled={disabled}
            aria-pressed="false"
            onClick={handleOnClick}
        >
            {icon}
            &nbsp;
            {label}
        </button>
    )
}
