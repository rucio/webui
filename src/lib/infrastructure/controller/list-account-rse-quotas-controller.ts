import { DIDLong } from '@/lib/core/entity/rucio';
import { ListAccountRSEQuotasInputPort } from '@/lib/core/port/primary/list-account-rse-quotas-ports';
import { ListAccountRSEQuotasRequest } from '@/lib/core/usecase-models/list-account-rse-quotas-usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { inject, injectable } from 'inversify';
import { NextApiResponse } from 'next';
import USECASE_FACTORY from '../ioc/ioc-symbols-usecase-factory';

export type ListAccountRSEQuotasControllerParameters = TAuthenticatedControllerParameters & {
    account: string;
    requestedDIDs: DIDLong[];
    rseExpression?: string;
};

@injectable()
class ListAccountRSEQuotasController extends BaseController<
    ListAccountRSEQuotasControllerParameters,
    AuthenticatedRequestModel<ListAccountRSEQuotasRequest>
> {
    constructor(
        @inject(USECASE_FACTORY.LIST_ACCOUNT_RSE_QUOTAS)
        listAccountRSEQuotasUseCaseFactory: (response: NextApiResponse) => ListAccountRSEQuotasInputPort,
    ) {
        super(listAccountRSEQuotasUseCaseFactory);
    }

    prepareRequestModel(parameters: ListAccountRSEQuotasControllerParameters): AuthenticatedRequestModel<ListAccountRSEQuotasRequest> {
        const requestModel: AuthenticatedRequestModel<ListAccountRSEQuotasRequest> = {
            rucioAuthToken: parameters.rucioAuthToken,
            account: parameters.account,
            requestedDIDs: parameters.requestedDIDs,
            rseExpression: parameters.rseExpression ?? '',
        };
        return requestModel;
    }
}

export default ListAccountRSEQuotasController;
