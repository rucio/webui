export const Collapsible = (props: {showIf: boolean, id?: string, children: any,}) => {
    return (
        <div className={props.showIf ? "" : "collapse"} data-testid={props.id? props.id: undefined }>
            {props.children}
        </div>
    )
}