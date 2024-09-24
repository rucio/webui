import { injectable } from 'inversify';
import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

import { CreateRuleError, CreateRuleRequest, CreateRuleResponse } from '@/lib/core/usecase-models/create-rule-usecase-models';
import { CreateRuleInputPort, type CreateRuleOutputPort } from '@/lib/core/port/primary/create-rule-ports';

import { CreateRuleDTO } from '@/lib/core/dto/rule-dto';
import type RuleGatewayOutputPort from '@/lib/core/port/secondary/rule-gateway-output-port';
import type AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import type DIDGatewayOutputPort from '@/lib/core/port/secondary/did-gateway-output-port';
import { AccountInfoDTO } from '@/lib/core/dto/account-dto';
import { generateNewScope, generateRequestDIDName } from '@/lib/core/utils/did-utils';
import { DIDExtendedDTO, SetDIDStatusDTO } from '@/lib/core/dto/did-dto';
import { DID, DIDShort, DIDType } from '@/lib/core/entity/rucio';
import { buildIntermediateCreateRuleError, buildIntermediateSetStatusError } from '@/lib/core/utils/create-rule-utils';

@injectable()
export default class CreateRuleUseCase
    extends BaseSingleEndpointUseCase<AuthenticatedRequestModel<CreateRuleRequest>, CreateRuleResponse, CreateRuleError, CreateRuleDTO>
    implements CreateRuleInputPort
{
    constructor(
        protected readonly presenter: CreateRuleOutputPort,
        private readonly ruleGateway: RuleGatewayOutputPort,
        private readonly accountGateway: AccountGatewayOutputPort,
        private readonly didGateway: DIDGatewayOutputPort,
    ) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<CreateRuleRequest>): CreateRuleError | undefined {
        return undefined;
    }

    private async classifyDIDs(requestModel: AuthenticatedRequestModel<CreateRuleRequest>): Promise<DID[]> {
        const classifiedDIDs: DID[] = [];

        for (const did of requestModel.dids) {
            const extendedDTO: DIDExtendedDTO = await this.didGateway.getDID(requestModel.rucioAuthToken, did.scope, did.name, undefined);
            if (extendedDTO.status === 'error') throw new Error();
            classifiedDIDs.push({
                scope: did.scope,
                name: did.name,
                did_type: extendedDTO.did_type,
            });
        }

        return classifiedDIDs;
    }

    private async createRequestDID(
        requestModel: AuthenticatedRequestModel<CreateRuleRequest>,
        params: { newScope: string; classifiedDIDs: DID[] },
    ): Promise<SetDIDStatusDTO> {
        const { newScope, classifiedDIDs: dids } = params;

        const datasets: DIDShort[] = [];
        const files: DIDShort[] = [];

        for (const did of dids) {
            if (did.did_type === DIDType.FILE) {
                files.push(did);
            } else if (did.did_type === DIDType.DATASET) {
                datasets.push(did);
            } else {
                return {
                    status: 'error',
                    errorMessage: `Received a DID of an unsupported type ${did.did_type}`,
                    errorType: 'Request Type',
                    scope: '',
                    name: '',
                    open: false,
                };
            }
        }

        // Add and populate the request dataset/container
        const initializeDID = async (dids: DIDShort[], type: DIDType.DATASET | DIDType.CONTAINER): Promise<SetDIDStatusDTO> => {
            const newName = generateRequestDIDName(newScope);
            const addDTO = await this.didGateway.addDID(requestModel.rucioAuthToken, newScope, newName, type);
            if (addDTO.status === 'error') return buildIntermediateSetStatusError(addDTO, 'Request Add');
            const attachDTO = await this.didGateway.attachDIDs(requestModel.rucioAuthToken, newScope, newName, dids);
            if (attachDTO.status === 'error') return buildIntermediateSetStatusError(attachDTO, 'Request Attach');
            return this.didGateway.setDIDStatus(requestModel.rucioAuthToken, newScope, newName, false);
        };

        // Pack chosen files in a dataset
        if (files.length > 0) {
            const requestDatasetDTO = await initializeDID(files, DIDType.DATASET);
            // Check if no other datasets are chosen
            if (requestDatasetDTO.status === 'error' || datasets.length === 0) {
                return requestDatasetDTO;
            } else {
                // Forward it to be packed in a container
                datasets.push({
                    scope: requestDatasetDTO.scope,
                    name: requestDatasetDTO.name,
                });
            }
        }

        // Pack chosen datasets in a container
        if (datasets.length > 0) {
            return await initializeDID(datasets, DIDType.CONTAINER);
        }

        return {
            status: 'error',
            errorMessage: 'Received no valid DIDs',
            errorType: 'Request Empty',
            scope: '',
            name: '',
            open: false,
        };
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<CreateRuleRequest>): Promise<CreateRuleDTO> {
        // TODO: create samples

        const classifiedDIDs = await this.classifyDIDs(requestModel);

        if (requestModel.ask_approval && requestModel.dids.length > 1) {
            const accountInfoDTO: AccountInfoDTO = await this.accountGateway.getAccountInfo(requestModel.account, requestModel.rucioAuthToken);
            if (accountInfoDTO.status === 'error') return buildIntermediateCreateRuleError(accountInfoDTO, 'Account Info');
            const newScope = generateNewScope(requestModel.account, accountInfoDTO.accountType);

            const requestIdentifierDTO = await this.createRequestDID(requestModel, {
                newScope,
                classifiedDIDs,
            });
            if (requestIdentifierDTO.status === 'error' || requestIdentifierDTO.open) {
                return buildIntermediateCreateRuleError(requestIdentifierDTO, requestIdentifierDTO.errorType ?? 'Request Status');
            }
            requestModel.dids = [{ scope: requestIdentifierDTO.scope, name: requestIdentifierDTO.name }];

            // If datasets were chosen, they got packed in a container
            // Containers are usually huge, so the request should be asynchronous regardless
            if (classifiedDIDs.some(did => did.did_type === DIDType.DATASET)) {
                requestModel.asynchronous = true;
            }
        }

        if (classifiedDIDs.some(did => did.did_type === DIDType.CONTAINER)) {
            requestModel.asynchronous = true;
        }

        const { rucioAuthToken, ...params } = requestModel;
        const dto: CreateRuleDTO = await this.ruleGateway.createRule(rucioAuthToken, params);
        return dto;
    }

    handleGatewayError(error: CreateRuleDTO): CreateRuleError {
        const type = error.errorType ? `${error.errorType}: ` : '';
        return {
            status: 'error',
            error: `Gateway retuned with ${error.errorCode}: ${error.errorMessage}`,
            message: error.errorMessage ? error.errorMessage : `${type}Gateway Error`,
            name: `${type}Gateway Error`,
            code: error.errorCode,
        } as CreateRuleError;
    }

    processDTO(dto: CreateRuleDTO): { data: CreateRuleResponse | CreateRuleError; status: 'success' | 'error' } {
        return {
            status: 'success',
            data: {
                status: 'success',
                rule_ids: dto.rule_ids,
            },
        };
    }
}
