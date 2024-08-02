'use client';
import { Loading } from "@/component-library/Pages/Helpers/Loading";
import { PageRSE as PageRSEStory } from "@/component-library/Pages/RSE/PageRSE";
import { RSEBlockState } from "@/lib/core/entity/rucio";
import { RSEAttributeViewModel, RSEProtocolViewModel, RSEViewModel } from "@/lib/infrastructure/data/view-model/rse";
import { useEffect, useState } from "react";
import { getAttributes, getProtocols, getRSE } from "../../queries";

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
