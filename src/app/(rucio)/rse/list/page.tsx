import { ListRSE } from '@/component-library/pages/RSE/list/ListRSE';

export default async function Page({ searchParams }: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
    let firstExpression: string | undefined = undefined;
    const resolvedSearchParams = await searchParams;
    const searchExpression = resolvedSearchParams?.['expression'];
    const autoSearch = resolvedSearchParams?.['autoSearch'] === 'true';

    if (typeof searchExpression === 'string') {
        firstExpression = searchExpression;
    }
    // TODO: fetch initial data

    return (
        <main className="min-h-screen bg-neutral-0 dark:bg-neutral-900 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                <header className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                        Rucio Storage Elements
                    </h1>
                    <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
                        Search and browse storage elements using RSE expressions
                    </p>
                </header>
                <section aria-label="RSE Search and Results">
                    <ListRSE initialExpression={firstExpression ?? undefined} autoSearch={autoSearch} />
                </section>
            </div>
        </main>
    );
}

export const metadata = {
    title: 'RSEs List - Rucio',
};
