import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { GetAMITagInfoRequest } from '@/lib/core/usecase-models/get-ami-tag-info-usecase-models';
import { GetAMITagInfoInputPort } from '@/lib/core/port/primary/get-ami-tag-info-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type GetAMITagInfoControllerParameters = TAuthenticatedControllerParameters & {
    tags: string[];
};

@injectable()
class GetAMITagInfoController extends BaseController<GetAMITagInfoControllerParameters, AuthenticatedRequestModel<GetAMITagInfoRequest>> {
    constructor(@inject(USECASE_FACTORY.GET_AMI_TAG_INFO) GetAMITagInfoUseCaseFactory: (response: Signal) => GetAMITagInfoInputPort) {
        super(GetAMITagInfoUseCaseFactory);
    }

    prepareRequestModel(parameters: GetAMITagInfoControllerParameters): AuthenticatedRequestModel<GetAMITagInfoRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            tags: parameters.tags,
        };
    }
}

export default GetAMITagInfoController;
