import { Header } from '../stories/Header/Header'
import { useNavigate, useLocation, Location } from 'react-router-dom'
import { streamData } from '../utils/restApiWrapper'
import { useState, useEffect } from 'react'

class Rule {
    id: string
    constructor(id: string) {
        this.id = id
    }
}
function Home() {
    const navigate = useNavigate()
    const location: Location | any = useLocation()
    const [rulesArray, setRulesArray] = useState([] as Rule[])

    useEffect(() => {
        rules()
    }, [])

    function updateRulesArray(newRulesArray: Rule[]) {
        setRulesArray(prevRulesArray => [...prevRulesArray, ...newRulesArray])
    }

    async function handleOnClick() {
        navigate('/login')
    }

    function rules() {
        const rucioToken: string =
            sessionStorage.getItem('X-Rucio-Auth-Token') || ''

        streamData('rules/', {
            'X-Rucio-Auth-Token': rucioToken,
        }).then((data: any) => {
            const rules = [] as Rule[]
            for (const rule of data) {
                const ruleObj = new Rule(rule['id'])
                rules.push(ruleObj)
            }
            updateRulesArray(rules)
        })
        return <div>{rucioToken}</div>
    }
    return (
        <>
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
            {rulesArray.map((rule: Rule) => {
                return <p>{rule.id}</p>
            })}
        </>
    )
}

export default Home
