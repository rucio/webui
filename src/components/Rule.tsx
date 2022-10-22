import { useEffect, useState } from 'react'
import { RucioClient } from '../client'
import { Card } from '../stories/Card/Card'
import { Header } from '../stories/Header/Header'
import { Table } from '../stories/Table/Table'
import { useAlert } from './GlobalHooks'

export const Rule = () => {
    const [selectedData, setSelectedData] = useState([] as any[])
    const showAlert: (options: AlertProps) => Promise<void> = useAlert()
    function rule() {
        const urlSearchParams = new URLSearchParams(window?.location?.search)
        const params = Object.fromEntries(urlSearchParams.entries())
        console.error(params?.['rule_id'])
        RucioClient.Rules.meta(
            params?.['rule_id'],
            data => {
                console.error('Data', data)
                let selectedData: any = Object.entries(data as any).filter(
                    ([_, v]) => v != null,
                )
                selectedData = selectedData.sort((a: any, b: any) =>
                    a?.[0].localeCompare(b?.[0]),
                )
                setSelectedData(selectedData)
            },
            (error: any) => {
                showAlert({
                    message: 'Something went wrong, please try again.',
                    variant: 'warn',
                })
            },
        )
    }

    useEffect(() => {
        rule()
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
                            <strong>Rule Metadata</strong>
                        </span>
                    </>
                }
                content={
                    <div className="m-b-50">
                        <Table
                            id="rule"
                            rows={selectedData}
                            columns={['Sl no.', 'Attribute', 'Value']}
                            footer={['Sl no.', 'Attribute', 'Value']}
                        />
                    </div>
                }
            ></Card>
        </div>
    )
}
