import { render } from '@testing-library/react'
import { ErrorBoundaryWrapper } from '../../components/ErrorBoundary'
import { BrowserRouter } from 'react-router-dom'

test('renders Error Boundary Page', () => {
    render(
        <BrowserRouter>
            <ErrorBoundaryWrapper />
        </BrowserRouter>,
    )
})
