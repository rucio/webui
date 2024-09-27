import { injectable, inject } from 'inversify';
import { NextApiResponse } from 'next';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { CreateRuleRequest } from '@/lib/core/usecase-models/create-rule-usecase-models';
import { CreateRuleInputPort } from '@/lib/core/port/primary/create-rule-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { z } from 'zod';

export type CreateRuleControllerParameters = TAuthenticatedControllerParameters & {
    dids: {
        scope: string;
        name: string;
    }[];
    copies: number;
    rse_expression: string;
    account: string;
    grouping?: 'ALL' | 'DATASET' | 'NONE';
    lifetime_days?: number;
    notify?: boolean;
    comments?: string;
    ask_approval?: boolean;
    asynchronous?: boolean;
    sample?: boolean;
    sample_file_count?: number;
};

@injectable()
class CreateRuleController extends BaseController<CreateRuleControllerParameters, AuthenticatedRequestModel<CreateRuleRequest>> {
    constructor(@inject(USECASE_FACTORY.CREATE_RULE) createRuleUseCaseFactory: (response: NextApiResponse) => CreateRuleInputPort) {
        super(createRuleUseCaseFactory);
    }
    prepareRequestModel(parameters: CreateRuleControllerParameters): AuthenticatedRequestModel<CreateRuleRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            dids: parameters.dids,
            copies: parameters.copies,
            rse_expression: parameters.rse_expression,
            account: parameters.account,
            grouping: parameters.grouping,
            // Convert to seconds
            lifetime: parameters.lifetime_days ? parameters.lifetime_days * 86400 : undefined,
            notify: parameters.notify ? 'Y' : 'N',
            comments: parameters.comments,
            asynchronous: parameters.asynchronous,
            ask_approval: parameters.ask_approval,
            sample: parameters.sample ?? false,
            sample_file_count: parameters.sample_file_count,
        };
    }
}

export default CreateRuleController;
