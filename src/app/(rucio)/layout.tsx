'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'reflect-metadata';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Layout } from '@/component-library/pages/Layout';
import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={new QueryClient()}>
            <Layout>{children}</Layout>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
