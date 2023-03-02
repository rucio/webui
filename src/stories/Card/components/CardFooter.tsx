interface CardFooterProps {
    children?: any
}

export const CardFooter = ({
    children = <h5>footer</h5>,
    ...props
}: CardFooterProps) => {
    return <div className="footer">{children}</div>
}
