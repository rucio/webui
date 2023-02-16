import './progressbar.scss'

export const ProgressBar = ({
    title = '50%',
    size = 'small',
    type = 'info',
    value = 50,
    max = 100,
    ...props
}: ProgressBarProps) => {
    return (
        <progress
            className={`progress is-${size} is-${type}`}
            max={max}
            value={value}
        >
            {title}
        </progress>
    )
}
