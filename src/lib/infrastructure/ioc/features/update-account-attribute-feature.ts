import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import {
    UpdateAccountAttributeError,
    UpdateAccountAttributeRequest,
    UpdateAccountAttributeResponse,
} from '@/lib/core/usecase-models/update-account-attribute-usecase-models';
import { UpdateAccountAttributeControllerParameters } from '@/lib/infrastructure/controller/update-account-attribute-controller';
import UpdateAccountAttributeController from '@/lib/infrastructure/controller/update-account-attribute-controller';
import { UpdateAccountAttributeViewModel } from '@/lib/infrastructure/data/view-model/account';
import { BaseFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import { FeatureKey } from '@/lib/core/entity/feature-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import UpdateAccountAttributeUseCase from '@/lib/core/use-case/update-account-attribute-usecase';
import UpdateAccountAttributePresenter from '@/lib/infrastructure/presenter/update-account-attribute-presenter';

export default class UpdateAccountAttributeFeature extends BaseFeature<
    UpdateAccountAttributeControllerParameters,
    UpdateAccountAttributeRequest,
    UpdateAccountAttributeResponse,
    UpdateAccountAttributeError,
    UpdateAccountAttributeViewModel,
    FeatureKey
> {
    constructor(appContainer: Container) {
        const accountGateway = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.UPDATE_ACCOUNT_ATTRIBUTE,
            USECASE_FACTORY: USECASE_FACTORY.UPDATE_ACCOUNT_ATTRIBUTE,
            INPUT_PORT: INPUT_PORT.UPDATE_ACCOUNT_ATTRIBUTE,
        };
        const useCaseConstructorArgs = [accountGateway];
        super(
            'UpdateAccountAttribute',
            UpdateAccountAttributeController,
            UpdateAccountAttributeUseCase,
            useCaseConstructorArgs,
            UpdateAccountAttributePresenter,
            false,
            symbols,
            'accounts.manage.attributes',
        );
    }
}
