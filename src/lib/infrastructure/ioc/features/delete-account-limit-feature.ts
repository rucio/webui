import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import {
    DeleteAccountLimitError,
    DeleteAccountLimitRequest,
    DeleteAccountLimitResponse,
} from '@/lib/core/usecase-models/delete-account-limit-usecase-models';
import { DeleteAccountLimitControllerParameters } from '@/lib/infrastructure/controller/delete-account-limit-controller';
import DeleteAccountLimitController from '@/lib/infrastructure/controller/delete-account-limit-controller';
import { DeleteAccountLimitViewModel } from '@/lib/infrastructure/data/view-model/account';
import { BaseFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import { FeatureKey } from '@/lib/core/entity/feature-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import DeleteAccountLimitUseCase from '@/lib/core/use-case/delete-account-limit-usecase';
import DeleteAccountLimitPresenter from '@/lib/infrastructure/presenter/delete-account-limit-presenter';

export default class DeleteAccountLimitFeature extends BaseFeature<
    DeleteAccountLimitControllerParameters,
    DeleteAccountLimitRequest,
    DeleteAccountLimitResponse,
    DeleteAccountLimitError,
    DeleteAccountLimitViewModel,
    FeatureKey
> {
    constructor(appContainer: Container) {
        const accountGateway = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.DELETE_ACCOUNT_LIMIT,
            USECASE_FACTORY: USECASE_FACTORY.DELETE_ACCOUNT_LIMIT,
            INPUT_PORT: INPUT_PORT.DELETE_ACCOUNT_LIMIT,
        };
        const useCaseConstructorArgs = [accountGateway];
        super(
            'DeleteAccountLimit',
            DeleteAccountLimitController,
            DeleteAccountLimitUseCase,
            useCaseConstructorArgs,
            DeleteAccountLimitPresenter,
            false,
            symbols,
            'accounts.manage.quotas',
        );
    }
}
