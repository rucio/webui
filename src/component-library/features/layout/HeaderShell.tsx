import { HeaderClient } from './HeaderClient';
import { SiteHeaderViewModel } from '@/lib/infrastructure/data/view-model/site-header';

/**
 * Server component wrapper for the Header that fetches site header data.
 * This component is rendered on the server and passes data to the client HeaderClient component.
 */

async function fetchSiteHeader(): Promise<{ data?: SiteHeaderViewModel; error?: Error }> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_WEBUI_HOST || 'http://localhost:3000';
        const url = `${baseUrl}/api/feature/get-site-header`;

        const res = await fetch(url, {
            // Prevent caching to always get fresh data
            cache: 'no-store',
        });

        if (!res.ok) {
            return { error: new Error(`Failed to fetch site header: ${res.statusText}`) };
        }

        const json = await res.json();
        return { data: json as SiteHeaderViewModel };
    } catch (error) {
        return { error: error instanceof Error ? error : new Error('Unknown error fetching site header') };
    }
}

export async function HeaderShell() {
    const { data: siteHeader, error } = await fetchSiteHeader();

    return <HeaderClient siteHeader={siteHeader} siteHeaderError={error} isSiteHeaderFetching={false} />;
}
