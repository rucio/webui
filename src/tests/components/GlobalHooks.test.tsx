import { render } from '@testing-library/react'
import { ServiceProvider } from '../../components/GlobalHooks'
import { BrowserRouter } from 'react-router-dom'

window.scrollTo = jest.fn()

test('renders Global Hooks wrapper', () => {
    render(
        <BrowserRouter>
            <ServiceProvider />
        </BrowserRouter>,
    )
})
