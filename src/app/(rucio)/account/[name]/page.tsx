import { notFound } from 'next/navigation';
import { GetAccountInfoRequest } from '@/lib/core/usecase-models/get-account-info-usecase-models';
import { AccountInfoViewModel } from '@/lib/infrastructure/data/view-model/account';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import TUseCaseFactory from '@/lib/sdk/usecase-factory';
import { getRucioAuthToken } from '@/lib/infrastructure/auth/nextauth-session-utils';
import { MockSignal } from '@/lib/infrastructure/utils/mock-signal';
import { requireFeature } from '@/lib/infrastructure/feature-flags/require-feature';
import { requireSelfOrAdmin } from '@/lib/infrastructure/auth/require-admin';
import { isValidAccountName } from '@/lib/core/utils/account-validation';
import { DetailsAccountClient } from './DetailsAccountClient';

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;
    await requireFeature('accounts');
    const account = decodeURIComponent(name);
    // Rucio account names are restricted; anything else cannot exist (and is never sent to Rucio).
    if (!isValidAccountName(account)) notFound();
    const user = await requireSelfOrAdmin(account);

    // Server prefetch (rse/[name]/page.tsx pattern) so the status is known at hydration: no client waterfall.
    const signal = new MockSignal<AccountInfoViewModel>();
    const usecase = appContainer.get<TUseCaseFactory<GetAccountInfoRequest>>(USECASE_FACTORY.GET_ACCOUNT_INFO)(signal);
    await usecase.execute({ rucioAuthToken: await getRucioAuthToken(), account });
    if (signal.data?.status !== 'success' && signal.data?.errorType === 'not_found') notFound();

    return (
        <main className="min-h-screen bg-neutral-0 dark:bg-neutral-900 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                <section aria-label="Account details">
                    <DetailsAccountClient
                        account={account}
                        sessionAccount={user.rucioAccount}
                        initialInfo={signal.data}
                        initialInfoUpdatedAt={Date.now()}
                    />
                </section>
            </div>
        </main>
    );
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;
    return { title: `Account ${decodeURIComponent(name)} - Rucio` };
}
