export const Collapsible = (props: {showIf: boolean, children: any}) => {
    return (
        <div className={props.showIf ? "" : "collapse"}>
            {props.children}
        </div>
    )
}