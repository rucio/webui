import { BaseUseCase } from "@/lib/sdk/usecase";
import { AuthenticatedRequestModel, BaseErrorResponseModel } from "@/lib/sdk/usecase-models";
import { injectable } from "inversify";
import { generateDerivedDIDName, generateNewScope } from "../utils/did-utils";
import { AccountInfoDTO } from "../dto/account-dto";
import { DIDExtendedDTO } from "../dto/did-dto";
import { AccountType, DID, DIDLong, DIDType } from "../entity/rucio";
import type { CreateRuleSummaryInputPort, CreateRuleSummaryOutputPort } from "../port/primary/create-rule-summary-ports";
import type AccountGatewayOutputPort from "../port/secondary/account-gateway-output-port";
import type DIDGatewayOutputPort from "../port/secondary/did-gateway-output-port";
import { CreateRuleSummaryRequest, CreateRuleSummaryResponse, CreateRuleSummaryError } from "../usecase-models/create-rule-summary-usecase-models";
import {createDIDSummaryRow} from "../utils/create-rule-utils";
import { TDIDSummaryRow, TRSESummaryRow } from "../entity/rule-summary";
import { RSEAccountUsageLimitViewModel } from "@/lib/infrastructure/data/view-model/rse";
import DIDTypeTagStories from "@/component-library/Tags/DIDTypeTag.stories";


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
    validateRequestModel(requestModel: AuthenticatedRequestModel<CreateRuleSummaryRequest>): BaseErrorResponseModel | undefined {
        return undefined;
    }
    execute(requestModel: AuthenticatedRequestModel<CreateRuleSummaryRequest>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    // async execute(requestModel: AuthenticatedRequestModel<CreateRuleSummaryRequest>): Promise<void> {
    //     const account = requestModel.account;
    //     const rucioAuthToken = requestModel.rucioAuthToken;
    //     // DID Summary Table
    //     const didSummaryTable: TDIDSummaryRow[] = [];
    //     if(requestModel.withSamples) {
    //         const accountInfoDTO: AccountInfoDTO = await this.accountGateway.getAccountInfo(account, rucioAuthToken);
    //         const accountType: AccountType = accountInfoDTO.accountType;
    //         const newScope: string = generateNewScope(account, accountType); 
    //         requestModel.selectedDIDs.forEach((did: DID) => {
    //         const derivedDID: DID = generateDerivedDIDName(newScope, did);
    //         const didSummaryRow =  createDIDSummaryRow(derivedDID as DIDLong, requestModel.copies)
    //         didSummaryTable.push(didSummaryRow);
    //         });
    //     } else {
    //         requestModel.selectedDIDs.forEach(async (did: DID) => {
    //             const didDTO: DIDExtendedDTO = await this.didGateway.getDID(
    //                 requestModel.rucioAuthToken,
    //                 did.scope,
    //                 did.name,
    //                 DIDType.FILE
    //             )
    //             if(didDTO.status === 'success') {
    //                 const didSummaryRow: TDIDSummaryRow = createDIDSummaryRow(
    //                     didDTO,
    //                     requestModel.copies,
    //                 );
    //                 didSummaryTable.push(didSummaryRow);
    //             } else {
    //                 // TODO: could not get DID info, handle error?
    //             }
    //         })
    //     }

    //     // RSE Summary Table
    //     let needsApproval = false;
    //     const rseSummaryTable: TRSESummaryRow[] = requestModel.selectedRSEs.map((rseAccountUsageLimitViewModel: RSEAccountUsageLimitViewModel) => {
    //         if(!needsApproval){
    //             needsApproval = rseAccountUsageLimitViewModel.bytes_limit < rseAccountUsageLimitViewModel.total_expected_usage;
    //         }
    //         return {
    //             rse_id: rseAccountUsageLimitViewModel.rse_id,
    //             rse: rseAccountUsageLimitViewModel.rse,
    //             files: rseAccountUsageLimitViewModel.files,
    //             account: rseAccountUsageLimitViewModel.account,
    //             used_bytes: rseAccountUsageLimitViewModel.used_bytes,
    //             bytes_limit: rseAccountUsageLimitViewModel.bytes_limit,
    //             bytes_remaining: rseAccountUsageLimitViewModel.bytes_remaining,
    //             total_expected_usage: rseAccountUsageLimitViewModel.total_expected_usage,
    //             has_quota: rseAccountUsageLimitViewModel.has_quota,
    //         }
    //     });

        // Messages
        // const approval = requestModel.askApproval || needsApproval;
        // if( requested)
        // const messages: string[] = [];
        // const response = {
        //     needsApproval: approval,
        //     askApproval: requestModel.askApproval,
        //     // TODO: open DIDs in bold!
        //     dids: didSummaryTable,
        //     openDIDs: didSummaryTable.filter((didSummaryRow: TDIDSummaryRow) => didSummaryRow.open > didSummaryRow.numFiles),
        //     rses: rseSummaryTable,
        //     expires: requestModel.expires,
        //     samples: {
        //         requested: boolean,
        //         numFiles: 0,
        //     }
        //     multipleDIDs: boolean,
            
        // }

    // }
}