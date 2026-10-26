import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import {
    AddAccountAttributeError,
    AddAccountAttributeRequest,
    AddAccountAttributeResponse,
} from '@/lib/core/usecase-models/add-account-attribute-usecase-models';
import { AddAccountAttributeControllerParameters } from '@/lib/infrastructure/controller/add-account-attribute-controller';
import AddAccountAttributeController from '@/lib/infrastructure/controller/add-account-attribute-controller';
import { AddAccountAttributeViewModel } from '@/lib/infrastructure/data/view-model/account';
import { BaseFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import { FeatureKey } from '@/lib/core/entity/feature-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import AddAccountAttributeUseCase from '@/lib/core/use-case/add-account-attribute-usecase';
import AddAccountAttributePresenter from '@/lib/infrastructure/presenter/add-account-attribute-presenter';

export default class AddAccountAttributeFeature extends BaseFeature<
    AddAccountAttributeControllerParameters,
    AddAccountAttributeRequest,
    AddAccountAttributeResponse,
    AddAccountAttributeError,
    AddAccountAttributeViewModel,
    FeatureKey
> {
    constructor(appContainer: Container) {
        const accountGateway = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.ADD_ACCOUNT_ATTRIBUTE,
            USECASE_FACTORY: USECASE_FACTORY.ADD_ACCOUNT_ATTRIBUTE,
            INPUT_PORT: INPUT_PORT.ADD_ACCOUNT_ATTRIBUTE,
        };
        const useCaseConstructorArgs = [accountGateway];
        super(
            'AddAccountAttribute',
            AddAccountAttributeController,
            AddAccountAttributeUseCase,
            useCaseConstructorArgs,
            AddAccountAttributePresenter,
            false,
            symbols,
            'accounts.manage.attributes',
        );
    }
}
