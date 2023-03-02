import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ListRules } from '../../components/ListRules'

test('renders List Rules', () => {
    render(
        <BrowserRouter>
            <ListRules />
        </BrowserRouter>,
    )
})
