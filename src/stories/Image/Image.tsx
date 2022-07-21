import './image.scss'

interface ImageProps {
    src?: string
    type?: string
    height?: number
    width?: number
}

export const Image = ({
    src = 'https://placehold.jp/60x60.png',
    type,
    height = 60,
    width = 60,
    ...props
}: ImageProps) => {
    return (
        <img
            className={`rucio-image ${type}`}
            src={src}
            height={height}
            width={width}
            {...props}
        ></img>
    )
}
