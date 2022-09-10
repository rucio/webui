interface BoxBodyProps {
    children?: any
}

export const BoxBody = ({
    children = <h5>body</h5>,
    ...props
}: BoxBodyProps) => {
    return <div className="body">{children}</div>
}
