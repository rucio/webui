import React from 'react'
import './card.css'

interface CardProps {
    backgroundColor?: string
    onClick?: () => void
}

export const Card = ({ backgroundColor, ...props }: CardProps) => {
    return (
        <div
            className="rucio-card"
            style={{ backgroundColor }}
            {...props}
        ></div>
    )
}
