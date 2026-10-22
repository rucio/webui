import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import {
    AddAccountIdentityError,
    AddAccountIdentityRequest,
    AddAccountIdentityResponse,
} from '@/lib/core/usecase-models/add-account-identity-usecase-models';
import { AddAccountIdentityControllerParameters } from '@/lib/infrastructure/controller/add-account-identity-controller';
import AddAccountIdentityController from '@/lib/infrastructure/controller/add-account-identity-controller';
import { AddAccountIdentityViewModel } from '@/lib/infrastructure/data/view-model/account';
import { BaseFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import { FeatureKey } from '@/lib/core/entity/feature-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import AddAccountIdentityUseCase from '@/lib/core/use-case/add-account-identity-usecase';
import AddAccountIdentityPresenter from '@/lib/infrastructure/presenter/add-account-identity-presenter';

export default class AddAccountIdentityFeature extends BaseFeature<
    AddAccountIdentityControllerParameters,
    AddAccountIdentityRequest,
    AddAccountIdentityResponse,
    AddAccountIdentityError,
    AddAccountIdentityViewModel,
    FeatureKey
> {
    constructor(appContainer: Container) {
        const accountGateway = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.ADD_ACCOUNT_IDENTITY,
            USECASE_FACTORY: USECASE_FACTORY.ADD_ACCOUNT_IDENTITY,
            INPUT_PORT: INPUT_PORT.ADD_ACCOUNT_IDENTITY,
        };
        const useCaseConstructorArgs = [accountGateway];
        super(
            'AddAccountIdentity',
            AddAccountIdentityController,
            AddAccountIdentityUseCase,
            useCaseConstructorArgs,
            AddAccountIdentityPresenter,
            false,
            symbols,
            'accounts.manage',
        );
    }
}
