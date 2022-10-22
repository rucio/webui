import { Header } from '../stories/Header/Header'
import { Link, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { StoreContext } from '../App'
import { Card } from '../stories/Card/Card'
import { ProgressBar } from '../stories/ProgressBar/ProgressBar'
import { Button } from '../stories/Button/Button'
import { RucioClient } from '../client'

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
                const RSEData = data?.slice(0, 10)
                const fullRSEDetails = [] as any
                RSEData.forEach((element: any, index: number) => {
                    RucioClient.RSE.getRSEMeta(
                        element?.rse,
                        (response: any) => {
                            const RSEMetaForAccount = response?.filter(
                                (element: any) => element?.account === account,
                            )
                            fullRSEDetails.push(...RSEMetaForAccount)
                            console.error(fullRSEDetails)
                            if (fullRSEDetails.length === RSEData.length) {
                                console.error(fullRSEDetails)
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
                <Card
                    header={
                        <>
                            <br></br>
                            <span className="p-l-25" style={{ fontSize: 30 }}>
                                <strong>Recent Rules</strong>
                            </span>
                            <hr></hr>
                        </>
                    }
                    content={
                        <div style={{ width: 350 }}>
                            {recentRules.map((element: any, index: number) => (
                                <>
                                    <Card
                                        content={
                                            <>
                                                ID:{' '}
                                                {element?.id?.substring(0, 25) +
                                                    '...'}
                                                <hr></hr>
                                                <div className="rucio-flex">
                                                    <Button
                                                        label="View"
                                                        kind="primary"
                                                        type="button"
                                                        size="small"
                                                        onClick={() => {
                                                            navigate(
                                                                `/rule?rule_id=${element?.id}`,
                                                            )
                                                        }}
                                                    ></Button>
                                                    <Button
                                                        label="Delete"
                                                        kind="secondary"
                                                        type="button"
                                                        show="danger"
                                                        size="small"
                                                    ></Button>
                                                </div>
                                            </>
                                        }
                                    ></Card>
                                    <br></br>
                                </>
                            ))}
                        </div>
                    }
                ></Card>
                <Card
                    header={
                        <>
                            <br></br>
                            <span className="p-l-25" style={{ fontSize: 30 }}>
                                <strong>Rucio Storage Elements</strong>
                            </span>
                            <hr></hr>
                        </>
                    }
                    content={
                        <div style={{ width: 350 }}>
                            <Card
                                content={
                                    <>
                                        {recentRSE.map(
                                            (element: any, index: number) => {
                                                const progressValue: number =
                                                    100 - (index + 1) * 10
                                                // element?.used_bytes === -1
                                                //     ? 100
                                                //     : element?.used_bytes ??
                                                //       0

                                                return (
                                                    <div key={index}>
                                                        {element?.rse}
                                                        <ProgressBar
                                                            value={
                                                                progressValue
                                                            }
                                                            type={
                                                                progressValue >
                                                                75
                                                                    ? 'danger'
                                                                    : progressValue >
                                                                      50
                                                                    ? 'warning'
                                                                    : 'info'
                                                            }
                                                        />
                                                        <br></br>
                                                    </div>
                                                )
                                            },
                                        )}
                                    </>
                                }
                            ></Card>
                            <br></br>
                        </div>
                    }
                ></Card>
            </div>
        </>
    )
}

export default Home
