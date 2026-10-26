import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import { CreateAccountError, CreateAccountRequest, CreateAccountResponse } from '@/lib/core/usecase-models/create-account-usecase-models';
import { CreateAccountControllerParameters } from '@/lib/infrastructure/controller/create-account-controller';
import CreateAccountController from '@/lib/infrastructure/controller/create-account-controller';
import { CreateAccountViewModel } from '@/lib/infrastructure/data/view-model/account';
import { BaseFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import { FeatureKey } from '@/lib/core/entity/feature-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import CreateAccountUseCase from '@/lib/core/use-case/create-account-usecase';
import CreateAccountPresenter from '@/lib/infrastructure/presenter/create-account-presenter';

export default class CreateAccountFeature extends BaseFeature<
    CreateAccountControllerParameters,
    CreateAccountRequest,
    CreateAccountResponse,
    CreateAccountError,
    CreateAccountViewModel,
    FeatureKey
> {
    constructor(appContainer: Container) {
        const accountGateway = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.CREATE_ACCOUNT,
            USECASE_FACTORY: USECASE_FACTORY.CREATE_ACCOUNT,
            INPUT_PORT: INPUT_PORT.CREATE_ACCOUNT,
        };
        const useCaseConstructorArgs = [accountGateway];
        super(
            'CreateAccount',
            CreateAccountController,
            CreateAccountUseCase,
            useCaseConstructorArgs,
            CreateAccountPresenter,
            false,
            symbols,
            'accounts.manage.core',
        );
    }
}
