import { useEffect, useState } from 'react'
import { RucioClient } from '../client'
import { Card } from '../stories/Card/Card'
import { Header } from '../stories/Header/Header'
import { Table } from '../stories/Table/Table'
import { useAlert } from './GlobalHooks'

export const DID = () => {
    const [selectedData, setSelectedData] = useState([] as any[])
    const showAlert: (options: AlertProps) => Promise<void> = useAlert()
    function dids() {
        const urlSearchParams = new URLSearchParams(window?.location?.search)
        const params = Object.fromEntries(urlSearchParams?.entries())

        RucioClient.DID.meta(
            params?.scope,
            params?.name,
            //onSuccess
            data => {
                let selectedData: any = Object.entries(data as []).filter(
                    ([_, v]) => v != null,
                )
                selectedData = selectedData.sort((a: [string], b: [string]) =>
                    a?.[0].localeCompare(b?.[0]),
                )
                setSelectedData(selectedData)
            },
            //onError
            () => {
                showAlert({
                    message: 'Something went wrong, please try again.',
                    variant: 'warn',
                })
            },
        )
    }

    useEffect(() => {
        dids()
    }, [])

    return (
        <div className="rule-def">
            <Header />
            <br></br>
            <Card
                header={
                    <>
                        <br></br>
                        <span className="p-l-25" style={{ fontSize: 35 }}>
                            <strong>DID Metadata</strong>
                        </span>
                    </>
                }
                content={
                    <div className="m-b-50">
                        <Table
                            id="dids"
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
