import DIDGatewayOutputPort from '@/lib/core/port/secondary/did-gateway-output-port';
import { AttachDIDsError, AttachDIDsRequest, AttachDIDsResponse } from '@/lib/core/usecase-models/attach-dids-usecase-models';
import { AttachDIDsControllerParameters } from '@/lib/infrastructure/controller/attach-dids-controller';
import AttachDIDsController from '@/lib/infrastructure/controller/attach-dids-controller';
import { AttachDIDsViewModel } from '@/lib/infrastructure/data/view-model/did';
import { BaseFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import AttachDIDsUseCase from '@/lib/core/use-case/attach-dids-usecase';

import AttachDIDsPresenter from '@/lib/infrastructure/presenter/attach-dids-presenter';

export default class AttachDIDsFeature extends BaseFeature<
    AttachDIDsControllerParameters,
    AttachDIDsRequest,
    AttachDIDsResponse,
    AttachDIDsError,
    AttachDIDsViewModel
> {
    constructor(appContainer: Container) {
        const rucioDIDGateway = appContainer.get<DIDGatewayOutputPort>(GATEWAYS.DID);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.ATTACH_DIDS,
            USECASE_FACTORY: USECASE_FACTORY.ATTACH_DIDS,
            INPUT_PORT: INPUT_PORT.ATTACH_DIDS,
        };
        const useCaseConstructorArgs = [rucioDIDGateway];
        super('AttachDIDs', AttachDIDsController, AttachDIDsUseCase, useCaseConstructorArgs, AttachDIDsPresenter, false, symbols);
    }
}
