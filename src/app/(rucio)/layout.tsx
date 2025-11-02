import 'reflect-metadata';
import { Layout } from '@/component-library/pages/Layout';
import { Providers } from './providers';
import { SiteHeaderViewModel } from '@/lib/infrastructure/data/view-model/site-header';
import { getSession } from '@/lib/infrastructure/auth/nextauth-session-utils';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import GetSiteHeaderController, { GetSiteHeaderControllerParameters } from '@/lib/infrastructure/controller/get-site-header-controller';

/**
 * Server component that fetches site header data and provides it to the client layout.
 * This enables server-side data fetching while maintaining client-side React Query for pages.
 * Calls the controller directly instead of making HTTP requests to avoid server-to-server issues.
 */

async function fetchSiteHeader(): Promise<{ data?: SiteHeaderViewModel; error?: Error }> {
    try {
        const session = await getSession();

        // Create a mock IronSession-compatible object for the use case
        const mockSession: any = {
            user: session?.user,
            allUsers: session?.allUsers || [],
        };

        // Capture the response data
        let siteHeaderData: SiteHeaderViewModel | null = null;

        const mockResponse: any = {
            status: () => mockResponse,
            json: (data: any) => {
                siteHeaderData = data;
                return mockResponse;
            },
            send: (data: any) => {
                siteHeaderData = data;
                return mockResponse;
            },
        };

        // Get the controller from IoC container and execute
        const siteHeaderController: GetSiteHeaderController = appContainer.get(CONTROLLERS.GET_SITE_HEADER);

        const controllerParameters: GetSiteHeaderControllerParameters = {
            session: mockSession,
            response: mockResponse,
        };

        await siteHeaderController.execute(controllerParameters);

        if (siteHeaderData) {
            return { data: siteHeaderData };
        }

        return { error: new Error('Failed to retrieve site header') };
    } catch (error) {
        console.error('Error fetching site header in layout:', error);
        return { error: error instanceof Error ? error : new Error('Unknown error fetching site header') };
    }
}

export default async function RucioLayout({ children }: { children: React.ReactNode }) {
    const { data: siteHeader, error: siteHeaderError } = await fetchSiteHeader();

    return (
        <Providers>
            <Layout siteHeader={siteHeader} siteHeaderError={siteHeaderError}>
                {children}
            </Layout>
        </Providers>
    );
}
