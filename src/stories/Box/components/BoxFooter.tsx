interface CardFooterProps {
    children?: any
}

export const BoxFooter = ({
    children = <h5>footer</h5>,
    ...props
}: CardFooterProps) => {
    return <div className="footer">{children}</div>
}
