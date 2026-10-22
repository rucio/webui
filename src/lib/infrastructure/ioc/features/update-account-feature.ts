import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import { UpdateAccountError, UpdateAccountRequest, UpdateAccountResponse } from '@/lib/core/usecase-models/update-account-usecase-models';
import { UpdateAccountControllerParameters } from '@/lib/infrastructure/controller/update-account-controller';
import UpdateAccountController from '@/lib/infrastructure/controller/update-account-controller';
import { UpdateAccountViewModel } from '@/lib/infrastructure/data/view-model/account';
import { BaseFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import { FeatureKey } from '@/lib/core/entity/feature-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import UpdateAccountUseCase from '@/lib/core/use-case/update-account-usecase';
import UpdateAccountPresenter from '@/lib/infrastructure/presenter/update-account-presenter';

export default class UpdateAccountFeature extends BaseFeature<
    UpdateAccountControllerParameters,
    UpdateAccountRequest,
    UpdateAccountResponse,
    UpdateAccountError,
    UpdateAccountViewModel,
    FeatureKey
> {
    constructor(appContainer: Container) {
        const accountGateway = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.UPDATE_ACCOUNT,
            USECASE_FACTORY: USECASE_FACTORY.UPDATE_ACCOUNT,
            INPUT_PORT: INPUT_PORT.UPDATE_ACCOUNT,
        };
        const useCaseConstructorArgs = [accountGateway];
        super(
            'UpdateAccount',
            UpdateAccountController,
            UpdateAccountUseCase,
            useCaseConstructorArgs,
            UpdateAccountPresenter,
            false,
            symbols,
            'accounts.manage',
        );
    }
}
