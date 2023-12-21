import { TransferStatsViewModel } from "@/lib/infrastructure/data/view-model/request-stats";
import { BaseSingleEndpointStreamingUseCase } from "@/lib/sdk/usecase";
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";
import { injectable } from "inversify";
import { ListTransferStatisticsDTO, TransferStatisticsDTO } from "../dto/transfer-dto";
import { ListTransferStatsInputPort, type ListTransferStatsOutputPort } from "../port/primary/list-transfer-stats-ports";
import type TransferGatewayOutputPort from "../port/secondary/transfer-gateway-output-port";
import { ListTransferStatsError, ListTransferStatsRequest, ListTransferStatsResponse } from "../usecase-models/list-transfer-stats-usecase-models";

@injectable()
export default class ListTransferStatsUseCase extends BaseSingleEndpointStreamingUseCase<
    AuthenticatedRequestModel<ListTransferStatsRequest>,
    ListTransferStatsResponse,
    ListTransferStatsError,
    ListTransferStatisticsDTO,
    TransferStatisticsDTO,
    TransferStatsViewModel
    > implements ListTransferStatsInputPort {

    constructor(
        protected readonly presenter: ListTransferStatsOutputPort,
        private readonly gateway: TransferGatewayOutputPort,
    ) {
        super(presenter)
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<ListTransferStatsRequest>): ListTransferStatsError | undefined {
        return undefined;
    }

    async intializeRequest(request: AuthenticatedRequestModel<AuthenticatedRequestModel<ListTransferStatsRequest>>): Promise<ListTransferStatsError | undefined> {
        return Promise.resolve(undefined);
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListTransferStatsRequest>): Promise<ListTransferStatisticsDTO> {
        const { rucioAuthToken } = requestModel;
        const dto: ListTransferStatisticsDTO = await this.gateway.listTransferStatistics(rucioAuthToken)
        return dto;
    }

    handleGatewayError(error: ListTransferStatisticsDTO): ListTransferStatsError {
        return {
            status: 'error',
            name: 'Gateway Error',
            code: error.errorCode || 500,
            message: error.errorMessage? error.errorMessage : 'Gateway Error',
        } as ListTransferStatsError
    }

    processStreamedData(dto: TransferStatisticsDTO): { data: ListTransferStatsResponse | ListTransferStatsError; status: "success" | "error"; } {
        if (dto.status === 'error') {
            const errorModel: ListTransferStatsError = {
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

        const responseModel: ListTransferStatsResponse = {
            ...dto,
            status: 'success',
        }

        return {
            status: 'success',
            data: responseModel,
        }
    }
}