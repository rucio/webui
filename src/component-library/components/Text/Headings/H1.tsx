export const H1 = (
    props: {
        children: any,
    }
) => {

    return (
        <h1 className="text-4xl font-extrabold leading-none dark:text-white">
            {props.children}
        </h1>
    )
}