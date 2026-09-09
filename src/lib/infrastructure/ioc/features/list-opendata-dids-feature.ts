import ListOpenDataDIDsUseCase from '@/lib/core/use-case/list-opendata-dids-usecase';
import {
    ListOpenDataDIDsError,
    ListOpenDataDIDsRequest,
    ListOpenDataDIDsResponse,
} from '@/lib/core/usecase-models/list-opendata-dids-usecase-models';
import { BaseFeature } from '@/lib/sdk/ioc-helpers';
import { FeatureKey } from '@/lib/core/entity/feature-config';
import { Container } from 'inversify';
import ListOpenDataDIDsController, { ListOpenDataDIDsControllerParameters } from '../../controller/list-opendata-dids-controller';
import ListOpenDataDIDsPresenter, { ListOpenDataDIDsViewModel } from '@/lib/infrastructure/presenter/list-opendata-dids-presenter';
import CONTROLLERS from '../ioc-symbols-controllers';
import GATEWAYS from '../ioc-symbols-gateway';
import INPUT_PORT from '../ioc-symbols-input-port';
import USECASE_FACTORY from '../ioc-symbols-usecase-factory';

export default class ListOpenDataDIDsFeature extends BaseFeature<
    ListOpenDataDIDsControllerParameters,
    ListOpenDataDIDsRequest,
    ListOpenDataDIDsResponse,
    ListOpenDataDIDsError,
    ListOpenDataDIDsViewModel,
    FeatureKey
> {
    constructor(appContainer: Container) {
        const gateway = appContainer.get(GATEWAYS.OPENDATA);

        const symbols = {
            CONTROLLER: CONTROLLERS.LIST_OPENDATA_DIDS,
            USECASE_FACTORY: USECASE_FACTORY.LIST_OPENDATA_DIDS,
            INPUT_PORT: INPUT_PORT.LIST_OPENDATA_DIDS,
        };

        super(
            'ListOpenDataDIDs',
            ListOpenDataDIDsController,
            ListOpenDataDIDsUseCase,
            [gateway],
            ListOpenDataDIDsPresenter,
            false,
            symbols,
            'opendata',
        );
    }
}
