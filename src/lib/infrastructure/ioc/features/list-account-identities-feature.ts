import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import {
    ListAccountIdentitiesError,
    ListAccountIdentitiesRequest,
    ListAccountIdentitiesResponse,
} from '@/lib/core/usecase-models/list-account-identities-usecase-models';
import { ListAccountIdentitiesControllerParameters } from '@/lib/infrastructure/controller/list-account-identities-controller';
import ListAccountIdentitiesController from '@/lib/infrastructure/controller/list-account-identities-controller';
import { AccountIdentitiesViewModel } from '@/lib/infrastructure/data/view-model/account';
import { BaseFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import { FeatureKey } from '@/lib/core/entity/feature-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import ListAccountIdentitiesUseCase from '@/lib/core/use-case/list-account-identities-usecase';
import ListAccountIdentitiesPresenter from '@/lib/infrastructure/presenter/list-account-identities-presenter';

export default class ListAccountIdentitiesFeature extends BaseFeature<
    ListAccountIdentitiesControllerParameters,
    ListAccountIdentitiesRequest,
    ListAccountIdentitiesResponse,
    ListAccountIdentitiesError,
    AccountIdentitiesViewModel,
    FeatureKey
> {
    constructor(appContainer: Container) {
        const accountGateway = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.LIST_ACCOUNT_IDENTITIES,
            USECASE_FACTORY: USECASE_FACTORY.LIST_ACCOUNT_IDENTITIES,
            INPUT_PORT: INPUT_PORT.LIST_ACCOUNT_IDENTITIES,
        };
        const useCaseConstructorArgs = [accountGateway];
        super(
            'ListAccountIdentities',
            ListAccountIdentitiesController,
            ListAccountIdentitiesUseCase,
            useCaseConstructorArgs,
            ListAccountIdentitiesPresenter,
            false,
            symbols,
            'accounts',
        );
    }
}
