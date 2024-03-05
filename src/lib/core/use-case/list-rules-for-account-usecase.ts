import { injectable } from 'inversify'
import { BaseSingleEndpointStreamingUseCase } from '@/lib/sdk/usecase'
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models'

import type {
    ListRulesForAccountError,
    ListRulesForAccountRequest,
    ListRulesForAccountResponse,
} from '@/lib/core/usecase-models/list-rules-for-account-usecase-models'
import {
    ListRulesForAccountInputPort,
    type ListRulesForAccountOutputPort,
} from '@/lib/core/port/primary/list-rules-for-account-ports'
import { RuleViewModel } from '@/lib/infrastructure/data/view-model/rule'

import { BaseStreamableDTO } from '@/lib/sdk/dto'
import { RuleDTO } from '@/lib/core/dto/rule-dto'
import type RuleGatewayOutputPort from '@/lib/core/port/secondary/rule-gateway-output-port'

@injectable()
export default class ListRulesForAccountUseCase
    extends BaseSingleEndpointStreamingUseCase<
        AuthenticatedRequestModel<ListRulesForAccountRequest>,
        ListRulesForAccountResponse,
        ListRulesForAccountError,
        BaseStreamableDTO,
        RuleDTO,
        RuleViewModel
    >
    implements ListRulesForAccountInputPort
{
    constructor(
        protected readonly presenter: ListRulesForAccountOutputPort,
        private readonly gateway: RuleGatewayOutputPort,
        private requestModel: ListRulesForAccountRequest | undefined = undefined, 
    ) {
        super(presenter)
    }

    validateRequestModel(
        requestModel: AuthenticatedRequestModel<ListRulesForAccountRequest>,
    ): ListRulesForAccountError | undefined {
        return undefined
    }

    intializeRequest(
        request: AuthenticatedRequestModel<
            AuthenticatedRequestModel<ListRulesForAccountRequest>
        >,
    ): Promise<ListRulesForAccountError | undefined> {
        this.requestModel = request
        return Promise.resolve(undefined)
    }

    async makeGatewayRequest(
        requestModel: AuthenticatedRequestModel<ListRulesForAccountRequest>,
    ): Promise<BaseStreamableDTO> {
        const { rucioAuthToken } = requestModel
        const dto: BaseStreamableDTO = await this.gateway.listRules(
            rucioAuthToken,
        )
        return dto
    }

    handleGatewayError(error: BaseStreamableDTO): ListRulesForAccountError {
        return {
            status: 'error',
            error: `Gateway retuned with ${error.errorCode}: ${error.errorMessage}`,
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: `Gateway Error`,
            code: error.errorCode,
        } as ListRulesForAccountError
    }
    
    sayHelloToEraldo() {
        console.log('Hello Eraldo')
    }

    processStreamedData(dto: RuleDTO): {
        data: ListRulesForAccountResponse | ListRulesForAccountError
        status: 'success' | 'error' | 'ignore'
    } {
        if (dto.status === 'error') {
            const errorModel: ListRulesForAccountError = {
                status: 'error',
                code: dto.errorCode || 500,
                message:
                    dto.errorMessage ||
                    'Could not fetch or process the fetched data',
                name: dto.errorName || 'Gateway Error',
            }
            return {
                status: 'error',
                data: errorModel,
            }
        }
        // TODO Apply filters

        if( dto.state != this.requestModel?.ruleState) {
            return {
                status: 'ignore',
                data: {
                    status: 'error',
                    code: 403,
                    message: `Failed filter ${dto.state} != ${this.requestModel?.ruleState}`,
                    name: 'Failed Rule State Filter',
                } as ListRulesForAccountError
            }
        }

        // TODO add remaining filters
        
        const responseModel: ListRulesForAccountResponse = {
            ...dto,
            status: 'success',
        }
        return {
            status: 'success',
            data: responseModel,
        }
    }
}
