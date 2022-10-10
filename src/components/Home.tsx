import { Header } from '../stories/Header/Header'
import { useNavigate, useLocation, Location } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { RucioClient } from '../client'
import { Table } from '../stories/Table/Table'

function Home() {
    const navigate = useNavigate()
    const location: Location | any = useLocation()
    const [rulesArray, setRulesArray] = useState([] as any[])

    useEffect(() => {
        rules()
    }, [])

    async function handleOnClick() {
        navigate('/login')
    }

    function rules() {
        RucioClient.Rules.get(
            {
                account: 'root',
                activity: 'User Subscriptions',
            },
            (data: any) => {
                const rowData = data
                    .reverse()
                    ?.map((element: any) => [
                        `${element?.scope}:${element?.name}`,
                        element?.account,
                        element?.rse_expression,
                        element?.created_at,
                        '-',
                        element?.state,
                        element?.locks_ok_cnt,
                        element?.locks_replicating_cnt,
                        element?.locks_stuck_cnt,
                    ])
                setRulesArray(rowData)
            },
            (error: any) => {
                console.error('Error', error)
            },
        )
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
            <br></br>
            <div className="m-l-100 m-r-100">
                <Table
                    columns={[
                        '',
                        'Name',
                        'Account',
                        'RSE Expression',
                        'Creation Date',
                        'Remaining Lifetime',
                        'State',
                        'Locks OK',
                        'Locks Replicating',
                        'Locks Stuck',
                    ]}
                    footer={[
                        '',
                        'Name',
                        'Account',
                        'RSE Expression',
                        'Creation Date',
                        'Remaining Lifetime',
                        'State',
                        'Locks OK',
                        'Locks Replicating',
                        'Locks Stuck',
                    ]}
                    rows={rulesArray}
                />
            </div>
        </>
    )
}

export default Home
