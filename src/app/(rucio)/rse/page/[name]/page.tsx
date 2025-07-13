import { DetailsRSE } from '@/component-library/pages/RSE/details/DetailsRSE';
import { GetRSERequest } from '@/lib/core/usecase-models/get-rse-usecase-models';
import { RSEDetailsViewModel } from '@/lib/infrastructure/data/view-model/rse';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import TUseCaseFactory from '@/lib/sdk/usecase-factory';
import { cookies } from 'next/headers';
import { getRucioAuthToken } from '@/lib/infrastructure/auth/session-utils';
import { MockSignal } from '@/lib/infrastructure/utils/mock-signal';

export default async function Page({ params }: { params: { name: string } }) {
    const { name } = params;
    const usecaseFactory = appContainer.get<TUseCaseFactory<GetRSERequest>>(USECASE_FACTORY.GET_RSE);

    const signal = new MockSignal<RSEDetailsViewModel>();

    const usecase = usecaseFactory(signal);
    const cookieStore = await cookies();
    const token = await getRucioAuthToken(cookieStore);

    await usecase.execute({
        rucioAuthToken: token,
        rseName: name,
    });

    return <DetailsRSE name={params.name} initialMeta={signal.data} />;
}

export const metadata = {
    title: 'RSE - Rucio',
};
