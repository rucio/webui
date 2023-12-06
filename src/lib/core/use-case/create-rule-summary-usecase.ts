import { BaseUseCase } from "@/lib/sdk/usecase";
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";
import { injectable } from "inversify";
import { AccountInfoDTO } from "../dto/account-dto";
import { DIDDTO, DIDExtendedDTO } from "../dto/did-dto";
import { AccountType, DID, DIDType } from "../entity/rucio";
import type { CreateRuleSummaryInputPort, CreateRuleSummaryOutputPort } from "../port/primary/create-rule-summary-ports";
import type AccountGatewayOutputPort from "../port/secondary/account-gateway-output-port";
import type DIDGatewayOutputPort from "../port/secondary/did-gateway-output-port";
import { CreateRuleSummaryRequest, CreateRuleSummaryResponse, CreateRuleSummaryError } from "../usecase-models/create-rule-summary-usecase-models";

type TDIDSummaryRow = {
    did: DID;
    copies: number;
    files: number;
    size: number | 'cannot be determined as DID has not been sampled';
    requested_size: number | 'cannot be determined as DID has not been sampled';
}

@injectable()
export default class CreateRuleSummayUseCase extends BaseUseCase<AuthenticatedRequestModel<CreateRuleSummaryRequest>, CreateRuleSummaryResponse, CreateRuleSummaryError> implements CreateRuleSummaryInputPort{
    private total_copies = 0
    private total_files = 0;
    private total_size = 0;
    private total_requested_size = 0;

    constructor(
        protected readonly presenter: CreateRuleSummaryOutputPort,
        private readonly didGateway: DIDGatewayOutputPort,
        private readonly accountGateway: AccountGatewayOutputPort
    ) {
        super(presenter);
    }
    validateRequestModel(requestModel: AuthenticatedRequestModel<CreateRuleSummaryRequest>): import("@/lib/sdk/usecase-models").BaseErrorResponseModel | undefined {
        return undefined;
    }

    protected async generateNewScope(rucioAuthToken: string, account: string): Promise<string> {
        const accountInfoDTO: AccountInfoDTO = await this.accountGateway.getAccountInfo(account, rucioAuthToken);
        if(accountInfoDTO.accountType === AccountType.USER) {
            return `user.${account}`;
        }else if(accountInfoDTO.accountType === AccountType.GROUP) {
            return `group.${account}`;
        } else {
            throw new Error(`Invalid account type for rule creation: ${accountInfoDTO.accountType}`);
        }
    }

    protected generateDerivedDIDName(newScope: string, selectedDID: DID): DID {
        const newName = `${newScope}.${selectedDID.name}_der${Date.now() / 1000}`;
        return {
            name: newName,
            scope: newScope,
            did_type: DIDType.DERIVED,
        } as DID
    }

    async execute(requestModel: AuthenticatedRequestModel<CreateRuleSummaryRequest>): Promise<void> {
        const didSummaryRows: TDIDSummaryRow[] = [];
        
        if(requestModel.withSamples) {
            const newScope: string = await this.generateNewScope(requestModel.rucioAuthToken, requestModel.account); 
            requestModel.selectedDIDs.forEach((did: DID) => {
            const dervicedDID: DID = this.generateDerivedDIDName(newScope, did);
            const didSummaryRow: TDIDSummaryRow = {
                did: dervicedDID,
                copies: requestModel.copies,
                files: requestModel.sampleFileCount,
                size: 'cannot be determined as DID has not been sampled',
                requested_size: 'cannot be determined as DID has not been sampled'
            };
            didSummaryRows.push(didSummaryRow);
            });
        } else {
            requestModel.selectedDIDs.forEach(async (did: DID) => {
                const didDTO: DIDExtendedDTO = await this.didGateway.getDID(
                    requestModel.rucioAuthToken,
                    did.scope,
                    did.name,
                    DIDType.FILE
                )
                if(didDTO.status === 'success') {
                    const didSummaryRow: TDIDSummaryRow = {
                        did: didDTO,
                        copies: requestModel.copies,
                        files: didDTO.length,
                        size: didDTO.bytes,
                        requested_size: requestModel.copies * didDTO.bytes,
                    }
                    didSummaryRows.push(didSummaryRow);
                } else {
                    // TODO: could not get DID info, handle error?
                }
            })
        }

    }
}