import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { UpdateRuleRequest } from '@/lib/core/usecase-models/update-rule-usecase-models';
import { UpdateRuleInputPort } from '@/lib/core/port/primary/update-rule-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { RuleUpdateOptions } from '@/lib/core/entity/rucio';

export type UpdateRuleControllerParameters = TAuthenticatedControllerParameters & {
    ruleId: string;
    options: RuleUpdateOptions;
};

@injectable()
class UpdateRuleController extends BaseController<UpdateRuleControllerParameters, AuthenticatedRequestModel<UpdateRuleRequest>> {
    constructor(@inject(USECASE_FACTORY.UPDATE_RULE) updateRuleUseCaseFactory: (response: Signal) => UpdateRuleInputPort) {
        super(updateRuleUseCaseFactory);
    }
    prepareRequestModel(parameters: UpdateRuleControllerParameters): AuthenticatedRequestModel<UpdateRuleRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            ruleId: parameters.ruleId,
            options: parameters.options,
        };
    }
}

export default UpdateRuleController;
