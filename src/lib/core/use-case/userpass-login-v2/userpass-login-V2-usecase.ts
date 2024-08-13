import { injectable } from "inversify";
import { BaseSingleEndpointPostProcessingPipelineUseCase} from "@/lib/sdk/usecase"
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";
import { UserpassLoginV2Error, UserpassLoginV2Request, UserpassLoginV2Response } from "@/lib/core/usecase-models/userpass-login-V2-usecase-models";
import { UserpassLoginV2InputPort, type UserpassLoginV2OutputPort } from "@/lib/core/port/primary/userpass-login-V2-ports";
import { UserPassLoginV2AuthServerDTO } from "@/lib/core/dto/userpassLoginV2-dto";
import type AuthServerGatewayOutputPort from "@/lib/core/port/secondary/auth-server-gateway-output-port";
import { UserPassLoginAuthServerDTO } from "../../dto/auth-server-dto";
import GetAccountAttributePipelineElement from "./pipeline-element-get-account-attribute";
import type AccountGatewayOutputPort from "../../port/secondary/account-gateway-output-port";

/**
 * UseCase for UserPassLoginV2 workflow.
 */
@injectable()
export default class UserpassLoginV2UseCase extends BaseSingleEndpointPostProcessingPipelineUseCase<UserpassLoginV2Request, UserpassLoginV2Response, UserpassLoginV2Error, UserPassLoginAuthServerDTO> implements UserpassLoginV2InputPort {
    validateFinalResponseModel(responseModel: UserpassLoginV2Response): { isValid: boolean; errorModel?: UserpassLoginV2Error | undefined; } {
        return {
            isValid: true,
        }
    }

    private requestModel: UserpassLoginV2Request | undefined
    constructor(
        protected readonly presenter: UserpassLoginV2OutputPort,
        private readonly gateway: AuthServerGatewayOutputPort,
        readonly accountGateway: AccountGatewayOutputPort,
    ) {
        const pipelineElements = new GetAccountAttributePipelineElement(accountGateway);
        super(presenter, [pipelineElements]);
        this.gateway = gateway;
        this.requestModel = undefined;
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<UserpassLoginV2Request>): UserpassLoginV2Error | undefined {
        // set the request model here
        this.requestModel = requestModel;
        return undefined
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<UserpassLoginV2Request>): Promise<UserPassLoginV2AuthServerDTO> {
        const { username, password, account, vo } = requestModel;
        const dto: UserPassLoginV2AuthServerDTO = await this.gateway.userpassLogin(username, password, account, vo);
        return dto;

    }
    handleGatewayError(error: UserPassLoginV2AuthServerDTO): UserpassLoginV2Error {
        let error_type: 'AUTH_SERVER_CONFIGURATION_ERROR' | 'AUTH_SERVER_SIDE_ERROR' | 'INVALID_CREDENTIALS' | 'UNKNOWN_ERROR' | 'ACCOUNT_ATTRIBUTE_ERROR' | 'UNDEFINED_REQUEST_MODEL'
        switch (error.statusCode) {
            case 500: error_type = 'AUTH_SERVER_SIDE_ERROR'; break;
            case 502: error_type = 'AUTH_SERVER_SIDE_ERROR'; break;
            case 503: error_type = 'AUTH_SERVER_CONFIGURATION_ERROR'; break;
            case 401: error_type = 'INVALID_CREDENTIALS'; break;
            default: error_type = 'UNKNOWN_ERROR'; break;
        }
        const errorModel: UserpassLoginV2Error = {
            name: `Gateway Error`,
            type: error_type,
            message: error.message ? error.message : 'Gateway Error',
            status: "error",
            code: error.statusCode,

        }

        return errorModel


    }

    processDTO(dto: UserPassLoginV2AuthServerDTO): { data: UserpassLoginV2Response | UserpassLoginV2Error; status: "success" | "error"; } {

        if (this.requestModel === undefined) {
            return {
                status: "error",
                data: {
                    name: 'Invalid Login',
                    status: 'error',
                    type: 'UNDEFINED_REQUEST_MODEL',
                    message: 'The request model is undefined',
                    code: 400,

                } as UserpassLoginV2Error
            }
        }
        if (dto.statusCode == 200) {
            const responseModel: UserpassLoginV2Response = {
                status: "success",
                rucioIdentity: this.requestModel.username,
                rucioAccount: dto.account,
                rucioAuthToken: dto.authToken,
                rucioAuthTokenExpires: dto.authTokenExpires,
                vo: this.requestModel.vo,
                role: undefined,
                country: undefined,
                countryRole: undefined
            }
            return {
                status: 'success',
                data: responseModel,
            }

        }

        const errorModel: UserpassLoginV2Error = {
            name: 'error',
            type: 'UNKNOWN_ERROR',
            message: dto.message,
            status: "error",
            code: dto.statusCode,

        }

        return {
            status: 'error',
            data: errorModel,
        }
    }
}