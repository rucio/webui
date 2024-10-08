'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/component-library/outputtailwind.css';
import 'reflect-metadata';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-slate-800 text-sky-400/100">
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </div>
    );
}
