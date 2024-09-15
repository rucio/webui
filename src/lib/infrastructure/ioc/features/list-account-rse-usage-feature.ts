import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import {
    ListAccountRSEUsageError,
    ListAccountRSEUsageRequest,
    ListAccountRSEUsageResponse,
} from '@/lib/core/usecase-models/list-account-rse-usage-usecase-models';
import { ListAccountRSEUsageControllerParameters } from '@/lib/infrastructure/controller/list-account-rse-usage-controller';
import ListAccountRSEUsageController from '@/lib/infrastructure/controller/list-account-rse-usage-controller';
import { RSEAccountUsageViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { BaseStreamableFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import ListAccountRSEUsageUseCase from '@/lib/core/use-case/list-account-rse-usage-usecase';

import ListAccountRSEUsagePresenter from '@/lib/infrastructure/presenter/list-account-rse-usage-presenter';

export default class ListAccountRSEUsageFeature extends BaseStreamableFeature<
    ListAccountRSEUsageControllerParameters,
    ListAccountRSEUsageRequest,
    ListAccountRSEUsageResponse,
    ListAccountRSEUsageError,
    RSEAccountUsageViewModel
> {
    constructor(appContainer: Container) {
        const accountGateway = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.LIST_ACCOUNT_RSE_USAGE,
            USECASE_FACTORY: USECASE_FACTORY.LIST_ACCOUNT_RSE_USAGE,
            INPUT_PORT: INPUT_PORT.LIST_ACCOUNT_RSE_USAGE,
        };
        const useCaseConstructorArgs = [accountGateway];
        super(
            'ListAccountRSEUsage',
            ListAccountRSEUsageController,
            ListAccountRSEUsageUseCase,
            useCaseConstructorArgs,
            ListAccountRSEUsagePresenter,
            false,
            symbols,
        );
    }
}
