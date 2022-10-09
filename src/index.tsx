import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Login from './components/Login'
import Home from './components/Home'
import NotFound from './components/NotFound'
import reportWebVitals from './reportWebVitals'
import { ServiceProvider } from './components/GlobalHooks'
import { RuleDef } from './components/RuleDef'
import { ListRules } from './components/ListRules'
import { element } from 'prop-types'

const pathElementMap: any[] = [
    {
        path: '/home',
        element: <Home />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/ruledef',
        element: <RuleDef />,
    },
    {
        path: '/listrules',
        element: <ListRules />,
    },
    {
        path: '/*',
        element: <NotFound />,
    },
]

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <ServiceProvider>
        <BrowserRouter>
            <Routes>
                {pathElementMap.map(({ path, element }: any) => (
                    <Route path={path} element={element} />
                ))}
            </Routes>
        </BrowserRouter>
    </ServiceProvider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
