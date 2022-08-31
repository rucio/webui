import { Header } from '../stories/Header/Header'
import { useNavigate, useLocation } from 'react-router-dom'
import { streamData } from '../utils/restApiWrapper'
import { useState } from 'react'

function Home() {
    const navigate = useNavigate()
    const location: any = useLocation()
    const [rulesArray, setRulesArray] = useState([])
    async function handleOnClick() {
        navigate('/login')
    }

    function rules() {
        const rucioToken: string =
            localStorage.getItem('X-Rucio-Auth-Token') || ''
        streamData(
            'rules/',
            {
                'X-Rucio-Auth-Token': rucioToken,
            },
            '',
        ).then((response: any) => {
            console.log(response)
            console.log('YOOYOYOYOOo')
        })
        return <div>{rucioToken}</div>
    }
    return (
        <div>
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
            <div>{rules()}</div>
        </div>
    )
}

export default Home
