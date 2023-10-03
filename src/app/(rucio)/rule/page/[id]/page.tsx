'use client';
import { PageRule as PageRuleStory } from "@/component-library/Pages/Rule/PageRule";
import { fixtureRuleMetaViewModel } from "test/fixtures/table-fixtures";
import { useState, useEffect } from "react";
import useComDOM from "@/lib/infrastructure/hooks/useComDOM";
import { HTTPRequest } from "@/lib/sdk/http";
import { RuleMetaViewModel, RulePageLockEntryViewModel } from "@/lib/infrastructure/data/view-model/rule";

export default function PageRule({ params }: { params: { id: string } }) {
    const comDOM = useComDOM<RulePageLockEntryViewModel>(
        "rule-page-lock-query",
        [],
        false,
        Infinity,
        50,
        true
    )
    const [meta, setMeta] = useState<RuleMetaViewModel>({} as RuleMetaViewModel)
    useEffect(() => {
        setMeta({...fixtureRuleMetaViewModel(), id: params.id})
    }, [])
    useEffect(() => {
        const runQuery = async () => {
            const request: HTTPRequest = {
                url: new URL(`${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/rulepagelockentry`),
                method: "GET",
                headers: new Headers({
                    'Content-Type': 'application/json'
                } as HeadersInit),
                body: null,
            }
            await comDOM.setRequest(request)
        }
        runQuery()
    }, [])
    return (
        <PageRuleStory
            ruleMeta={meta}
            ruleLocks={comDOM}
            ruleBoostFunc={() => {console.log("boost not implemented")}}
        />
    )
}
