export const H2 = (
    props: {
        children: any,
    }
) => {

    return (
        <h2 className="text-2xl font-extrabold leading-none dark:text-white">
            {props.children}
        </h2>
    )
}