import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/infrastructure/auth/nextauth-session-utils';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import LoginConfigController, { LoginConfigControllerParams } from '@/lib/infrastructure/controller/login-config-controller';
import { LoginViewModel } from '@/lib/infrastructure/data/view-model/login';

/**
 * GET /api/auth/login
 * Checks if user is logged in and redirects accordingly
 */
export async function GET(request: NextRequest) {
    const session = await getSession();
    const isLoggedIn = session?.user?.isLoggedIn ?? false;

    if (isLoggedIn) {
        // If user is logged in, redirect to callbackUrl or dashboard
        const searchParams = request.nextUrl.searchParams;
        const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
        return NextResponse.redirect(new URL(callbackUrl, request.url));
    }

    // If user is not logged in, redirect to login page
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl') || '/dashboard';
    return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`, request.url));
}

/**
 * POST /api/auth/login
 * Returns login configuration (VOs, auth methods, etc.)
 * Uses a custom presenter to work with App Router instead of Pages Router
 */
export async function POST(request: NextRequest) {
    const session = await getSession();

    // Create a custom presenter for App Router
    let loginViewModel: LoginViewModel | null = null;
    let hasError = false;

    const appRouterPresenter = {
        presentSuccess: (response: any) => {
            loginViewModel = {
                ...response,
                isLoggedIn: session?.user?.isLoggedIn ?? false,
                accountActive: session?.user?.rucioAccount,
                accountsAvailable: session?.allUsers?.map(u => u.rucioAccount),
                status: 'success' as const,
            };
        },
        presentError: (error: any) => {
            console.error('Login config error:', error);
            hasError = true;
            loginViewModel = {
                ...error,
                isLoggedIn: false,
                accountActive: undefined,
                accountsAvailable: undefined,
                status: 'error' as const,
                message: error.message || 'Failed to load login configuration',
                rucioAuthHost: process.env.RUCIO_HOST || '',
            };
        },
    };

    try {
        // Get the controller from IoC container
        const loginConfigController: LoginConfigController = appContainer.get<BaseController<LoginConfigControllerParams, void>>(
            CONTROLLERS.LOGIN_CONFIG,
        );

        // Since the controller expects a session and response, we need to create a mock response
        // that will capture the data instead of sending it directly
        const mockResponse: any = {
            status: () => mockResponse,
            json: (data: any) => {
                if (hasError) {
                    loginViewModel = data;
                } else {
                    loginViewModel = {
                        ...data,
                        isLoggedIn: session?.user?.isLoggedIn ?? false,
                        accountActive: session?.user?.rucioAccount,
                        accountsAvailable: session?.allUsers?.map(u => u.rucioAccount),
                        status: 'success' as const,
                    };
                }
                return mockResponse;
            },
            send: (data: any) => {
                loginViewModel = data;
                return mockResponse;
            },
        };

        // Create a mock session object compatible with the controller
        const mockSession: any = {
            user: session?.user,
            allUsers: session?.allUsers || [],
        };

        await loginConfigController.execute({
            session: mockSession,
            response: mockResponse,
        });

        if (loginViewModel) {
            return NextResponse.json(loginViewModel);
        }

        // Fallback if presenter wasn't called
        return NextResponse.json(
            {
                isLoggedIn: false,
                accountActive: undefined,
                accountsAvailable: undefined,
                status: 'error',
                message: 'Failed to load login configuration',
                rucioAuthHost: process.env.RUCIO_HOST || '',
            } as LoginViewModel,
            { status: 500 },
        );
    } catch (error) {
        console.error('Error in login config:', error);
        return NextResponse.json(
            {
                isLoggedIn: false,
                accountActive: undefined,
                accountsAvailable: undefined,
                status: 'error',
                message: 'Internal server error',
                rucioAuthHost: process.env.RUCIO_HOST || '',
            } as LoginViewModel,
            { status: 500 },
        );
    }
}
