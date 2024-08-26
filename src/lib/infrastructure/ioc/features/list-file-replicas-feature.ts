import ReplicaGatewayOutputPort from "@/lib/core/port/secondary/replica-gateway-output-port"
import {
    ListFileReplicasError,
    ListFileReplicasRequest,
    ListFileReplicasResponse,
} from "@/lib/core/usecase-models/list-file-replicas-usecase-models"
import { ListFileReplicasControllerParameters } from "@/lib/infrastructure/controller/list-file-replicas-controller"
import ListFileReplicasController from "@/lib/infrastructure/controller/list-file-replicas-controller"
import { FileReplicaStateViewModel } from "@/lib/infrastructure/data/view-model/did"
import {
    BaseStreamableFeature,
    IOCSymbols,
} from "@/lib/sdk/ioc-helpers"
import GATEWAYS from "@/lib/infrastructure/ioc/ioc-symbols-gateway"
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers"
import INPUT_PORT from "@/lib/infrastructure/ioc/ioc-symbols-input-port"
import USECASE_FACTORY from "@/lib/infrastructure/ioc/ioc-symbols-usecase-factory"
import { Container } from 'inversify'

import ListFileReplicasUseCase from "@/lib/core/use-case/list-file-replicas-usecase"

import ListFileReplicasPresenter from "@/lib/infrastructure/presenter/list-file-replicas-presenter"



export default class ListFileReplicasFeature extends BaseStreamableFeature<
    ListFileReplicasControllerParameters,
    ListFileReplicasRequest,
    ListFileReplicasResponse,
    ListFileReplicasError,
    FileReplicaStateViewModel
> {
    constructor(appContainer: Container) {
        const replicaGateway = appContainer.get<ReplicaGatewayOutputPort>(GATEWAYS.REPLICA)
        
        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.LIST_FILE_REPLICAS,
            USECASE_FACTORY: USECASE_FACTORY.LIST_FILE_REPLICAS,
            INPUT_PORT: INPUT_PORT.LIST_FILE_REPLICAS,
        }
        const useCaseConstructorArgs = [
            replicaGateway,
            
        ]
        super(
            'ListFileReplicas',
            ListFileReplicasController,
            ListFileReplicasUseCase,
            useCaseConstructorArgs,
            ListFileReplicasPresenter,
            false,
            symbols
        )
    }
}