import 'reflect-metadata';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/infrastructure/auth/nextauth-session-utils';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import GetSiteHeaderController, { GetSiteHeaderControllerParameters } from '@/lib/infrastructure/controller/get-site-header-controller';
import { SiteHeaderViewModel } from '@/lib/infrastructure/data/view-model/site-header';

/**
 * GET /api/feature/get-site-header
 * Returns site header information including active user and available accounts
 * Uses NextAuth session instead of IronSession
 */
export async function GET() {
    try {
        const session = await getSession();

        // Create a mock IronSession-compatible object for the use case
        // The use case expects IronSession format, so we adapt NextAuth session to it
        const mockSession: any = {
            user: session?.user,
            allUsers: session?.allUsers || [],
        };

        // Capture the response data instead of sending it directly
        let siteHeaderData: SiteHeaderViewModel | null = null;
        let statusCode = 200;

        const mockResponse: any = {
            status: (code: number) => {
                statusCode = code;
                return mockResponse;
            },
            json: (data: any) => {
                siteHeaderData = data;
                return mockResponse;
            },
            send: (data: any) => {
                siteHeaderData = data;
                return mockResponse;
            },
        };

        // Get the controller from IoC container
        const siteHeaderController: GetSiteHeaderController = appContainer.get(CONTROLLERS.GET_SITE_HEADER);

        const controllerParameters: GetSiteHeaderControllerParameters = {
            session: mockSession,
            response: mockResponse,
        };

        await siteHeaderController.execute(controllerParameters);

        if (siteHeaderData) {
            return NextResponse.json(siteHeaderData, { status: statusCode });
        }

        // Fallback if no data was captured
        return NextResponse.json(
            {
                status: 'error',
                error: 'no-data',
                message: 'Failed to retrieve site header',
                code: 500,
            },
            { status: 500 },
        );
    } catch (error) {
        console.error('Error in get-site-header:', error);
        return NextResponse.json(
            {
                status: 'error',
                error: 'internal-server-error',
                message: 'Internal server error',
                code: 500,
            },
            { status: 500 },
        );
    }
}
