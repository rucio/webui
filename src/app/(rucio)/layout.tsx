'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/component-library/outputtailwind.css';
import 'reflect-metadata';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RucioAppLayout } from './rucio-app-layout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={new QueryClient()}>
            <RucioAppLayout>{children}</RucioAppLayout>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
