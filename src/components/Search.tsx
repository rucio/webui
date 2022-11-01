import { useEffect, useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { RucioClient } from '../client'
import { Button } from '../stories/Button/Button'
import { Card } from '../stories/Card/Card'
import { Header } from '../stories/Header/Header'
import { Table } from '../stories/Table/Table'
import { extract_scope } from '../util'
import { useAlert } from './GlobalHooks'

export const Search = () => {
    const [selectedData, setSelectedData] = useState([] as any[])

    const showAlert: (options: AlertProps) => Promise<void> = useAlert()
    const navigate: NavigateFunction = useNavigate()

    const search = () => {
        const urlSearchParams = new URLSearchParams(window?.location?.search)
        const params = Object.fromEntries(urlSearchParams?.entries())
        const [scope, name] = extract_scope(params?.pattern?.trim())

        RucioClient.DID.search(
            scope ?? '',
            name ?? '',
            'collection',
            //onSuccess
            (dids: any) => {
                if (dids && dids?.length > 0) {
                    setSelectedData(
                        dids.map((element: any) => [
                            scope + ':' + element?.id,
                            <Button
                                label="More info"
                                kind="outline"
                                onClick={() => {
                                    navigate(
                                        `/did?scope=${scope}&name=${element?.id}`,
                                    )
                                }}
                            ></Button>,
                        ]),
                    )
                } else {
                    showAlert({
                        message: 'No matching DID entries were found.',
                        variant: 'warn',
                    })
                }
            },
            //onError
            (error: any) => {
                showAlert({
                    message: 'Something went wrong, please try again.',
                    variant: 'warn',
                })
            },
        )
    }

    useEffect(() => {
        search()
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
                            <strong>Search</strong>
                        </span>
                    </>
                }
                content={
                    <div className="m-b-50">
                        <Table
                            id="didsearch"
                            columns={['Sl No.', 'DID', '']}
                            rows={selectedData}
                            footer={['Sl No.', 'DID', '']}
                        />
                    </div>
                }
            ></Card>
        </div>
    )
}
