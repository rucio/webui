'use client';
import { Loading } from "@/component-library/Pages/Helpers/Loading";
import { PageRSE as PageRSEStory } from "@/component-library/Pages/RSE/PageRSE";
import { RSEBlockState } from "@/lib/core/entity/rucio";
import { RSEAttributeViewModel, RSEProtocolViewModel, RSEViewModel } from "@/lib/infrastructure/data/view-model/rse";
import { useEffect, useState } from "react";

async function getRSE(rseName: string): Promise<RSEViewModel> {
    const url = `${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/get-rse?` + new URLSearchParams({rseName})
    const res = await fetch(url)
    return await res.json()
}

async function getProtocols(rseName: string): Promise<RSEProtocolViewModel> {
    const url = `${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/get-rse-protocols?` + new URLSearchParams({rseName})
    const res = await fetch(url)
    return await res.json()
}

async function getAttributes(rseName:string): Promise<RSEAttributeViewModel> {
    const url = `${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/get-rse-attributes?` + new URLSearchParams({rseName})
    const res = await fetch(url)
    return await res.json()
}

export default function Page({ params }: { params: { name: string } }) {
    const [rse, setRSE] = useState<RSEViewModel>({status: "pending"} as RSEViewModel)
    const [protocols, setProtocols] = useState<RSEProtocolViewModel>({status: "pending"} as RSEProtocolViewModel)
    const [attributes, setAttributes] = useState<RSEAttributeViewModel>({status: "pending"} as RSEAttributeViewModel)
    useEffect(() => {
        getRSE(params.name).then(setRSE)
    }, [params.name])
    useEffect(() => {
        getProtocols(params.name).then(setProtocols)
    }, [params.name])
    useEffect(() => {
        getAttributes(params.name).then(setAttributes)
    }, [params.name])
    if (rse.status === "pending" || protocols.status === "pending" || attributes.status === "pending") {
        return <Loading title="View RSE" subtitle={`For RSE ${params.name}`}/>
    }
    return (
        <PageRSEStory
            rse={rse}
            rseblockstate={0 as RSEBlockState}
            protocols={protocols}
            attributes={attributes}
        />
    )
}
