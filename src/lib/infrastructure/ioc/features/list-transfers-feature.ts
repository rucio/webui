import TransferGatewayOutputPort from "@/lib/core/port/secondary/transfer-gateway-output-port";
import ListTransfersUseCase from "@/lib/core/use-case/list-transfers-usecase";
import { ListTransfersError, ListTransfersRequest, ListTransfersResponse } from "@/lib/core/usecase-models/list-transfers-usecase-models";
import { BaseStreamableFeature, IOCSymbols } from "@/lib/sdk/ioc-helpers";
import { Container } from "inversify";
import ListTransfersController, { ListTransfersControllerParameters } from "../../controller/list-transfers-controller";
import { TransferViewModel } from "../../data/view-model/request";
import ListTransfersPresenter from "../../presenter/list-transfers-presenter";
import CONTROLLERS from "../ioc-symbols-controllers";
import GATEWAYS from "../ioc-symbols-gateway";
import INPUT_PORT from "../ioc-symbols-input-port";
import USECASE_FACTORY from "../ioc-symbols-usecase-factory";

export default class ListTransfersFeature extends BaseStreamableFeature<
    ListTransfersControllerParameters,
    ListTransfersRequest,
    ListTransfersResponse,
    ListTransfersError,
    TransferViewModel
> {
    constructor(appContainer: Container) {
        const transferGateway: TransferGatewayOutputPort = appContainer.get<TransferGatewayOutputPort>(GATEWAYS.TRANSFER)

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.LIST_TRANSFERS,
            USECASE_FACTORY: USECASE_FACTORY.LIST_TRANSFERS,
            INPUT_PORT: INPUT_PORT.LIST_TRANSFERS,
        }

        const useCaseConstructorArgs = [
            transferGateway,
        ]
        super(
            'ListTransfers',
            ListTransfersController,
            ListTransfersUseCase,
            useCaseConstructorArgs,
            ListTransfersPresenter,
            false,
            symbols
        )
    }
}