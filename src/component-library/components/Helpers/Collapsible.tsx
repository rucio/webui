export const Collapsible = (props: {showIf: boolean, id?: string, children: any,}) => {
    // why hidden instead of collapse (apparently collapsed only removes space on table objects) ? i am confused
    return (
        <div className={props.showIf ? "" : "hidden"} data-testid={props.id? props.id: undefined }>
            {props.children}
        </div>
    )
}