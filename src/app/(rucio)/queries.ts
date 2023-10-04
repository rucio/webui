import { SiteHeaderViewModel } from '@/lib/infrastructure/data/view-model/site-header'
import { HTTPRequest, prepareRequestArgs } from '@/lib/sdk/http'

export async function getSiteHeader(): Promise<SiteHeaderViewModel> {
    const req: HTTPRequest = {
        method: 'GET',
        url: new URL(
            `${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/get-site-header`,
        ),
        headers: {
            'Content-Type': 'application/json',
        },
        params: {},
    }

    const { url, requestArgs } = prepareRequestArgs(req)
    const res = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
        } as HeadersInit),
    })

    return await res.json()
}
