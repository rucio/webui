export const Label = (
    props: {
        children: any,
        label: string
    }
) => {
    
        return (
            <label
                htmlFor={props.label}
                className="dark:text-white"
            >
                {props.children}
            </label>
        )
    }