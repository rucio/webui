import { Dashboard } from '@/component-library/pages/Dashboard/Dashboard';

export default function Page() {
    return (
        <main className="min-h-screen bg-neutral-0 dark:bg-neutral-900 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                <header className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Dashboard</h1>
                    <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">Overview of your Rucio activity</p>
                </header>
                <Dashboard />
            </div>
        </main>
    );
}

export const metadata = {
    title: 'Dashboard - Rucio',
};
