import TransferGatewayOutputPort from "@/lib/core/port/secondary/transfer-gateway-output-port";
import ListTransferStatsUseCase from "@/lib/core/use-case/list-transfer-stats-usecase";
import { ListTransferStatsError, ListTransferStatsRequest, ListTransferStatsResponse } from "@/lib/core/usecase-models/list-transfer-stats-usecase-models";
import { BaseStreamableFeature, IOCSymbols } from "@/lib/sdk/ioc-helpers";
import { Container } from "inversify";
import ListTransferStatsController, { ListTransferStatsControllerParameters } from "../../controller/list-transfer-stats-controller";
import { TransferStatsViewModel } from "../../data/view-model/request-stats";
import ListTransferStatsPresenter from "../../presenter/list-transfer-stats-presenter";
import CONTROLLERS from "../ioc-symbols-controllers";
import GATEWAYS from "../ioc-symbols-gateway";
import INPUT_PORT from "../ioc-symbols-input-port";
import USECASE_FACTORY from "../ioc-symbols-usecase-factory";

export default class ListTransferStatsFeature extends BaseStreamableFeature<
ListTransferStatsControllerParameters,
ListTransferStatsRequest,
ListTransferStatsResponse,
ListTransferStatsError,
TransferStatsViewModel
> {
    constructor(appContainer: Container) {
        const transferGateway: TransferGatewayOutputPort = appContainer.get<TransferGatewayOutputPort>(GATEWAYS.TRANSFER)

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.LIST_TRANSFER_STATS,
            USECASE_FACTORY: USECASE_FACTORY.LIST_TRANSFER_STATS,
            INPUT_PORT: INPUT_PORT.LIST_TRANSFER_STATS
        }
        const useCaseConstructorArgs = [
            transferGateway,
        ]
        super(
            'ListTransferStats',
            ListTransferStatsController,
            ListTransferStatsUseCase,
            useCaseConstructorArgs,
            ListTransferStatsPresenter,
            false,
            symbols
        )
    }
}