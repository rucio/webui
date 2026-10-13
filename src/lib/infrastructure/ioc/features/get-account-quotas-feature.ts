import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import {
    GetAccountQuotasError,
    GetAccountQuotasRequest,
    GetAccountQuotasResponse,
} from '@/lib/core/usecase-models/get-account-quotas-usecase-models';
import { GetAccountQuotasControllerParameters } from '@/lib/infrastructure/controller/get-account-quotas-controller';
import GetAccountQuotasController from '@/lib/infrastructure/controller/get-account-quotas-controller';
import { AccountQuotasViewModel } from '@/lib/infrastructure/data/view-model/account';
import { BaseFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import { FeatureKey } from '@/lib/core/entity/feature-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import GetAccountQuotasUseCase from '@/lib/core/use-case/get-account-quotas-usecase';
import GetAccountQuotasPresenter from '@/lib/infrastructure/presenter/get-account-quotas-presenter';

export default class GetAccountQuotasFeature extends BaseFeature<
    GetAccountQuotasControllerParameters,
    GetAccountQuotasRequest,
    GetAccountQuotasResponse,
    GetAccountQuotasError,
    AccountQuotasViewModel,
    FeatureKey
> {
    constructor(appContainer: Container) {
        const accountGateway = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.GET_ACCOUNT_QUOTAS,
            USECASE_FACTORY: USECASE_FACTORY.GET_ACCOUNT_QUOTAS,
            INPUT_PORT: INPUT_PORT.GET_ACCOUNT_QUOTAS,
        };
        const useCaseConstructorArgs = [accountGateway];
        super(
            'GetAccountQuotas',
            GetAccountQuotasController,
            GetAccountQuotasUseCase,
            useCaseConstructorArgs,
            GetAccountQuotasPresenter,
            false,
            symbols,
            'accounts',
        );
    }
}
