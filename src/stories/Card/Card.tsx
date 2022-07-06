import './card.scss'

interface CardProps {
    title?: string
    type?: 'condensed' | 'spacious' | 'blue' | 'danger'
    background?: string
    children?: any
}

export const Card = ({
    title = 'Sample Card',
    background,
    type = 'spacious',
    children,
    ...props
}: CardProps) => {
    return (
        <div
            className={`rucio-card ${type}`}
            style={{ backgroundColor: background }}
        >
            <div className="header">
                <h3 className="title">{title}</h3>
            </div>
            {children}
        </div>
    )
}
