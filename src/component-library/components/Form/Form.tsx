import './form.scss'

import { useEffect } from 'react'

import { Button } from '../Button/Button'

export const Form = ({
    title = 'Title',
    subtitle = 'Subtitle',
    children = (
        <div>
            <div className="field">
                <div className="control">
                    <input className="input" type="text" placeholder="Input" />
                </div>
            </div>

            <div className="field">
                <p className="control">
                    <span className="select">
                        <select>
                            <option>Select dropdown</option>
                        </select>
                    </span>
                </p>
            </div>

            <div className="buttons">
                <Button
                    label="Submit"
                    type="submit"
                />
            </div>
        </div>
    ),
    onSubmit = () => {
        alert('form submitted')
    },
}: FormProps) => {
    useEffect(() => {
        const formElements: any = document.getElementsByClassName('rucio-form')
        Array.from(formElements).forEach((formElement: any) => {
            formElement.onkeydown = () => {
                const keyboardEvent = window?.event as KeyboardEvent
                if (keyboardEvent?.key === 'Enter') {
                    onSubmit(keyboardEvent)
                }
            }
        })
    })

    return (
        <form className="rucio-form" onSubmit={onSubmit}>
            <h1 className="title">{title}</h1>
            <p className="subtitle">{subtitle}</p>
            {children}
        </form>
    )
}
