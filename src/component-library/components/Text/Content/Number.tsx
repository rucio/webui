export const Number = (
    props: {
        number: number,
        decimalPlaces?: number,
    }
) => {
    if (!+props.number) return <span className="text-red-500 text-bold">NaN</span> 

    const base = 1000
    const dm = props.decimalPlaces ?? 1
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(props.number) / Math.log(base))

    return <span>{`${parseFloat((props.number/ Math.pow(base, i)).toFixed(dm))} ${sizes[i]}`}</span>
}