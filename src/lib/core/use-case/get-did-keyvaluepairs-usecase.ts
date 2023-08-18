import { BaseUseCase } from "@/lib/sdk/usecase";
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";
import { injectable } from "inversify";
import { DIDKeyValuePairsDataError, DIDKeyValuePairsDataRequest, DIDKeyValuePairsDataResponse } from "../usecase-models/did-keyvaluepairs-usecase-models";
import { DIDKeyValuePairsDTO } from "../dto/did-dto";
import USECASE_FACTORY from "@/lib/infrastructure/ioc/ioc-symbols-usecase-factory";
import { DIDKeyValuePairsDataInputPort, type DIDKeyValuePairsDataOutputPort } from "../port/primary/did-keyvaluepairs-ports";
import type DIDGatewayOutputPort from "../port/secondary/did-gateway-output-port";

@injectable()
class DIDKeyValuePairsDataUseCase extends BaseUseCase<
    AuthenticatedRequestModel<DIDKeyValuePairsDataRequest>,
    DIDKeyValuePairsDataResponse,
    DIDKeyValuePairsDataError,
    DIDKeyValuePairsDTO
> implements DIDKeyValuePairsDataInputPort {
    constructor(
        protected readonly presenter: DIDKeyValuePairsDataOutputPort,
        private readonly gateway: DIDGatewayOutputPort,
    ) {
        super(presenter)
    }
    validateRequestModel(requestModel: AuthenticatedRequestModel<DIDKeyValuePairsDataRequest>): DIDKeyValuePairsDataError | undefined {
        if (requestModel.scope === '' || requestModel.scope === undefined) {
            return {
                error: 'INVALID_REQUEST',
                message: 'Scope is required',
            } as DIDKeyValuePairsDataError
        }
        if (requestModel.did === '' || requestModel.did === undefined) {
            return {
                error: 'INVALID_REQUEST',
                message: 'DID is required',
            } as DIDKeyValuePairsDataError
        }
        if (requestModel.rucioAuthToken === '' || requestModel.rucioAuthToken === undefined) {
            return {
                error: 'INVALID_AUTH',
                message: 'Auth token is required',
            } as DIDKeyValuePairsDataError
        }
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<DIDKeyValuePairsDataRequest>): Promise<DIDKeyValuePairsDTO> {
        const dto: DIDKeyValuePairsDTO = await this.gateway.getDIDKeyValuePairs(requestModel.rucioAuthToken, requestModel.scope, requestModel.did);
        return dto;
    }

    handleGatewayError(error: DIDKeyValuePairsDTO): DIDKeyValuePairsDataError {
        return {
            status: 'error',
            error: error.errorMessage
        } as DIDKeyValuePairsDataError
    }

    processDTO(dto: DIDKeyValuePairsDTO): { data: DIDKeyValuePairsDataResponse | DIDKeyValuePairsDataError; status: "success" | "error"; } {
        return {
            data: {
                status: 'success',
                data: dto.data,
            },
            status: 'success'
        }
    }
}

export default DIDKeyValuePairsDataUseCase;