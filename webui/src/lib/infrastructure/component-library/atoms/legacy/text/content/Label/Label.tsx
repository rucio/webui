export const Label = (props: { children: any; label: string }) => {
    return (
        <label htmlFor={props.label} className="dark:text-text-0 text-text-1000">
            {props.children}
        </label>
    );
};
