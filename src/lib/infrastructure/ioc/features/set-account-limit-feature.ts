import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import { SetAccountLimitError, SetAccountLimitRequest, SetAccountLimitResponse } from '@/lib/core/usecase-models/set-account-limit-usecase-models';
import { SetAccountLimitControllerParameters } from '@/lib/infrastructure/controller/set-account-limit-controller';
import SetAccountLimitController from '@/lib/infrastructure/controller/set-account-limit-controller';
import { SetAccountLimitViewModel } from '@/lib/infrastructure/data/view-model/account';
import { BaseFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import { FeatureKey } from '@/lib/core/entity/feature-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import SetAccountLimitUseCase from '@/lib/core/use-case/set-account-limit-usecase';
import SetAccountLimitPresenter from '@/lib/infrastructure/presenter/set-account-limit-presenter';

export default class SetAccountLimitFeature extends BaseFeature<
    SetAccountLimitControllerParameters,
    SetAccountLimitRequest,
    SetAccountLimitResponse,
    SetAccountLimitError,
    SetAccountLimitViewModel,
    FeatureKey
> {
    constructor(appContainer: Container) {
        const accountGateway = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.SET_ACCOUNT_LIMIT,
            USECASE_FACTORY: USECASE_FACTORY.SET_ACCOUNT_LIMIT,
            INPUT_PORT: INPUT_PORT.SET_ACCOUNT_LIMIT,
        };
        const useCaseConstructorArgs = [accountGateway];
        super(
            'SetAccountLimit',
            SetAccountLimitController,
            SetAccountLimitUseCase,
            useCaseConstructorArgs,
            SetAccountLimitPresenter,
            false,
            symbols,
            'accounts.manage',
        );
    }
}
