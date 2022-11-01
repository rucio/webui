import { render } from '@testing-library/react'
import App from '../App'
import { BrowserRouter } from 'react-router-dom'

window.scrollTo = jest.fn()

test('renders react app', () => {
    render(
        <BrowserRouter>
            <App />
        </BrowserRouter>,
    )
})
