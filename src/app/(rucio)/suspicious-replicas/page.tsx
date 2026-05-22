import { getSessionUser } from '@/lib/infrastructure/auth/nextauth-session-utils';
import { Role } from '@/lib/core/entity/auth-models';
import { redirect } from 'next/navigation';
import { ListSuspiciousReplicas } from '@/component-library/pages/Replica/suspicious/ListSuspiciousReplicas';

export default async function Page() {
    const user = await getSessionUser();

    if (!user || !user.isLoggedIn) {
        redirect('/');
    }

    if (user.role !== Role.ADMIN) {
        redirect('/');
    }

    return (
        <main className="min-h-screen bg-neutral-0 dark:bg-neutral-900 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                <header className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Suspicious Replicas</h1>
                    <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
                        Monitor files with suspicious replica states across storage elements
                    </p>
                </header>
                <section aria-label="Suspicious Replicas Filter and Results">
                    <ListSuspiciousReplicas />
                </section>
            </div>
        </main>
    );
}

export const metadata = {
    title: 'Suspicious Replicas - Rucio',
};
