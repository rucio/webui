import { BaseUseCase } from "@/lib/sdk/usecase";
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";
import { injectable } from "inversify";
import { generateDerivedDIDName, generateNewScope } from "../domain-service/did-domain-services";
import { AccountInfoDTO } from "../dto/account-dto";
import { DIDExtendedDTO } from "../dto/did-dto";
import { AccountType, DID, DIDLong, DIDType } from "../entity/rucio";
import type { CreateRuleSummaryInputPort, CreateRuleSummaryOutputPort } from "../port/primary/create-rule-summary-ports";
import type AccountGatewayOutputPort from "../port/secondary/account-gateway-output-port";
import type DIDGatewayOutputPort from "../port/secondary/did-gateway-output-port";
import { CreateRuleSummaryRequest, CreateRuleSummaryResponse, CreateRuleSummaryError } from "../usecase-models/create-rule-summary-usecase-models";
import {createDIDSummaryRow, TDIDSummaryRow} from "../domain-service/rule-domain-services";


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

    async execute(requestModel: AuthenticatedRequestModel<CreateRuleSummaryRequest>): Promise<void> {
        const account = requestModel.account;
        const rucioAuthToken = requestModel.rucioAuthToken;
        // DID Summary Table
        const didSummaryTable: TDIDSummaryRow[] = [];
        if(requestModel.withSamples) {
            const accountInfoDTO: AccountInfoDTO = await this.accountGateway.getAccountInfo(account, rucioAuthToken);
            const accountType: AccountType = accountInfoDTO.accountType;
            const newScope: string = generateNewScope(account, accountType); 
            requestModel.selectedDIDs.forEach((did: DID) => {
            const derivedDID: DID = generateDerivedDIDName(newScope, did);
            const didSummaryRow =  createDIDSummaryRow(derivedDID as DIDLong, requestModel.copies)
            didSummaryTable.push(didSummaryRow);
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
                    const didSummaryRow: TDIDSummaryRow = createDIDSummaryRow(
                        didDTO,
                        requestModel.copies,
                    );
                    didSummaryTable.push(didSummaryRow);
                } else {
                    // TODO: could not get DID info, handle error?
                }
            })
        }

        // RSE Summary Table




    }
}