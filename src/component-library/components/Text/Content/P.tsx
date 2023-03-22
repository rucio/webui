import {twMerge} from 'tailwind-merge'

export const P = (
    props: {
        children: any,
        mono?: boolean,
        className?: string
    }
) => {

    const classes = twMerge(`
        dark:text-white
        ${props.mono ? "font-mono" : ""}
        ${props.className ?? ""}
    `)

    return (
        <p className={classes}>
            {props.children}
        </p>
    )
}