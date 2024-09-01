import AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import RSEGatewayOutputPort from '@/lib/core/port/secondary/rse-gateway-output-port';
import ListAccountRSEQuotasUseCase from '@/lib/core/use-case/list-account-rse-quotas-usecase';
import {
    ListAccountRSEQuotasError,
    ListAccountRSEQuotasRequest,
    ListAccountRSEQuotasResponse,
} from '@/lib/core/usecase-models/list-account-rse-quotas-usecase-models';
import { BaseStreamableFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import { Container } from 'inversify';
import ListAccountRSEQuotasController, { ListAccountRSEQuotasControllerParameters } from '../../controller/list-account-rse-quotas-controller';
import { RSEAccountUsageLimitViewModel } from '../../data/view-model/rse';
import ListAccountRSEQuotasPresenter from '../../presenter/list-account-rse-quotas-presenter';
import CONTROLLERS from '../ioc-symbols-controllers';
import GATEWAYS from '../ioc-symbols-gateway';
import INPUT_PORT from '../ioc-symbols-input-port';
import USECASE_FACTORY from '../ioc-symbols-usecase-factory';

export default class ListAccountRSEQuotasFeature extends BaseStreamableFeature<
    ListAccountRSEQuotasControllerParameters,
    ListAccountRSEQuotasRequest,
    ListAccountRSEQuotasResponse,
    ListAccountRSEQuotasError,
    RSEAccountUsageLimitViewModel
> {
    constructor(appContainer: Container) {
        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.LIST_ACCOUNT_RSE_QUOTAS,
            USECASE_FACTORY: USECASE_FACTORY.LIST_ACCOUNT_RSE_QUOTAS,
            INPUT_PORT: INPUT_PORT.LIST_ACCOUNT_RSE_QUOTAS,
        };

        const rseGateway: RSEGatewayOutputPort = appContainer.get<RSEGatewayOutputPort>(GATEWAYS.RSE);
        const accountGateway: AccountGatewayOutputPort = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);

        const useCaseConstructorArgs = [rseGateway, accountGateway];

        super(
            'ListAccountRSEQuotas',
            ListAccountRSEQuotasController,
            ListAccountRSEQuotasUseCase,
            useCaseConstructorArgs,
            ListAccountRSEQuotasPresenter,
            false,
            symbols,
        );
    }
}
