import { SiteHeaderViewModel } from '@/lib/infrastructure/data/view-model/site-header'

export async function getSiteHeader(): Promise<SiteHeaderViewModel> {
    const res = await fetch('/api/feature/get-site-header')
    return await res.json()
}
