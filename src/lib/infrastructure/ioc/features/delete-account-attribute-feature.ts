import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import {
    DeleteAccountAttributeError,
    DeleteAccountAttributeRequest,
    DeleteAccountAttributeResponse,
} from '@/lib/core/usecase-models/delete-account-attribute-usecase-models';
import { DeleteAccountAttributeControllerParameters } from '@/lib/infrastructure/controller/delete-account-attribute-controller';
import DeleteAccountAttributeController from '@/lib/infrastructure/controller/delete-account-attribute-controller';
import { DeleteAccountAttributeViewModel } from '@/lib/infrastructure/data/view-model/account';
import { BaseFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import { FeatureKey } from '@/lib/core/entity/feature-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import DeleteAccountAttributeUseCase from '@/lib/core/use-case/delete-account-attribute-usecase';
import DeleteAccountAttributePresenter from '@/lib/infrastructure/presenter/delete-account-attribute-presenter';

export default class DeleteAccountAttributeFeature extends BaseFeature<
    DeleteAccountAttributeControllerParameters,
    DeleteAccountAttributeRequest,
    DeleteAccountAttributeResponse,
    DeleteAccountAttributeError,
    DeleteAccountAttributeViewModel,
    FeatureKey
> {
    constructor(appContainer: Container) {
        const accountGateway = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.DELETE_ACCOUNT_ATTRIBUTE,
            USECASE_FACTORY: USECASE_FACTORY.DELETE_ACCOUNT_ATTRIBUTE,
            INPUT_PORT: INPUT_PORT.DELETE_ACCOUNT_ATTRIBUTE,
        };
        const useCaseConstructorArgs = [accountGateway];
        super(
            'DeleteAccountAttribute',
            DeleteAccountAttributeController,
            DeleteAccountAttributeUseCase,
            useCaseConstructorArgs,
            DeleteAccountAttributePresenter,
            false,
            symbols,
            'accounts.manage',
        );
    }
}
