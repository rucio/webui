import { TransferViewModel } from "@/lib/infrastructure/data/view-model/request";
import { BaseSingleEndpointStreamingUseCase } from "@/lib/sdk/usecase";
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";
import { injectable } from "inversify";
import { ListTransfersDTO, TransferDTO } from "../dto/transfer-dto";
import { ListTransfersInputPort, type ListTransfersOutputPort } from "../port/primary/list-transfers-ports";
import type TransferGatewayOutputPort from "../port/secondary/transfer-gateway-output-port";
import { ListTransfersError, ListTransfersRequest, ListTransfersResponse } from "../usecase-models/list-transfers-usecase-models";

@injectable()
export default class ListTransfersUseCase extends BaseSingleEndpointStreamingUseCase<
    AuthenticatedRequestModel<ListTransfersRequest>,
    ListTransfersResponse,
    ListTransfersError,
    ListTransfersDTO,
    TransferDTO,
    TransferViewModel
    > implements ListTransfersInputPort {

    constructor(
        protected readonly presenter: ListTransfersOutputPort,
        private readonly gateway: TransferGatewayOutputPort,
    ) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<AuthenticatedRequestModel<ListTransfersRequest>>): ListTransfersError | undefined {
        if ( requestModel.sourceRSE == '' || requestModel.sourceRSE == undefined ) {
            return {
                status: 'error',
                code: 400,
                name: 'Missing Source RSE',
                error: 'MISSING_SOURCE_RSE',
                message: 'The source RSE in the request is missing',
            } as ListTransfersError
        }
        else if ( requestModel.destRSE == '' || requestModel.destRSE == undefined ) {
            return {
                status: 'error',
                code: 400,
                name: 'Missing Destination RSE',
                error: 'MISSING_DEST_RSE',
                message: 'The destination RSE in the request is missing',
            } as ListTransfersError
        }
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<AuthenticatedRequestModel<ListTransfersRequest>>): Promise<ListTransfersDTO> {
        const { rucioAuthToken, sourceRSE, destRSE } = requestModel;
        const dto: ListTransfersDTO = await this.gateway.listTransfers(rucioAuthToken, sourceRSE, destRSE)
        return dto;
    }

    handleGatewayError(error: ListTransfersDTO): ListTransfersError {
        return {
            status: 'error',
            error: `Gateway returned with ${error.errorCode}: ${error.errorMessage}`,
            message: error.errorMessage? error.errorMessage : 'Gateway Error',
            name: 'Gateway Error',
            code: error.errorCode,
        } as ListTransfersError
    }

    processStreamedData(dto: TransferDTO): { data: ListTransfersResponse | ListTransfersError; status: "success" | "error"; } {
        if (dto.status === 'error') {
            const errorModel: ListTransfersError = {
                status: 'error',
                code: dto.errorCode || 500,
                message: dto.errorMessage || 'Could not fetch or process the fetched data',
                name: dto.errorName || 'Gateway Error',
            }

            return {
                status: 'error',
                data: errorModel,
            }
        }

        const responseModel: ListTransfersResponse = {
            ...dto,
            status: 'success',
        }

        return {
            data: responseModel,
            status: 'success',
        }
    }
}