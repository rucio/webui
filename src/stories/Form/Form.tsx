import React from 'react'
import './form.css'

interface FormProps {
    title: string
    onSubmit?: () => void
}

export const Form = ({ title, ...props }: FormProps) => {
    return (
        <div>
            <div className="rucio-form-title">{title}</div>
            <form className="rucio-form" {...props}></form>
        </div>
    )
}
