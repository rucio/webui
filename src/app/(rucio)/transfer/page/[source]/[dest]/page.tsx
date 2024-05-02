import { ListTransfer as ListTransferStory } from "@/component-library/Pages/Transfers/ListTransfer";
import { TransferViewModel } from "@/lib/infrastructure/data/view-model/request";
import useComDOM from "@/lib/infrastructure/hooks/useComDOM";

export default function Page({ params }: { params: { source: string, dest: string }}) {
    const TransferSearchComDOM = useComDOM<TransferViewModel>(
        'list-transfer-query',
        [],
        false,
        Infinity,
        200,
        true
    )
    TransferSearchComDOM.setRequest({
        url: new URL(`${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/list-transfers`),
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json'
        } as HeadersInit),
        params: {
            "sourceRSE": params.source,
            "destRSE": params.dest
        }
    })
    return (
        <ListTransferStory
            comdom={TransferSearchComDOM}
        />
    )
}