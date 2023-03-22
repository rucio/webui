export const H3 = (
    props: {
        children: any,
    }
) => {

    return (
        <h3 className="text-xl font-extrabold leading-none dark:text-white">
            {props.children}
        </h3>
    )
}