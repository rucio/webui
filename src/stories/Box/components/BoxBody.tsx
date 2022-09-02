interface CardBodyProps {
    children?: any
}

export const BoxBody = ({
    children = <h5>body</h5>,
    ...props
}: CardBodyProps) => {
    return <div className="body">{children}</div>
}
