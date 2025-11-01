import { ListDID } from '@/component-library/pages/DID/list/ListDID';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port';
import { DIDType } from '@/lib/core/entity/rucio';

export default async function Page({ searchParams }: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const envGateway: EnvConfigGatewayOutputPort = appContainer.get(GATEWAYS.ENV_CONFIG);
    let firstPattern: string | undefined = await envGateway.listDIDsInitialPattern();

    const resolvedSearchParams = await searchParams;
    const searchPattern = resolvedSearchParams?.['pattern'];
    const autoSearch = resolvedSearchParams?.['autoSearch'] === 'true';

    // Handle type query parameter
    const searchType = resolvedSearchParams?.['type'];
    let initialType: DIDType | undefined;
    if (typeof searchType === 'string') {
        // Map string values to DIDType enum
        const typeMap: Record<string, DIDType> = {
            'file': DIDType.FILE,
            'dataset': DIDType.DATASET,
            'container': DIDType.CONTAINER,
        };
        initialType = typeMap[searchType.toLowerCase()];
    }

    if (typeof searchPattern === 'string') {
        firstPattern = searchPattern;
    }
    // TODO: fetch initial data
    return (
        <main className=" bg-neutral-0 dark:bg-neutral-900 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                <header className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                        Data Identifiers
                    </h1>
                    <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
                        Search and browse datasets, containers, and files in Rucio
                    </p>
                </header>
                <section aria-label="DID Search and Results">
                    <ListDID firstPattern={firstPattern ?? undefined} autoSearch={autoSearch} initialType={initialType} />
                </section>
            </div>
        </main>
    );
}

export const metadata = {
    title: 'DIDs List - Rucio',
};
