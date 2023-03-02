import { render } from '@testing-library/react'
import Home from '../../components/Home'
import { BrowserRouter } from 'react-router-dom'

test('renders Home Page', () => {
    render(
        <BrowserRouter>
            <Home />
        </BrowserRouter>,
    )
})
