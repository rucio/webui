import { BasePostProcessingPipelineElement } from "@/lib/sdk/postprocessing-pipeline-elements"
import { AccountAttributesDTO } from "../../dto/account-dto";
import { Role } from "../../entity/auth-models";
import AccountGatewayOutputPort from "../../port/secondary/account-gateway-output-port";
import { UserpassLoginV2Error, UserpassLoginV2Request, UserpassLoginV2Response } from "../../usecase-models/userpass-login-V2-usecase-models";

/**
 * Pipeline element of the UserpassLoginV2UseCase to get account attributes 
 */
export default class GetAccountAttributePipelineElement extends BasePostProcessingPipelineElement<UserpassLoginV2Request, UserpassLoginV2Response, UserpassLoginV2Error, AccountAttributesDTO> {
    constructor(private gateway: AccountGatewayOutputPort) {
        super();
    }

    async makeGatewayRequest(requestModel: UserpassLoginV2Request, responseModel: UserpassLoginV2Response): Promise<AccountAttributesDTO> {

        try {
            const { account } = requestModel;
            const rucioAuthToken = responseModel.rucioAuthToken
            const accountAttrs: AccountAttributesDTO = await this.gateway.listAccountAttributes(account, rucioAuthToken)
            return accountAttrs
        } catch (error: AccountAttributesDTO | any) {
            const errorDTO: AccountAttributesDTO = { account: 'undefined', status: 'error', attributes: [] };
            errorDTO.errorCode = 500;
            errorDTO.errorName = 'Gateway Error';
            errorDTO.errorMessage = (error as Error).message;
            responseModel.role = undefined
            return errorDTO;
        }

    }

    handleGatewayError(error: AccountAttributesDTO): UserpassLoginV2Error {
        const errorModel: UserpassLoginV2Error = {
            status: 'error',
            message: error.message ? error.message : 'no error message available',
            code: 400,
            name: 'Gateway error',
            type: 'ACCOUNT_ATTRIBUTE_ERROR',

        }
        return errorModel;
    }

    transformResponseModel(responseModel: UserpassLoginV2Response, dto: AccountAttributesDTO): UserpassLoginV2Response | UserpassLoginV2Error {

        dto.attributes.forEach((attr) => {
            if (attr.key == 'admin' && attr.value == 'True') {
                responseModel.role = Role.ADMIN;
            }
            else if (attr.key.startsWith('country-')) {
                responseModel.country = attr.key.split('-')[1];
                if (attr.value == 'admin') {
                    responseModel.countryRole = Role.ADMIN;
                } else if (attr.value == 'user') {
                    responseModel.countryRole = Role.USER;
                } else {
                    responseModel.countryRole = undefined;
                }
            } else {
                responseModel.role = Role.USER;
            }
        })

        responseModel.status = 'success'

        return responseModel
    }
}