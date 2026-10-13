import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import {
    ListAccountAttributesError,
    ListAccountAttributesRequest,
    ListAccountAttributesResponse,
} from '@/lib/core/usecase-models/list-account-attributes-usecase-models';
import { ListAccountAttributesControllerParameters } from '@/lib/infrastructure/controller/list-account-attributes-controller';
import ListAccountAttributesController from '@/lib/infrastructure/controller/list-account-attributes-controller';
import { AccountAttributesViewModel } from '@/lib/infrastructure/data/view-model/account';
import { BaseFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import { FeatureKey } from '@/lib/core/entity/feature-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import ListAccountAttributesUseCase from '@/lib/core/use-case/list-account-attributes-usecase';
import ListAccountAttributesPresenter from '@/lib/infrastructure/presenter/list-account-attributes-presenter';

export default class ListAccountAttributesFeature extends BaseFeature<
    ListAccountAttributesControllerParameters,
    ListAccountAttributesRequest,
    ListAccountAttributesResponse,
    ListAccountAttributesError,
    AccountAttributesViewModel,
    FeatureKey
> {
    constructor(appContainer: Container) {
        const accountGateway = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.LIST_ACCOUNT_ATTRIBUTES,
            USECASE_FACTORY: USECASE_FACTORY.LIST_ACCOUNT_ATTRIBUTES,
            INPUT_PORT: INPUT_PORT.LIST_ACCOUNT_ATTRIBUTES,
        };
        const useCaseConstructorArgs = [accountGateway];
        super(
            'ListAccountAttributes',
            ListAccountAttributesController,
            ListAccountAttributesUseCase,
            useCaseConstructorArgs,
            ListAccountAttributesPresenter,
            false,
            symbols,
            'accounts',
        );
    }
}
