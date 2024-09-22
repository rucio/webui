import {injectable} from "inversify";
import {BaseSingleEndpointUseCase} from "@/lib/sdk/usecase"
import {AuthenticatedRequestModel} from "@/lib/sdk/usecase-models";

import {AddDIDError, AddDIDRequest, AddDIDResponse} from "@/lib/core/usecase-models/add-did-usecase-models";
import {AddDIDInputPort, type AddDIDOutputPort} from "@/lib/core/port/primary/add-did-ports";

import {AddDIDDTO} from "@/lib/core/dto/did-dto";
import type DIDGatewayOutputPort from "@/lib/core/port/secondary/did-gateway-output-port";
import {DIDType} from "@/lib/core/entity/rucio";

@injectable()
export default class AddDIDUseCase extends BaseSingleEndpointUseCase<AuthenticatedRequestModel<AddDIDRequest>, AddDIDResponse, AddDIDError, AddDIDDTO> implements AddDIDInputPort {

    constructor(
        protected readonly presenter: AddDIDOutputPort,
        private readonly gateway: DIDGatewayOutputPort,
    ) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<AddDIDRequest>): AddDIDError | undefined {
        if (requestModel.type !== 'Dataset' && requestModel.type !== 'Container') {
            return {
                code: 400,
                message: `Cannot add a did with ${requestModel.type}`,
                status: 'error',
                name: 'Invalid type'
            }
        }
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<AddDIDRequest>): Promise<AddDIDDTO> {
        const {rucioAuthToken, scope, name, type} = requestModel;
        const dto: AddDIDDTO = await this.gateway.addDID(rucioAuthToken, scope, name, type as DIDType);
        return dto;

    }

    handleGatewayError(error: AddDIDDTO): AddDIDError {
        return {
            status: 'error',
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: `Gateway Error`,
            code: error.errorCode,
        } as AddDIDError
    }

    processDTO(dto: AddDIDDTO): { data: AddDIDResponse | AddDIDError; status: "success" | "error"; } {
        // copy all fields from dto to response model except success
        const responseModel: AddDIDResponse = {
            ...dto,
            status: 'success',
        }

        return {
            status: 'success',
            data: responseModel,
        }
    }
}