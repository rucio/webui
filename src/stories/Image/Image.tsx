import React from 'react'
import './image.css'

interface ImageProps {
    src?: string
}

export const Image = ({ src = '', ...props }: ImageProps) => {
    return <img className="rucio-image" src={src} {...props}></img>
}
