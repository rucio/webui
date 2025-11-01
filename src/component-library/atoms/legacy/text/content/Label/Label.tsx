export const Label = (props: { children: any; label: string }) => {
    return (
        <label htmlFor={props.label} className="dark:text-neutral-0 text-neutral-1000">
            {props.children}
        </label>
    );
};
