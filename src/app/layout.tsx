import './globals.css';
import 'reflect-metadata';
import { ThemeProvider } from 'next-themes';
import { AgGridSetup } from '@/lib/ag-grid-setup';
import { SessionProvider } from '@/lib/infrastructure/auth/session-provider';
import { inter, jetbrainsMono } from './fonts';
import { AnimatedBackground } from '@/component-library/atoms/branding/AnimatedBackground';
import { connection } from 'next/server';
import { getRuntimeConfig } from '@/lib/infrastructure/config/runtime-config';
import { RuntimeConfigProvider } from '@/lib/infrastructure/config/runtime-config-provider';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    // Render at request time so configuration comes from the running container, not from the build
    await connection();
    const runtimeConfig = getRuntimeConfig();

    return (
        <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
            {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
            <head>
                <link rel="icon" href="/logo192.png" sizes="any" />
            </head>
            <body>
                <AnimatedBackground />
                <AgGridSetup />
                <RuntimeConfigProvider config={runtimeConfig}>
                    <SessionProvider>
                        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                            {children}
                        </ThemeProvider>
                    </SessionProvider>
                </RuntimeConfigProvider>
            </body>
        </html>
    );
}
