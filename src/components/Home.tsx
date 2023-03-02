import { Header } from '../stories/Header/Header'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { StoreContext } from '../App'
import { Card } from '../stories/Card/Card'
import { ProgressBar } from '../stories/ProgressBar/ProgressBar'
import { RucioClient } from '../client'
import { Box } from '../stories/Box/Box'

function Home() {
    const navigate = useNavigate()
    const [recentRules, setRecentRulesArray] = useState([] as any)
    const [recentRSE, setRecentRSEArray] = useState([] as any)
    const { store } = React.useContext(StoreContext) as any

    const account = store?.account ?? sessionStorage.getItem('X-Rucio-Account')

    async function handleOnClick() {
        navigate('/ruledef')
    }

    const getRecentRules = () => {
        RucioClient.Rules.get(
            {
                account,
                activity: 'User Subscriptions',
            },
            (data: any) => {
                const ruleData = data?.reverse()?.slice(0, 5)
                setRecentRulesArray(ruleData)
            },
            (error: any) => {
                console.error('Error', error)
            },
        )
    }

    const getRSEQuota = () => {
        RucioClient.RSE.listRses(
            '*',
            (data: any) => {
                const RSEData = data?.slice(0, 5)
                const fullRSEDetails = [] as any
                RSEData.forEach((element: any) => {
                    RucioClient.RSE.getRSEMeta(
                        element?.rse,
                        (response: any) => {
                            const RSEMetaForAccount = response?.filter(
                                (element: any) => element?.account === account,
                            )
                            fullRSEDetails.push(...RSEMetaForAccount)
                            if (fullRSEDetails.length === RSEData.length) {
                                setRecentRSEArray(fullRSEDetails)
                            }
                        },
                    )
                })
            },
            (error: unknown) => {
                console.error('Error', error)
            },
        )
    }

    useEffect(() => {
        setTimeout(() => {
            getRecentRules()
            getRSEQuota()
        }, 0)
    }, [])

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
                    name: account,
                }}
                menuActive
                menuCollapsible={false}
            />
            <br></br>
            <div
                className="rucio-flex"
                style={{
                    marginLeft: 400,
                    width: '70%',
                }}
            >
                <Box title="Recent Rules" type="spacious">
                    <div style={{ width: 380 }}>
                        {recentRules.map((element: any, index: number) => (
                            <div className="m-t-20" key={index}>
                                <Card
                                    content={<>ID: {element?.id}</>}
                                    onCardClick={() => {
                                        navigate(`/rule?rule_id=${element?.id}`)
                                    }}
                                    hoverable
                                ></Card>
                            </div>
                        ))}
                    </div>
                </Box>

                <Box title="Rucio Storage Elements" type="spacious">
                    <div style={{ width: 380 }}>
                        <>
                            {recentRSE.map((element: any, index: number) => {
                                const progressValue: number =
                                    100 - (index + 1) * 10
                                // element?.used_bytes === -1
                                //     ? 100
                                //     : element?.used_bytes ?? 0

                                return (
                                    <div className="m-t-20" key={index}>
                                        <Card
                                            content={
                                                <div key={index}>
                                                    {element?.rse}
                                                    <ProgressBar
                                                        value={progressValue}
                                                        type={
                                                            progressValue > 75
                                                                ? 'danger'
                                                                : progressValue >
                                                                  50
                                                                ? 'warning'
                                                                : 'success'
                                                        }
                                                    />
                                                </div>
                                            }
                                            hoverable
                                        ></Card>
                                    </div>
                                )
                            })}
                        </>
                    </div>
                </Box>
            </div>
        </>
    )
}

export default Home
