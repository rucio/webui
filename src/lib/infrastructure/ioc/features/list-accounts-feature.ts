import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import { ListAccountsError, ListAccountsRequest, ListAccountsResponse } from '@/lib/core/usecase-models/list-accounts-usecase-models';
import { ListAccountsControllerParameters } from '@/lib/infrastructure/controller/list-accounts-controller';
import ListAccountsController from '@/lib/infrastructure/controller/list-accounts-controller';
import { AccountListItemViewModel } from '@/lib/infrastructure/data/view-model/account';
import { BaseStreamableFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import { FeatureKey } from '@/lib/core/entity/feature-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import ListAccountsUseCase from '@/lib/core/use-case/list-accounts-usecase';
import ListAccountsPresenter from '@/lib/infrastructure/presenter/list-accounts-presenter';

export default class ListAccountsFeature extends BaseStreamableFeature<
    ListAccountsControllerParameters,
    ListAccountsRequest,
    ListAccountsResponse,
    ListAccountsError,
    AccountListItemViewModel,
    FeatureKey
> {
    constructor(appContainer: Container) {
        const accountGateway = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.LIST_ACCOUNTS,
            USECASE_FACTORY: USECASE_FACTORY.LIST_ACCOUNTS,
            INPUT_PORT: INPUT_PORT.LIST_ACCOUNTS,
        };
        const useCaseConstructorArgs = [accountGateway];
        super('ListAccounts', ListAccountsController, ListAccountsUseCase, useCaseConstructorArgs, ListAccountsPresenter, false, symbols, 'accounts');
    }
}
