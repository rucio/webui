'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import "@/component-library/outputtailwind.css";
import "reflect-metadata";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Layout as LayoutStory } from '@/component-library/components/Pages/Layout/Layout';


const queryClient = new QueryClient();


export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <LayoutStory
            LVM={{
                accountActive: "test",
                accountsPossible: ["test", "test2"],
                rucioProjectLink: "rucio.cern.ch",
                experimentProjectLink: "atlas.cern",
            }}
        >
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </LayoutStory>
    )
}
