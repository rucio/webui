import DIDGatewayOutputPort from '@/lib/core/port/secondary/did-gateway-output-port';
import DIDMetaUseCase from '@/lib/core/use-case/did-meta-usecase';
import { DIDMetaError, DIDMetaRequest, DIDMetaResponse } from '@/lib/core/usecase-models/did-meta-usecase-models';
import { BaseFeature } from '@/lib/sdk/ioc-helpers';
import { Container } from 'inversify';
import DIDMetaController, { DIDMetaControllerParameters } from '../../controller/did-meta-controller';
import { DIDMetaViewModel } from '../../data/view-model/did';
import DIDMetaPresenter from '../../presenter/did-meta-presenter';
import CONTROLLERS from '../ioc-symbols-controllers';
import GATEWAYS from '../ioc-symbols-gateway';
import INPUT_PORT from '../ioc-symbols-input-port';
import USECASE_FACTORY from '../ioc-symbols-usecase-factory';

export default class DIDMetaFeature extends BaseFeature<
    DIDMetaControllerParameters,
    DIDMetaRequest,
    DIDMetaResponse,
    DIDMetaError,
    DIDMetaViewModel
> {
    constructor(appContainer: Container) {
        const gateway: DIDGatewayOutputPort = appContainer.get(GATEWAYS.DID);
        const symbols = {
            CONTROLLER: CONTROLLERS.DID_META,
            USECASE_FACTORY: USECASE_FACTORY.DID_META,
            INPUT_PORT: INPUT_PORT.DID_META,
        };
        super('DIDMeta', DIDMetaController, DIDMetaUseCase, [gateway], DIDMetaPresenter, false, symbols);
    }
}
