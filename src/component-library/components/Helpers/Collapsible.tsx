export const Collapsible = (props: {show: boolean, children: any}) => {
    return (
        <div className={props.show ? "" : "collapse"}>
            {props.children}
        </div>
    )
}