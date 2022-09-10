interface BoxFooterProps {
    children?: any
}

export const BoxFooter = ({
    children = <h5>footer</h5>,
    ...props
}: BoxFooterProps) => {
    return <div className="footer">{children}</div>
}
