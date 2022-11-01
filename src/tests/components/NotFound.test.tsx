import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import NotFound from '../../components/NotFound'

test('renders Not found Page', () => {
    render(
        <BrowserRouter>
            <NotFound />
        </BrowserRouter>,
    )
})
