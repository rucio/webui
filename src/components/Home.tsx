import { Header } from '../stories/Header/Header'
import { useNavigate, useLocation, Location } from 'react-router-dom'
import { streamData } from '../utils/restApiWrapper'
import { useState, useEffect } from 'react'
import { RuleModel } from '../utils/models'

function Home() {
    const navigate = useNavigate()
    const location: Location | any = useLocation()
    const [rulesArray, setRulesArray] = useState([] as RuleModel[])

    useEffect(() => {
        rules()
    }, [])

    function updateRulesArray(newRulesArray: RuleModel[]) {
        setRulesArray(prevRulesArray => [...prevRulesArray, ...newRulesArray])
    }

    async function handleOnClick() {
        navigate('/login')
    }

    function rules() {
        // will undergo change
        const rucioToken: string =
            sessionStorage.getItem('X-Rucio-Auth-Token') || ''

        streamData('/rules', {
            'X-Rucio-Auth-Token': rucioToken,
        }).then((data: any) => {
            const rules = [] as RuleModel[]
            for (const rule of data) {
                const ruleObj = new RuleModel(rule['id'])
                rules.push(ruleObj)
            }
            updateRulesArray(rules)
        })
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
            {rulesArray.map((rule: RuleModel) => {
                return <p>{rule.rule_id}</p>
            })}
        </>
    )
}

export default Home
