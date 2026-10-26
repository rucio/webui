import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import { DeleteAccountError, DeleteAccountRequest, DeleteAccountResponse } from '@/lib/core/usecase-models/delete-account-usecase-models';
import { DeleteAccountControllerParameters } from '@/lib/infrastructure/controller/delete-account-controller';
import DeleteAccountController from '@/lib/infrastructure/controller/delete-account-controller';
import { DeleteAccountViewModel } from '@/lib/infrastructure/data/view-model/account';
import { BaseFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import { FeatureKey } from '@/lib/core/entity/feature-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import DeleteAccountUseCase from '@/lib/core/use-case/delete-account-usecase';
import DeleteAccountPresenter from '@/lib/infrastructure/presenter/delete-account-presenter';

export default class DeleteAccountFeature extends BaseFeature<
    DeleteAccountControllerParameters,
    DeleteAccountRequest,
    DeleteAccountResponse,
    DeleteAccountError,
    DeleteAccountViewModel,
    FeatureKey
> {
    constructor(appContainer: Container) {
        const accountGateway = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.DELETE_ACCOUNT,
            USECASE_FACTORY: USECASE_FACTORY.DELETE_ACCOUNT,
            INPUT_PORT: INPUT_PORT.DELETE_ACCOUNT,
        };
        const useCaseConstructorArgs = [accountGateway];
        super(
            'DeleteAccount',
            DeleteAccountController,
            DeleteAccountUseCase,
            useCaseConstructorArgs,
            DeleteAccountPresenter,
            false,
            symbols,
            'accounts.manage.core',
        );
    }
}
