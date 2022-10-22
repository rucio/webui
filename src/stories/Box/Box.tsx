import './box.scss'

export const Box = ({
    title = 'Sample Box',
    type = 'spacious',
    children,
}: BoxProps) => {
    return (
        <div className={`rucio-box ${type}`}>
            <div className="header">
                <h3 className="title">{title}</h3>
            </div>
            {children}
        </div>
    )
}
