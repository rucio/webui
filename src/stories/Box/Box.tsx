import './box.scss'

interface BoxProps {
    title?: string
    type?: 'condensed' | 'spacious' | 'blue' | 'danger'
    background?: string
    children?: any
}

export const Box = ({
    title = 'Sample Card',
    background,
    type = 'spacious',
    children,
    ...props
}: BoxProps) => {
    return (
        <div
            className={`rucio-box ${type}`}
            style={{ backgroundColor: background }}
        >
            <div className="header">
                <h3 className="title">{title}</h3>
            </div>
            {children}
        </div>
    )
}
