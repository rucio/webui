import './form.scss'
import { Button } from '../Button/Button'

interface FormProps {
    title?: string
    subtitle?: string
    children?: any
    onSubmit?: (args: any) => void
}

export const Form = ({
    title = 'Sample form',
    subtitle = 'Please fill in the details',
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
                    size="medium"
                    type="submit"
                    kind="primary"
                />
            </div>
        </div>
    ),
    onSubmit = () => {
        alert('form submitted')
    },
    ...props
}: FormProps) => {
    return (
        <form className="rucio-form" onSubmit={onSubmit}>
            <h1 className="title">{title}</h1>
            <p className="subtitle">{subtitle}</p>
            {children}
        </form>
    )
}
