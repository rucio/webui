interface BoxFooterProps {
    children?: any
}

export const BoxFooter = ({ children = <h5>footer</h5> }: BoxFooterProps) => {
    return <div className="footer">{children}</div>
}
