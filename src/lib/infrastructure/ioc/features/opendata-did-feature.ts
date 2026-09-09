import { OpenDataDIDInputPort } from '@/lib/core/port/primary/opendata-did-ports';
import OpenDataDIDUseCase from '@/lib/core/use-case/opendata-did-usecase';
import { OpenDataDIDError, OpenDataDIDRequest, OpenDataDIDResponse } from '@/lib/core/usecase-models/opendata-did-usecase-models';

import { BaseFeature } from '@/lib/sdk/ioc-helpers';
import { FeatureKey } from '@/lib/core/entity/feature-config';
import { Container } from 'inversify';

import OpenDataDIDController, { OpenDataDIDControllerParameters } from '../../controller/opendata-did-controller';

import OpenDataDIDPresenter, { OpenDataDIDViewModel } from '@/lib/infrastructure/presenter/opendata-did-presenter';

import CONTROLLERS from '../ioc-symbols-controllers';
import GATEWAYS from '../ioc-symbols-gateway';
import INPUT_PORT from '../ioc-symbols-input-port';
import USECASE_FACTORY from '../ioc-symbols-usecase-factory';

export default class OpenDataDIDFeature extends BaseFeature<
    OpenDataDIDControllerParameters,
    OpenDataDIDRequest,
    OpenDataDIDResponse,
    OpenDataDIDError,
    OpenDataDIDViewModel,
    FeatureKey
> {
    constructor(appContainer: Container) {
        const gateway = appContainer.get(GATEWAYS.OPENDATA);

        const symbols = {
            CONTROLLER: CONTROLLERS.OPENDATA_DID,
            USECASE_FACTORY: USECASE_FACTORY.OPENDATA_DID,
            INPUT_PORT: INPUT_PORT.OPENDATA_DID,
        };

        super('OpenDataDID', OpenDataDIDController, OpenDataDIDUseCase, [gateway], OpenDataDIDPresenter, false, symbols, 'opendata');
    }
}
