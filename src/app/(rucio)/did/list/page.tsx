import { ListDID } from '@/component-library/pages/DID/list/ListDID';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port';
import { DIDType } from '@/lib/core/entity/rucio';

export default async function Page({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
    const envGateway: EnvConfigGatewayOutputPort = appContainer.get(GATEWAYS.ENV_CONFIG);
    let firstPattern: string | undefined = await envGateway.listDIDsInitialPattern();

    const searchPattern = searchParams?.['pattern'];
    const autoSearch = searchParams?.['autoSearch'] === 'true';

    // Handle type query parameter
    const searchType = searchParams?.['type'];
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
    return <ListDID firstPattern={firstPattern ?? undefined} autoSearch={autoSearch} initialType={initialType} />;
}

export const metadata = {
    title: 'DIDs List - Rucio',
};
