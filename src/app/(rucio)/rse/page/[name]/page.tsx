import { DetailsRSE } from '@/component-library/pages/RSE/details/DetailsRSE';
import { GetRSERequest } from '@/lib/core/usecase-models/get-rse-usecase-models';
import { RSEDetailsViewModel } from '@/lib/infrastructure/data/view-model/rse';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import TUseCaseFactory from '@/lib/sdk/usecase-factory';
import { getRucioAuthToken } from '@/lib/infrastructure/auth/nextauth-session-utils';
import { MockSignal } from '@/lib/infrastructure/utils/mock-signal';

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;
    const usecaseFactory = appContainer.get<TUseCaseFactory<GetRSERequest>>(USECASE_FACTORY.GET_RSE);

    const signal = new MockSignal<RSEDetailsViewModel>();

    const usecase = usecaseFactory(signal);
    const token = await getRucioAuthToken();

    await usecase.execute({
        rucioAuthToken: token,
        rseName: name,
    });

    return <DetailsRSE name={name} initialMeta={signal.data} />;
}

export const metadata = {
    title: 'RSE - Rucio',
};
