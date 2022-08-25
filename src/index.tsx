import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Login from './components/Login'
import Home from './components/Home'
import reportWebVitals from './reportWebVitals'
import { ServiceProvider } from './components/GlobalHooks'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <ServiceProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    </ServiceProvider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
