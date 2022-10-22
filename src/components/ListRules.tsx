import { useEffect, useState } from 'react'
import { Link, NavigateFunction, useNavigate } from 'react-router-dom'
import { RucioClient } from '../client'
import { Button } from '../stories/Button/Button'
import { Card } from '../stories/Card/Card'
import { Dropdown } from '../stories/Dropdown/Dropdown'
import { Header } from '../stories/Header/Header'
import { Input } from '../stories/Input/Input'
import { Table } from '../stories/Table/Table'

export const ListRules = () => {
    const [rulesArray, setRulesArray] = useState([] as any[])
    const navigate: NavigateFunction = useNavigate()
    function rules() {
        RucioClient.Rules.get(
            {
                account: 'root',
                activity: 'User Subscriptions',
            },
            (data: any) => {
                const rowData = data
                    ?.reverse()
                    ?.map((element: any) => [
                        <Link to={`/rule?rule_id=${element?.id}`}>
                            {`${element?.scope}:${element?.name}`}
                        </Link>,
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

    useEffect(() => {
        rules()
    }, [])

    return (
        <div className="rule-def">
            <Header user={{ name: 'root' }} />
            <br></br>
            <Card
                header={
                    <>
                        <br></br>
                        <span className="p-l-25" style={{ fontSize: 35 }}>
                            <strong>Rules</strong>
                        </span>
                        <span className="p-r-25" style={{ float: 'right' }}>
                            <Button
                                label="New request"
                                kind="primary"
                                size="large"
                                onClick={() => {
                                    navigate('/ruledef')
                                }}
                            />
                        </span>
                    </>
                }
                content={
                    <div className="m-b-50">
                        <div className="rucio-flex">
                            <Input
                                label="Account"
                                placeholder="root"
                                size="medium"
                            />
                            <Input label="RSE" placeholder="RSE" />
                            <div className="m-t-30">
                                <Dropdown
                                    label="State"
                                    handleChange={args => args}
                                />
                            </div>
                            <Input
                                label="Activity"
                                placeholder="User Subscriptions"
                            />
                            <Input label="Interval" placeholder="14" />
                            <div className="m-t-30">
                                <Dropdown
                                    label="Period"
                                    handleChange={args => args}
                                />
                            </div>
                        </div>
                        <br></br>
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

                        <div style={{ float: 'left' }}>
                            <Button
                                label="Select all"
                                kind="outline"
                                size="large"
                            />
                        </div>
                        <div style={{ float: 'right' }}>
                            <Button
                                label="Delete Rule"
                                kind="outline"
                                show="danger"
                                size="large"
                            />
                        </div>
                    </div>
                }
            ></Card>
        </div>
    )
}
