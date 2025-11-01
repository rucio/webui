import './globals.css';
import 'reflect-metadata';
import { ThemeProvider } from 'next-themes';
import { AgGridSetup } from '@/lib/ag-grid-setup';
import { SessionProvider } from '@/lib/infrastructure/auth/session-provider';
import { inter, jetbrainsMono } from './fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
                <AgGridSetup />
                <SessionProvider>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                        {children}
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
