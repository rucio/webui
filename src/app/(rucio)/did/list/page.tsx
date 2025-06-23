import { ListDID } from '@/component-library/pages/DID/list/ListDID';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port';

export default async function Page({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
    const envGateway: EnvConfigGatewayOutputPort = appContainer.get(GATEWAYS.ENV_CONFIG);
    let firstPattern: string | undefined = await envGateway.listDIDsInitialPattern();

    const searchPattern = searchParams?.['pattern'];

    if (typeof searchPattern === 'string') {
        firstPattern = searchPattern;
    }
    // TODO: fetch initial data
    return <ListDID firstPattern={firstPattern ?? undefined} />;
}

export const metadata = {
    title: 'DIDs List - Rucio',
};
