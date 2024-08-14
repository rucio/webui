'use client';
import { ListRSE as ListRSEStory } from "@/component-library/Pages/RSE/ListRSE";
import { RSEViewModel } from "@/lib/infrastructure/data/view-model/rse";
import useComDOM from "@/lib/infrastructure/hooks/useComDOM";
import { HTTPRequest } from "@/lib/sdk/http";
import { mockUseComDOM, fixtureRSEViewModel } from "test/fixtures/table-fixtures";
export default function Page() {

    const setRSEQuery = async (rseExpression: string) => {
        await RSESearchComDOM.setRequest({
            url: new URL(`${window.location.protocol}//${window.location.host}/api/feature/list-rses`),
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
            } as HeadersInit),
            params: {
                "rseExpression": rseExpression
            },
        } as HTTPRequest)
    }

    const RSESearchComDOM = useComDOM<RSEViewModel>(
        'list-rse-query',
        [],
        false,
        Infinity,
        200,
        true
    )

    return (
        <ListRSEStory
            comdom={RSESearchComDOM}
            setRSEQuery={setRSEQuery}
        />
    )
}
            