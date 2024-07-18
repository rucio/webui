import { SiteHeaderViewModel } from '@/lib/infrastructure/data/view-model/site-header'

export async function getSiteHeader(): Promise<SiteHeaderViewModel> {
    const req: any = {
        method: 'GET',
        url: new URL(
            `${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/get-site-header`,
        ),
        headers: {
            'Content-Type': 'application/json',
        },
        params: {},
    }

    const res = await fetch(req.url, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
        } as HeadersInit),
    })

    return await res.json()
}
