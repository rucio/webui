import { Header } from '../stories/Header/Header'
import { useNavigate, useLocation } from 'react-router-dom'

function Home() {
    const navigate = useNavigate()
    const location: any = useLocation()

    async function handleOnClick() {
        navigate('/login')
    }

    return (
        <Header
            onCreateAccount={() => {
                console.log('Account created!')
            }}
            onLogin={() => {
                console.log('User logged in!')
            }}
            onLogout={() => {
                handleOnClick()
            }}
            user={{
                name: location?.state?.name,
            }}
        />
    )
}

export default Home
