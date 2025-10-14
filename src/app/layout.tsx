// import './globals.css'
import '../component-library/outputtailwind.css';
import 'reflect-metadata';
import { ThemeProvider } from 'next-themes';
import { AgGridSetup } from '@/lib/ag-grid-setup';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
            <head>
                <link rel="icon" href="/logo192.png" sizes="any" />
            </head>
            <body>
                <AgGridSetup />
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
