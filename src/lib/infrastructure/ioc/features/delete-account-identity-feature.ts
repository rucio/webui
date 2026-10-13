import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import {
    DeleteAccountIdentityError,
    DeleteAccountIdentityRequest,
    DeleteAccountIdentityResponse,
} from '@/lib/core/usecase-models/delete-account-identity-usecase-models';
import { DeleteAccountIdentityControllerParameters } from '@/lib/infrastructure/controller/delete-account-identity-controller';
import DeleteAccountIdentityController from '@/lib/infrastructure/controller/delete-account-identity-controller';
import { DeleteAccountIdentityViewModel } from '@/lib/infrastructure/data/view-model/account';
import { BaseFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import { FeatureKey } from '@/lib/core/entity/feature-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import DeleteAccountIdentityUseCase from '@/lib/core/use-case/delete-account-identity-usecase';
import DeleteAccountIdentityPresenter from '@/lib/infrastructure/presenter/delete-account-identity-presenter';

export default class DeleteAccountIdentityFeature extends BaseFeature<
    DeleteAccountIdentityControllerParameters,
    DeleteAccountIdentityRequest,
    DeleteAccountIdentityResponse,
    DeleteAccountIdentityError,
    DeleteAccountIdentityViewModel,
    FeatureKey
> {
    constructor(appContainer: Container) {
        const accountGateway = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.DELETE_ACCOUNT_IDENTITY,
            USECASE_FACTORY: USECASE_FACTORY.DELETE_ACCOUNT_IDENTITY,
            INPUT_PORT: INPUT_PORT.DELETE_ACCOUNT_IDENTITY,
        };
        const useCaseConstructorArgs = [accountGateway];
        super(
            'DeleteAccountIdentity',
            DeleteAccountIdentityController,
            DeleteAccountIdentityUseCase,
            useCaseConstructorArgs,
            DeleteAccountIdentityPresenter,
            false,
            symbols,
            'accounts.manage',
        );
    }
}
